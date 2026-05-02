import { ApiResponse } from "@/shared/types/global.types";
import { IQualification } from "../types/qualification";
import { request } from "@/lib/axios/request";
import { QualificationFormData } from "../schema/qualification.schema";
import { IExperience } from "@/features/experience/types/experience-types";

export const QualificationServce = {
  getQualification: async () =>
    request<ApiResponse<IQualification[]>>({
      method: "GET",
      url: `v1/qualification`,
    }),
  createQualification: async (qualification: QualificationFormData) =>
    request<ApiResponse<IExperience>>({
      method: "POST",
      url: `v1/qualification`,
      data: {
        qualification: [qualification],
      },
    }),
  deleteQualification: async (id: string) =>
    request<ApiResponse<null>>({
      method: "DELETE",
      url: `v1/qualification/${id}`,
    }),
  editQualification: async (id: string, qualification: QualificationFormData) =>
    request<ApiResponse<IQualification>>({
      method: "PATCH",
      url: `v1/qualification/${id}`,
      data: {
        qualification,
      },
    }),
};
