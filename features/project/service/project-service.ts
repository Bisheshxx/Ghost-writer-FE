import { request } from "@/lib/axios/request";
import { IProject } from "../types/project";
import { ProjectFormData } from "../schema/project.schema";

export const ProjectService = {
  getProject: async () =>
    request<IProject[]>({
      method: "GET",
      url: `v1/project`,
    }),
  createProject: async (project: ProjectFormData) =>
    request<IProject>({
      method: "POST",
      url: `v1/project`,
      data: {
        project: [
          {
            ...project,
            stack: project.stack
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          },
        ],
      },
    }),
  deleteProject: async (id: string) =>
    request<null>({
      method: "DELETE",
      url: `v1/project/${id}`,
    }),
  editProject: async (id: string, project: ProjectFormData) =>
    request<IProject>({
      method: "PATCH",
      url: `v1/project/${id}`,
      data: {
        project: {
          ...project,
          stack: project.stack
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      },
    }),
};
