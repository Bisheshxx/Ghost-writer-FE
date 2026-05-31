"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiResponse, PaginationMeta } from "@/shared/types/global.types";

import { JobTrackerService } from "../service/job-tracker-service";
import type {
  CreateJobPayload,
  GeneratedPayload,
  Job,
  JobsListParams,
  JobStatus,
  UpdateJobPayload,
} from "../types/job-tracker";

export const JOB_TRACKER_QUERY_KEY = "job-tracker";

const jobsQueryKey = (params: JobsListParams) =>
  [JOB_TRACKER_QUERY_KEY, "jobs", params] as const;

type MutationOptions<TData, TVariables> = {
  onSuccess?: (data: ApiResponse<TData>, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
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
  options?: MutationOptions<Job, { id: string; status: JobStatus }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: JobStatus }) =>
      JobTrackerService.updateJobStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [JOB_TRACKER_QUERY_KEY] });
      options?.onSuccess?.(data, variables);
    },
    onError: options?.onError,
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
