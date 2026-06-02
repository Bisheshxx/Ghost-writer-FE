export type JobStatus =
  | "Empty"
  | "Generated"
  | "Applied"
  | "Accepted"
  | "Rejected"
  | "Interview stage";

export type JobSortOrder = "asc" | "desc";

export type JobListItem = {
  id: string;
  company: string;
  title: string;
  location: string;
  status: JobStatus;
  link: string;
  hasCoverLetter: boolean;
  hasResume: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Job = {
  id: string;
  company: string;
  title: string;
  description: string;
  coverLetter?: string;
  resume?: string;
  location: string;
  status: JobStatus;
  link: string;
  createdAt?: string;
  updatedAt?: string;
};

export type JobRow = JobListItem;

export type JobsListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: JobStatus | "";
  sortOrder?: JobSortOrder;
};

export type JobsByStatusParams = {
  page?: number;
  limit?: number;
  status: JobStatus;
};

export type CreateJobPayload = {
  company: string;
  title: string;
  description: string;
  location: string;
  link: string;
  status?: JobStatus;
};

export type UpdateJobPayload = Partial<CreateJobPayload>;

export type GeneratedPayload = {
  jobId: string;
  resumeText: string;
  coverLetterText: string;
  model: string;
  createdAt: string;
};
