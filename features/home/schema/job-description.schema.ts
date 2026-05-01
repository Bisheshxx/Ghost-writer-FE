import z from "zod";

export const SchemaJobDescription = z.object({
  jobDescription: z.string().min(1, "Job description is required"),
});
// export const SchemaJobDescription = z.object({
//   jobDescription: z.string().min(1, "Job Description is required"),
// });
