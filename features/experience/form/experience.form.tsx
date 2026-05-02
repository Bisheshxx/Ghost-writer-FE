"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExperienceFormData, IExperience } from "../types/experience-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { experienceSchema } from "../schema/experience.schema";
import { useEffect } from "react";

interface ExperienceFormProps {
  experience?: IExperience;
  onSave: (data: ExperienceFormData) => void;
  onCancel: () => void;
  serverError?: any;
}

export default function ExperienceForm({
  experience,
  onSave,
  onCancel,
  serverError,
}: ExperienceFormProps) {
  const { control, handleSubmit, setError } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      jobTitle: experience?.jobTitle || "",
      companyName: experience?.companyName || "",
      startDate: experience?.startDate.slice(0, 7) || "",
      endDate: experience?.endDate ? experience?.endDate.slice(0, 7) : null,
      Descriptions: experience?.Descriptions || "",
      relavantDetails: experience?.relavantDetails || "",
      isCurrent: experience?.isCurrent ?? false,
    },
  });

  // Apply server validation errors to form
  useEffect(() => {
    if (
      serverError?.validationErrors &&
      serverError.validationErrors.length > 0
    ) {
      serverError.validationErrors.forEach((err: any) => {
        setError(err.field.name as keyof ExperienceFormData, {
          message: err.message,
        });
      });
    }
  }, [serverError, setError]);

  const isCurrent = useWatch({ control, name: "isCurrent" });
  const today = new Date();
  const maxMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}`;

  const onSubmit = (data: ExperienceFormData) => {
    onSave({
      ...data,
      endDate: data.isCurrent ? null : data.endDate,
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Job Title & Company Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="jobTitle"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="jobTitle">Job Title *</FieldLabel>
              <Input
                {...field}
                id="jobTitle"
                placeholder="e.g. Senior Frontend Developer"
                aria-invalid={fieldState.invalid || undefined}
                className="text-sm"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={control}
          name="companyName"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="companyName">Company Name *</FieldLabel>
              <Input
                {...field}
                id="companyName"
                placeholder="e.g. Acme Corp"
                aria-invalid={fieldState.invalid || undefined}
                className="text-sm"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Controller
          control={control}
          name="startDate"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="startDate">Start Date *</FieldLabel>
              <Input
                {...field}
                id="startDate"
                type="month"
                max={maxMonth}
                aria-invalid={fieldState.invalid || undefined}
                className="text-sm"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={control}
          name="endDate"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="endDate">End Date</FieldLabel>
              <Input
                {...field}
                id="endDate"
                type="month"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value || null)}
                max={maxMonth}
                disabled={isCurrent}
                aria-invalid={fieldState.invalid || undefined}
                className="text-sm disabled:opacity-50"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <div className="flex items-end">
          <Controller
            control={control}
            name="isCurrent"
            render={({ field: { value, onChange } }) => (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Currently working</span>
              </label>
            )}
          />
        </div>
      </div>

      {/* Description */}
      <Controller
        control={control}
        name="Descriptions"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor="Descriptions">Description *</FieldLabel>
            <Textarea
              {...field}
              id="Descriptions"
              placeholder="Describe your role, responsibilities, and achievements..."
              aria-invalid={fieldState.invalid || undefined}
              className="text-sm min-h-24 resize-none"
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {/* Relevant Details */}
      <Controller
        control={control}
        name="relavantDetails"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor="relavantDetails">Relevant Details</FieldLabel>
            <Textarea
              {...field}
              id="relavantDetails"
              placeholder="Any additional details, skills, or technologies used..."
              aria-invalid={fieldState.invalid || undefined}
              className="text-sm min-h-20 resize-none"
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      {/* Footer Actions */}
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
