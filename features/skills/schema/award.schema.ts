import { z } from "zod";

export const awardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  details: z.string().optional(),
  issuer: z.string().optional(),
  issuedDate: z.string().optional(),
});

export type AwardFormData = z.infer<typeof awardSchema>;
