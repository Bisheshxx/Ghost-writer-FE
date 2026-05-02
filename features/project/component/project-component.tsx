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
import { DIALOG_ENUMS } from "@/shared/constants";
import useUiState from "@/store/useUIStore";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import ProjectForm from "../form/project.form";
import { IProject } from "../types/project.d";

export default function ProjectComponent() {
  const projects: IProject[] = [
    {
      _id: "69e1bff248d57ef84f7a3d41",
      user: "69e18eeb510a6b300eebc06e",
      projectTitle: "Ghost Admin Dashboard",
      details:
        "Built a responsive internal dashboard for managing user content, analytics, and moderation workflows. Included reusable tables, filters, and toast-driven feedback states.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "TanStack Query"],
      __v: 0,
      createdAt: "2026-04-17T05:06:58.752Z",
      updatedAt: "2026-04-17T05:06:58.752Z",
    },
    {
      _id: "69e1bff248d57ef84f7a3d42",
      user: "69e18eeb510a6b300eebc06e",
      projectTitle: "Portfolio CMS",
      details:
        "Created a content management interface for updating personal portfolio sections without editing code directly. Focused on form validation, dialog flows, and clean editing patterns.",
      stack: ["React", "Zustand", "React Hook Form", "Zod"],
      __v: 0,
      createdAt: "2026-04-17T05:06:58.752Z",
      updatedAt: "2026-04-17T05:06:58.752Z",
    },
    {
      _id: "69e1bff248d57ef84f7a3d43",
      user: "69e18eeb510a6b300eebc06e",
      projectTitle: "Realtime Collaboration Tool",
      details:
        "Designed a lightweight collaboration app with shared task boards, live updates, and role-aware actions. Optimized for fast navigation and simple project tracking.",
      stack: ["Node.js", "WebSockets", "PostgreSQL", "Docker"],
      __v: 0,
      createdAt: "2026-04-17T05:06:58.752Z",
      updatedAt: "2026-04-17T05:06:58.752Z",
    },
  ];

  const { setOpenDialogName } = useUiState();

  const handleAddClick = () => {
    setOpenDialogName(DIALOG_ENUMS.CREATE_PROJECT);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <Button onClick={handleAddClick} className="text-sm">
          Add Project
        </Button>
      </div>
      <div className="overflow-auto flex flex-col gap-6">
        {projects.map((project) => (
          <ProjectCardComponent project={project} key={project._id} />
        ))}
      </div>

      <ProjectAddDialog />

      <ProjectEditDialog />

      <ProjectDeleteDialog />
    </>
  );
}

function ProjectAddDialog() {
  const { setOpenDialogName } = useUiState();

  const handleSave = (data: Partial<IProject>) => {
    console.log("Creating new project:", data);
    setOpenDialogName(null);
  };

  const handleCancel = () => {
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-5xl"
      title="Add Project"
      description="Add a new project to your profile"
      dialogName={DIALOG_ENUMS.CREATE_PROJECT}
    >
      <ProjectForm onSave={handleSave} onCancel={handleCancel} />
    </CustomDialog>
  );
}

function ProjectEditDialog() {
  const { selectedProject, setOpenDialogName } = useUiState();

  if (!selectedProject) return null;

  const handleSave = (data: Partial<IProject>) => {
    console.log("Saving:", data);
    setOpenDialogName(null);
  };

  const handleCancel = () => {
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-5xl"
      title="Edit Project"
      description="Update your project details below"
      dialogName={DIALOG_ENUMS.EDIT_PROJECT}
    >
      <ProjectForm
        project={selectedProject}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </CustomDialog>
  );
}

function ProjectDeleteDialog() {
  const { selectedProject, setOpenDialogName } = useUiState();

  if (!selectedProject) return null;

  const handleConfirm = () => {
    console.log("Deleted");
    setOpenDialogName(null);
  };

  const handleCancel = () => {
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-sm"
      title="Delete Project?"
      description={`Are you sure you want to delete "${selectedProject.projectTitle}"? This action cannot be undone.`}
      dialogName={DIALOG_ENUMS.DELETE_PROJECT}
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
  const { setOpenDialogName, setSelectedProject } = useUiState();

  const handleEditClick = () => {
    setSelectedProject(project);
    setOpenDialogName(DIALOG_ENUMS.EDIT_PROJECT);
  };

  const handleDeleteClick = () => {
    setSelectedProject(project);
    setOpenDialogName(DIALOG_ENUMS.DELETE_PROJECT);
  };

  return (
    <Card className="w-full shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow">
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
          <p className="text-gray-700 text-xs md:text-sm leading-relaxed whitespace-pre-line line-clamp-4 sm:line-clamp-none">
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
