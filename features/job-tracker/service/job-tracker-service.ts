import { request } from "@/lib/axios/request";

import type {
  CreateJobPayload,
  GeneratedPayload,
  Job,
  JobsByStatusParams,
  JobListItem,
  JobsListParams,
  UpdateJobPayload,
  JobStatus,
} from "../types/job-tracker";

const getJobsListParams = (params: JobsListParams) => {
  const { status, sortOrder, ...rest } = params;

  return {
    ...rest,
    ...(status ? { status } : {}),
    ...(sortOrder ? { sortOrder } : {}),
  };
};

export const JobTrackerService = {
  getJobs: async (params: JobsListParams = {}) =>
    request<JobListItem[]>({
      method: "GET",
      url: "v1/jobs",
      params: getJobsListParams(params),
    }),

  getJobsByStatus: async (params: JobsByStatusParams) =>
    request<JobListItem[]>({
      method: "GET",
      url: "v1/jobs/status",
      params,
    }),

  createJob: async (job: CreateJobPayload) =>
    request<Job>({
      method: "POST",
      url: "v1/jobs",
      data: job,
    }),

  getJob: async (id: string) =>
    request<Job>({
      method: "GET",
      url: `v1/jobs/${id}`,
    }),

  updateJob: async (id: string, job: UpdateJobPayload) =>
    request<Job>({
      method: "PATCH",
      url: `v1/jobs/${id}`,
      data: job,
    }),

  updateJobStatus: async (id: string, status: JobStatus) =>
    request<Job>({
      method: "PATCH",
      url: `v1/jobs/${id}/status`,
      data: { status },
    }),

  deleteJob: async (id: string) =>
    request<null>({
      method: "DELETE",
      url: `v1/jobs/${id}`,
    }),

  generateJobDocuments: async (id: string) =>
    request<GeneratedPayload>({
      method: "POST",
      url: `v1/jobs/${id}/generate`,
    }),
};
