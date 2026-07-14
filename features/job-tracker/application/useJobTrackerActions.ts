"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { ApiResponse, PaginationMeta } from "@/shared/types/global.types";

import { JobTrackerService } from "../service/job-tracker-service";
import type {
  CreateJobPayload,
  GeneratedPayload,
  Job,
  JobsByStatusParams,
  JobListItem,
  JobsListParams,
  JobStatus,
  UpdateJobPayload,
} from "../types/job-tracker";

export const JOB_TRACKER_QUERY_KEY = "job-tracker";

const jobsQueryKey = (params: JobsListParams) =>
  [JOB_TRACKER_QUERY_KEY, "jobs", params] as const;

const jobsByStatusQueryKey = (params: Omit<JobsByStatusParams, "page">) =>
  [JOB_TRACKER_QUERY_KEY, "jobs", "status", params] as const;

const jobQueryKey = (id?: string) => [JOB_TRACKER_QUERY_KEY, "job", id] as const;

type MutationOptions<TData, TVariables> = {
  onSuccess?: (data: ApiResponse<TData>, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
};

type StatusMutationVariables = {
  id: string;
  status: JobStatus;
};

export function useJobs(params: JobsListParams) {
  const response = useQuery({
    queryKey: jobsQueryKey(params),
    queryFn: () => JobTrackerService.getJobs(params),
    retry: 1,
  });

  return {
    ...response,
    data: response.data?.data ?? [],
    meta: response.data?.meta as PaginationMeta | undefined,
  };
}

export function useJobsByStatusInfinite({
  limit = 10,
  status,
}: Omit<JobsByStatusParams, "page">) {
  const response = useInfiniteQuery({
    queryKey: jobsByStatusQueryKey({ limit, status }),
    queryFn: ({ pageParam }) =>
      JobTrackerService.getJobsByStatus({ limit, page: pageParam, status }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta as PaginationMeta | undefined;

      if (!meta?.hasNextPage) return undefined;

      return meta.page + 1;
    },
    retry: 1,
  });

  const pages = response.data?.pages ?? [];
  const rows = pages.flatMap((page) => page.data ?? []) as JobListItem[];
  const meta = pages.at(-1)?.meta as PaginationMeta | undefined;

  return {
    ...response,
    rows,
    meta,
  };
}

export function useJob(id?: string, enabled = true) {
  const response = useQuery({
    queryKey: jobQueryKey(id),
    queryFn: () => JobTrackerService.getJob(id as string),
    enabled: enabled && Boolean(id),
    retry: 1,
  });

  return {
    ...response,
    data: response.data?.data,
  };
}

export function useCreateJob(
  options?: MutationOptions<Job, CreateJobPayload>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: JobTrackerService.createJob,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [JOB_TRACKER_QUERY_KEY] });
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
  });
}

export function useUpdateJob(
  options?: MutationOptions<Job, { id: string; data: UpdateJobPayload }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobPayload }) =>
      JobTrackerService.updateJob(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [JOB_TRACKER_QUERY_KEY] });
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
  });
}

export function useUpdateJobStatus(
  options?: MutationOptions<Job, StatusMutationVariables>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: StatusMutationVariables) =>
      JobTrackerService.updateJobStatus(id, status),
    onSuccess: (data, variables) => {
      options?.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      options?.onError?.(error, variables);
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: [JOB_TRACKER_QUERY_KEY],
      });
    },
  });
}

export function useDeleteJob(options?: MutationOptions<null, string>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: JobTrackerService.deleteJob,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [JOB_TRACKER_QUERY_KEY] });
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
  });
}

export function useGenerateJobDocuments(
  options?: MutationOptions<GeneratedPayload, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: JobTrackerService.generateJobDocuments,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [JOB_TRACKER_QUERY_KEY] });
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
  });
}
