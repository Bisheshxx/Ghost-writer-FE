import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { ExperienceFormData } from "../types/experience-types";
import { ExperienceService } from "../service/experience-service";

export const EXPERIENCE_QUERY_KEY = "experience";

export function useExperiences() {
  return useApiQuery({
    queryKey: [EXPERIENCE_QUERY_KEY],
    queryFn: () => ExperienceService.getExperience(),
  });
}

export function useCreateExperience(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useApiMutation(ExperienceService.createExperience, {
    invalidateQueries: [EXPERIENCE_QUERY_KEY],
    ...options,
  });
}

export function useUpdateExperience(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useApiMutation(
    ({ id, data }: { id: string; data: ExperienceFormData }) =>
      ExperienceService.editExperience(id, data),
    {
      invalidateQueries: [EXPERIENCE_QUERY_KEY],
      ...options,
    },
  );
}

export function useDeleteExperience(options?: { onSuccess?: () => void }) {
  return useApiMutation(ExperienceService.deleteExperience, {
    invalidateQueries: [EXPERIENCE_QUERY_KEY],
    ...options,
  });
}
