"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { IProject } from "../types/project.d";
import { projectSchema, ProjectFormData } from "../schema/project.schema";

interface ProjectFormProps {
  project?: IProject;
  onSave: (data: Partial<IProject>) => void;
  onCancel: () => void;
}

export default function ProjectForm({
  project,
  onSave,
  onCancel,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectTitle: project?.projectTitle || "",
      details: project?.details || "",
      stack: project?.stack?.join(", ") || "",
    },
  });

  useEffect(() => {
    reset({
      projectTitle: project?.projectTitle || "",
      details: project?.details || "",
      stack: project?.stack?.join(", ") || "",
    });
  }, [project, reset]);

  const onSubmit = (data: ProjectFormData) => {
    onSave({
      projectTitle: data.projectTitle,
      details: data.details,
      stack: data.stack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="projectTitle" className="text-xs sm:text-sm">
          Project Title *
        </Label>
        <Input
          id="projectTitle"
          placeholder="e.g., Ghost Dashboard"
          {...register("projectTitle")}
          className="text-xs sm:text-sm mt-1"
        />
        {errors.projectTitle && (
          <p className="text-red-500 text-xs mt-1">
            {errors.projectTitle.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="details" className="text-xs sm:text-sm">
          Details *
        </Label>
        <Textarea
          id="details"
          placeholder="Describe the project, goals, and what you built"
          rows={5}
          {...register("details")}
          className="text-xs sm:text-sm mt-1"
        />
        {errors.details && (
          <p className="text-red-500 text-xs mt-1">{errors.details.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="stack" className="text-xs sm:text-sm">
          Stack *
        </Label>
        <Input
          id="stack"
          placeholder="e.g., Next.js, TypeScript, Tailwind CSS"
          {...register("stack")}
          className="text-xs sm:text-sm mt-1"
        />
        {errors.stack && (
          <p className="text-red-500 text-xs mt-1">{errors.stack.message}</p>
        )}
      </div>

      <DialogFooter className="gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="text-xs sm:text-sm"
        >
          Cancel
        </Button>
        <Button type="submit" className="text-xs sm:text-sm">
          {project ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  );
}
