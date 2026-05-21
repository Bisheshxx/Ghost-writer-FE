import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { CoverletterFormData } from "../types";
import { CoverLetterService } from "../service/coverletter-service";

type GenerateCoverLetterOptions = Parameters<
  typeof useApiMutation<string, CoverletterFormData>
>[1];

export function useGenerateCoverLetter(options?: GenerateCoverLetterOptions) {
  return useApiMutation(
    (jobDescription: CoverletterFormData) =>
      CoverLetterService.generateCoverLetter(jobDescription),
    options,
  );
}
