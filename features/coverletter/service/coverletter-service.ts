import { request } from "@/lib/axios/request";
import { CoverletterFormData } from "../types";

export const CoverLetterService = {
  generateCoverLetter: async (data: CoverletterFormData) =>
    request<string>({
      method: "POST",
      url: `v1/generate-cover-letter`,
      data,
    }),
};
