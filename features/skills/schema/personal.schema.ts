import { z } from "zod";

export const personalSchema = z.object({
  skill: z.string().min(1, "Skill is required"),
});

export type PersonalFormData = z.infer<typeof personalSchema>;
