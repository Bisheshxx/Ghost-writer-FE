import { z } from "zod";

export const jobTrackerEntrySchema = z.object({
  company: z.string().min(1, "Company name is required"),
  title: z.string().min(1, "Job title is required"),
  description: z.string().min(1, "Job description is required"),
  location: z.string().min(1, "Location is required"),
  link: z.string().min(1, "Job link is required").url("Enter a valid URL"),
});

export type JobTrackerEntryFormValues = z.infer<typeof jobTrackerEntrySchema>;
