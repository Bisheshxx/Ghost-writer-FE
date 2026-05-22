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
};

export type GeneratedPayload = Pick<
  JobRow,
  "company" | "title" | "description" | "location"
>;
