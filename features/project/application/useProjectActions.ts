import { useApiMutation } from "@/shared/hooks/useApiMutation";
import { useApiQuery } from "@/shared/hooks/useApiQuery";
import { ProjectFormData } from "../schema/project.schema";
import { ProjectService } from "../service/project-service";

export const PROJECT_QUERY_KEY = "project";

export function useProjects() {
  return useApiQuery({
    queryKey: [PROJECT_QUERY_KEY],
    queryFn: () => ProjectService.getProject(),
  });
}

export function useCreateProject(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useApiMutation(ProjectService.createProject, {
    invalidateQueries: [PROJECT_QUERY_KEY],
    ...options,
  });
}

export function useUpdateProject(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useApiMutation(
    ({ id, data }: { id: string; data: ProjectFormData }) =>
      ProjectService.editProject(id, data),
    {
      invalidateQueries: [PROJECT_QUERY_KEY],
      ...options,
    },
  );
}

export function useDeleteProject(options?: { onSuccess?: () => void }) {
  return useApiMutation(ProjectService.deleteProject, {
    invalidateQueries: [PROJECT_QUERY_KEY],
    ...options,
  });
}
