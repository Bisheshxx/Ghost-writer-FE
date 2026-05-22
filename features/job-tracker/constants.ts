import type { JobRow, JobStatus } from "./types/job-tracker";

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

export const INITIAL_JOB_ROWS: JobRow[] = [
  {
    id: "1",
    company: "Orbit Pay",
    title: "Frontend Engineer",
    description:
      "Own the application workflow surface and improve conversion for candidate review.",
    location: "Auckland, NZ",
    status: "Generated",
    link: "https://example.com/orbit",
  },
  {
    id: "2",
    company: "Northstar AI",
    title: "Product Engineer",
    description:
      "Build systems that connect applicant data to recruiter tooling and reporting.",
    location: "Remote",
    status: "Empty",
    link: "https://example.com/northstar",
  },
  {
    id: "3",
    company: "Harbor Health",
    title: "Full Stack Developer",
    description:
      "Create a clinician-facing dashboard with reliable state and dense data views.",
    location: "Wellington, NZ",
    status: "Applied",
    link: "https://example.com/harbor",
  },
];
