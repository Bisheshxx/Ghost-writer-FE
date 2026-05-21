import { z } from "zod";

export const personalListSchema = z.object({
  personalSkills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "Add at least one skill"),
});

export type PersonalFormData = z.infer<typeof personalListSchema>;
