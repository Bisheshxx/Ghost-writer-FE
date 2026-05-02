import { z } from "zod";

export const projectSchema = z.object({
  projectTitle: z.string().min(1, "Project title is required"),
  details: z.string().min(1, "Project details are required"),
  stack: z
    .string()
    .min(1, "Stack is required")
    .refine((val) => val.split(",").some((item) => item.trim().length > 0), {
      message: "Stack must contain at least one technology",
    }),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
