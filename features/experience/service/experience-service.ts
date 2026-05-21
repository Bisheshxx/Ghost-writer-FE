import { request } from "@/lib/axios/request";
import { ExperienceFormData, IExperience } from "../types/experience-types";

export const ExperienceService = {
  getExperience: async () =>
    request<IExperience[]>({
      method: "GET",
      url: "v1/experience",
    }),

  createExperience: async (experience: ExperienceFormData) =>
    request<Partial<IExperience>>({
      method: "POST",
      url: "v1/experience",
      data: {
        experiences: [experience],
      },
    }),
  deleteExperience: async (id: string) =>
    request<null>({
      method: "DELETE",
      url: `v1/experience/${id}`,
    }),
  editExperience: async (id: string, data: ExperienceFormData) =>
    request<IExperience>({
      method: "PATCH",
      url: `v1/experience/${id}`,
      data,
    }),
};
