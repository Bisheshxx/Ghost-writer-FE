import { request } from "@/lib/axios/request";
import {
  IAwards,
  IPersonalSkill,
  ISkill,
  ITechnicalSkill,
} from "../types/skills";
import { PersonalFormData } from "../schema/personal.schema";
import { TechnicalListFormData } from "../schema/technical.schema";
import { AwardFormData } from "../schema/award.schema";
import { CreateSkillPayload } from "../schema/create-skill.schema";

export const SkillsService = {
  getSkills: async () =>
    request<ISkill[]>({
      method: "GET",
      url: `v1/skills`,
    }),

  createSkill: async (skills: CreateSkillPayload) =>
    request<ISkill>({
      method: "POST",
      url: `v1/skills`,
      data: {
        skills,
      },
    }),
  updatePersonalSkills: async (id: string, personalSkills: PersonalFormData) =>
    request<IPersonalSkill>({
      method: "PUT",
      url: `v1/skills/personalSkills/${id}`,
      data: {
        personalSkills: personalSkills.personalSkills,
      },
    }),
  updateTechnicalSkills: async (
    id: string,
    technicalSkills: TechnicalListFormData,
  ) =>
    request<ITechnicalSkill>({
      method: "PUT",
      url: `v1/skills/technicalSkills/${id}`,
      data: {
        technicalSkills: technicalSkills.technicalSkills,
      },
    }),

  updateAwards: async (id: string, awards: AwardFormData) =>
    request<IAwards>({
      method: "PUT",
      url: `v1/skills/awards/${id}`,
      data: {
        awards: awards.awards,
      },
    }),
};
