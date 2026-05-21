import { z } from "zod";

export const createTechnicalSkillItemSchema = z.object({
  category: z.string().min(1, "Category is required"),
  technologies: z
    .array(z.string().min(1, "Technology cannot be empty"))
    .min(1, "At least one technology is required"),
});

export const createTechnicalStepSchema = z.object({
  technicalSkills: z
    .array(createTechnicalSkillItemSchema)
    .min(1, "Add at least one technical skill"),
});

export type CreateTechnicalStepData = z.infer<typeof createTechnicalStepSchema>;

export const createPersonalStepSchema = z.object({
  personalSkills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "Add at least one personal skill"),
});

export type CreatePersonalStepData = z.infer<typeof createPersonalStepSchema>;

export const createAwardItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  details: z.string().min(1, "Details is required"),
  issuer: z.string().min(1, "Issuer is required"),
  issuedDate: z.string().min(1, "Issued date is required"),
});

export const createAwardsStepSchema = z.object({
  awards: z.array(createAwardItemSchema).min(1, "Add at least one award"),
});

export type CreateAwardsStepData = z.infer<typeof createAwardsStepSchema>;

export type CreateSkillPayload = CreateTechnicalStepData &
  CreatePersonalStepData &
  CreateAwardsStepData;
