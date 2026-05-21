import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { QualificationFormData } from "../schema/qualification.schema";
import { QualificationServce } from "../service/qualification-service";

export const QUALIFICATION_QUERY_KEY = "qualifications";

export function useQualifications() {
  return useApiQuery({
    queryKey: [QUALIFICATION_QUERY_KEY],
    queryFn: () => QualificationServce.getQualification(),
  });
}

export function useCreateQualification(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useApiMutation(QualificationServce.createQualification, {
    invalidateQueries: [QUALIFICATION_QUERY_KEY],
    ...options,
  });
}

export function useUpdateQualification(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useApiMutation(
    ({ id, data }: { id: string; data: QualificationFormData }) =>
      QualificationServce.editQualification(id, data),
    {
      invalidateQueries: [QUALIFICATION_QUERY_KEY],
      ...options,
    },
  );
}

export function useDeleteQualification(options?: { onSuccess?: () => void }) {
  return useApiMutation(QualificationServce.deleteQualification, {
    invalidateQueries: [QUALIFICATION_QUERY_KEY],
    ...options,
  });
}
