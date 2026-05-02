import { z } from "zod";

export const technicalSchema = z.object({
  category: z.string().min(1, "Category is required"),
  technologies: z
    .string()
    .min(1, "At least one technology is required")
    .refine((val) => val.split(",").some((t) => t.trim().length > 0), {
      message: "Provide comma separated technologies",
    }),
});

export type TechnicalFormData = z.infer<typeof technicalSchema>;

export const technicalListSchema = z.object({
  technicalSkills: z
    .array(
      z.object({
        category: z.string().min(1, "Category is required"),
        technologies: z
          .array(z.string().min(1, "Technology cannot be empty"))
          .min(1, "At least one technology is required"),
      }),
    )
    .min(1, "At least one technical skill is required"),
});

export type TechnicalListFormData = z.infer<typeof technicalListSchema>;
