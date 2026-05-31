export type JobStatus =
  | "Empty"
  | "Generated"
  | "Applied"
  | "Accepted"
  | "Rejected"
  | "Interview stage";

export type JobRow = {
  id: string;
  company: string;
  title: string;
  description: string;
  location: string;
  status: JobStatus;
  link: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Job = Required<JobRow>;

export type JobsListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: JobStatus | "";
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
