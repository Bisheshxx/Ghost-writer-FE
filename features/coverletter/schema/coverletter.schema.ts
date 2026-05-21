import { z } from "zod";
export const coverLetterSchema = z.object({
  jobDescription: z.string().min(1, "Job Description is required"),
});
