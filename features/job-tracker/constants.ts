import type { JobStatus } from "./types/job-tracker";

export const JOB_STATUS_OPTIONS = [
  "Empty",
  "Generated",
  "Applied",
  "Accepted",
  "Rejected",
  "Interview stage",
] as const satisfies readonly JobStatus[];

export const JOB_TABLE_HEADERS = [
  "Company",
  "Job Title",
  "Job Description",
  "Location",
  "Status",
  "Generation",
  "Job Link",
  "Actions",
] as const;

export const JOB_SUMMARY_ITEMS = [
  "Drafts for generation",
  "Ready to send",
  "Applied",
] as const;

export const JOB_FILTER_CHIPS = [
  "Remote",
  "Ready for generation",
  "Needs resume refresh",
] as const;
