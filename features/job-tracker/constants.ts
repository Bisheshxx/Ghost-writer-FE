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
  "Location",
  "Status",
  "Generation",
  "Job Link",
  "Actions",
] as const;

export const JOB_TRACKER_DIALOGS = {
  CREATE: "job-tracker:create",
  EDIT: "job-tracker:edit",
  DELETE: "job-tracker:delete",
} as const;

export type JobTrackerDialog =
  (typeof JOB_TRACKER_DIALOGS)[keyof typeof JOB_TRACKER_DIALOGS];
