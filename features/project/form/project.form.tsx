"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { IProject } from "../types/project.d";
import { projectSchema, ProjectFormData } from "../schema/project.schema";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface ProjectFormProps {
  project?: IProject;
  onSave: (data: ProjectFormData) => void | Promise<void>;
  onCancel: () => void;
  serverError?: any;
}

export default function ProjectForm({
  project,
  onSave,
  onCancel,
  serverError,
}: ProjectFormProps) {
  const { control, handleSubmit, setError } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectTitle: project?.projectTitle || "",
      details: project?.details || "",
      stack: project?.stack?.join(", ") || "",
    },
  });

  useEffect(() => {
    if (
      serverError?.validationErrors &&
      serverError.validationErrors.length > 0
    ) {
      serverError.validationErrors.forEach((err: any) => {
        setError(err.field.name as keyof ProjectFormData, {
          message: err.message,
        });
      });
    }
  }, [serverError, setError]);

  const onSubmit = (data: ProjectFormData) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        control={control}
        name="projectTitle"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor="projectTitle">Project Title *</FieldLabel>
            <Input
              {...field}
              id="projectTitle"
              placeholder="e.g. Ghost Dashboard"
              aria-invalid={fieldState.invalid || undefined}
              className="text-sm"
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="details"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor="details">Details *</FieldLabel>
            <Textarea
              {...field}
              id="details"
              placeholder="Describe the project, goals, and what you built"
              aria-invalid={fieldState.invalid || undefined}
              className="text-sm min-h-24 resize-none"
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={control}
        name="stack"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor="stack">Stack *</FieldLabel>
            <Input
              {...field}
              id="stack"
              placeholder="e.g. Next.js, TypeScript, Tailwind CSS"
              aria-invalid={fieldState.invalid || undefined}
              className="text-sm"
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <DialogFooter className="gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="text-sm"
        >
          Cancel
        </Button>
        <Button type="submit" className="text-sm">
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  );
}
