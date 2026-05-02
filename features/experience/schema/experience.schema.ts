import z from "zod";

export const experienceSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  companyName: z.string().min(1, "Company name is required"),
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
    .optional()
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
  Descriptions: z.string().min(1, "Description is required"),
  relavantDetails: z.string().optional(),
  isCurrent: z.boolean(),
});
