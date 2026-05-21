import { z } from "zod";

export const awardListSchema = z.object({
  awards: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
        details: z.string().min(1, "Details is required"),
        issuer: z.string().min(1, "Issuer is required"),
        issuedDate: z.string(),
        // _id: z.string(),
      }),
    )
    .min(1, "Add at least one award"),
});

export type AwardFormData = z.infer<typeof awardListSchema>;
