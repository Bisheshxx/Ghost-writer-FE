import { request } from "@/lib/axios/request";
import { ApiResponse } from "@/shared/types/global.types";
import React from "react";
import { IExperience } from "../types/experience-types";

export const ExperienceService = {
  getExperience: async () =>
    request<ApiResponse<IExperience[]>>({
      method: "GET",
      url: "v1/experience",
    }),
};
