"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogFooter } from "@/components/ui/dialog";
import CustomDialog from "@/shared/component/dialog/CustomDialog";
import { PROJECT_DIALOGS } from "../constants";
import { useProjectUiStore } from "../store/useProjectUiStore";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import ProjectForm from "../form/project.form";
import { IProject } from "../types/project.d";
import { Suspense, useState } from "react";
import Loading from "@/app/loading";
import NothingToDisplay from "@/shared/component/NothingToDisplay";
import { showSuccess } from "@/lib/toast/toast.lib";
import { ProjectFormData } from "../schema/project.schema";
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "../application/useProjectActions";

export default function ProjectComponent() {
  const { setOpenDialogName } = useProjectUiStore();

  const handleAddClick = () => {
    setOpenDialogName(PROJECT_DIALOGS.CREATE);
  };

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <Button onClick={handleAddClick} className="text-sm">
          Add Project
        </Button>
      </div>
      <Suspense fallback={<Loading />}>
        <ProjectCards />
      </Suspense>

      <ProjectAddDialog />

      <ProjectEditDialog />

      <ProjectDeleteDialog />
    </div>
  );
}

function ProjectCards() {
  const { data: projects, isSuccess } = useProjects();

  if (isSuccess)
    return (
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 flex flex-col mb-6">
        {projects && Array.isArray(projects) && projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCardComponent project={project} key={project._id} />
          ))
        ) : (
          <NothingToDisplay />
        )}
      </div>
    );
}

function ProjectAddDialog() {
  const { openDialogName, setOpenDialogName } = useProjectUiStore();
  const [serverError, setServerError] = useState<any>(null);

  const createProject = useCreateProject({
    onSuccess: () => {
      showSuccess("Project added successfully!");
      setOpenDialogName(null);
      setServerError(null);
    },
    onError: (error) => {
      setServerError(error);
    },
  });

  const handleSave = async (data: ProjectFormData) => {
    setServerError(null);
    await createProject.mutateAsync(data);
  };

  const handleCancel = () => {
    setServerError(null);
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-5xl"
      title="Add Project"
      description="Add a new project to your profile"
      dialogName={PROJECT_DIALOGS.CREATE}
      openDialogName={openDialogName}
      onOpenDialogChange={setOpenDialogName}
    >
      <ProjectForm
        onSave={handleSave}
        onCancel={handleCancel}
        serverError={serverError}
      />
    </CustomDialog>
  );
}

function ProjectEditDialog() {
  const { openDialogName, selectedProject, setOpenDialogName } =
    useProjectUiStore();
  const [serverError, setServerError] = useState<any>(null);

  const editProject = useUpdateProject({
    onSuccess: () => {
      showSuccess("Project updated successfully!");
      setOpenDialogName(null);
      setServerError(null);
    },
    onError: (error) => {
      setServerError(error);
    },
  });

  if (!selectedProject) return null;

  const handleSave = async (data: ProjectFormData) => {
    setServerError(null);
    await editProject.mutateAsync({
      id: selectedProject._id,
      data,
    });
  };

  const handleCancel = () => {
    setServerError(null);
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-5xl"
      title="Edit Project"
      description="Update your project details below"
      dialogName={PROJECT_DIALOGS.EDIT}
      openDialogName={openDialogName}
      onOpenDialogChange={setOpenDialogName}
    >
      <ProjectForm
        project={selectedProject}
        onSave={handleSave}
        onCancel={handleCancel}
        serverError={serverError}
      />
    </CustomDialog>
  );
}

function ProjectDeleteDialog() {
  const {
    openDialogName,
    selectedProject,
    setSelectedProject,
    setOpenDialogName,
  } = useProjectUiStore();

  const DeleteProject = useDeleteProject({
    onSuccess: () => {
      showSuccess("Successfully deleted project!");
      setSelectedProject(null);
    },
  });

  if (!selectedProject) return null;

  const handleConfirm = async () => {
    try {
      await DeleteProject.mutateAsync(selectedProject._id);
      setOpenDialogName(null);
    } catch {
      // Error handling is managed by mutation hook
    }
  };

  const handleCancel = () => {
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-sm"
      title="Delete Project?"
      description={`Are you sure you want to delete "${selectedProject.projectTitle}"? This action cannot be undone.`}
      dialogName={PROJECT_DIALOGS.DELETE}
      openDialogName={openDialogName}
      onOpenDialogChange={setOpenDialogName}
    >
      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={handleCancel} className="text-sm">
          Cancel
        </Button>
        <Button
          variant="outline"
          className="text-sm text-red-600 border-red-300 hover:bg-red-50"
          onClick={handleConfirm}
        >
          Delete
        </Button>
      </DialogFooter>
    </CustomDialog>
  );
}

const ProjectCardComponent = ({ project }: { project: IProject }) => {
  const { setOpenDialogName, setSelectedProject } = useProjectUiStore();

  const handleEditClick = () => {
    setSelectedProject(project);
    setOpenDialogName(PROJECT_DIALOGS.EDIT);
  };

  const handleDeleteClick = () => {
    setSelectedProject(project);
    setOpenDialogName(PROJECT_DIALOGS.DELETE);
  };

  return (
    <Card className="w-full shrink-0 shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow mb-6">
      <CardHeader className="pb-2 md:pb-4 px-2.5 sm:px-4 md:px-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xs sm:text-sm md:text-lg lg:text-2xl font-semibold text-gray-900 wrap-break-word">
              {project.projectTitle}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 shrink-0"
              >
                <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs sm:text-sm">
              <DropdownMenuItem onClick={handleEditClick}>
                <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-2.5 sm:px-4 md:px-6 pb-5">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-tight sm:tracking-wide mb-1.5 sm:mb-2">
            Details
          </p>
          <p className="text-gray-700 text-xs md:text-sm leading-relaxed whitespace-pre-line">
            {project.details}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-tight sm:tracking-wide mb-1.5 sm:mb-2">
            Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
