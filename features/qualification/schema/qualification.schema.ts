import { z } from "zod";

export const qualificationSchema = z.object({
  qualification: z
    .string()
    .min(1, "Qualification is required")
    .min(2, "Qualification must be at least 2 characters"),
  instituteName: z
    .string()
    .min(1, "Institute name is required")
    .min(2, "Institute name must be at least 2 characters"),
  descriptions: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  startDate: z
    .string()
    .min(1, "Start date is required")
    .refine(
      (val) => {
        if (!val) return false;
        const today = new Date();
        const cur = `${today.getFullYear()}-${String(
          today.getMonth() + 1,
        ).padStart(2, "0")}`;
        return val <= cur;
      },
      { message: "Start date cannot be in the future" },
    ),
  endDate: z
    .string()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        const today = new Date();
        const cur = `${today.getFullYear()}-${String(
          today.getMonth() + 1,
        ).padStart(2, "0")}`;
        return val <= cur;
      },
      { message: "End date cannot be in the future" },
    ),
  isCurrent: z.boolean(),
  relavantDetails: z.string(),
});

// const QualificationSchema = z.object({
//   qualification: requiredString("Qualification"),
//   descriptions: requiredString("Descriptions"),
//   instituteName: requiredString("Institute name"),
//   relavantDetails: requiredString("Relavant details"),
//   startDate: monthYearSchema,
//   endDate: monthYearSchema.nullable().optional(),
//   isCurrent: z.boolean(),
// });

export type QualificationFormData = z.infer<typeof qualificationSchema>;
