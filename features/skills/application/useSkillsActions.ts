import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { AwardFormData } from "../schema/award.schema";
import { CreateSkillPayload } from "../schema/create-skill.schema";
import { PersonalFormData } from "../schema/personal.schema";
import { TechnicalListFormData } from "../schema/technical.schema";
import { SkillsService } from "../services/skills-service";

export const SKILLS_QUERY_KEY = "skills";

export function useSkills() {
  return useApiQuery({
    queryKey: [SKILLS_QUERY_KEY],
    queryFn: () => SkillsService.getSkills(),
  });
}

export function useCreateSkill(options?: { onSuccess?: () => void }) {
  return useApiMutation(
    (skills: CreateSkillPayload) => SkillsService.createSkill(skills),
    {
      invalidateQueries: [SKILLS_QUERY_KEY],
      ...options,
    },
  );
}

export function useUpdateTechnicalSkills(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useApiMutation(
    ({ id, data }: { id: string; data: TechnicalListFormData }) =>
      SkillsService.updateTechnicalSkills(id, data),
    {
      invalidateQueries: [SKILLS_QUERY_KEY],
      ...options,
    },
  );
}

export function useUpdatePersonalSkills(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useApiMutation(
    ({ id, data }: { id: string; data: PersonalFormData }) =>
      SkillsService.updatePersonalSkills(id, data),
    {
      invalidateQueries: [SKILLS_QUERY_KEY],
      ...options,
    },
  );
}

export function useUpdateAwards(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useApiMutation(
    ({ id, data }: { id: string; data: AwardFormData }) =>
      SkillsService.updateAwards(id, data),
    {
      invalidateQueries: [SKILLS_QUERY_KEY],
      ...options,
    },
  );
}
