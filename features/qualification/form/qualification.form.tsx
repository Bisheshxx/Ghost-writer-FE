"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import {
  qualificationSchema,
  QualificationFormData,
} from "../schema/qualification.schema";
import { IQualification } from "../types/qualification.d";
import { useEffect } from "react";

interface QualificationFormProps {
  qualification?: IQualification;
  onSave: (data: QualificationFormData) => void | Promise<void>;
  onCancel: () => void;
  serverError?: any;
}

export default function QualificationForm({
  qualification,
  onSave,
  onCancel,
  serverError,
}: QualificationFormProps) {
  const { control, handleSubmit, setError } = useForm<QualificationFormData>({
    resolver: zodResolver(qualificationSchema),
    defaultValues: {
      qualification: qualification?.qualification || "",
      instituteName: qualification?.instituteName || "",
      descriptions: qualification?.descriptions || "",
      startDate: qualification?.startDate.slice(0, 7) || "",
      endDate: qualification?.endDate
        ? qualification?.endDate.slice(0, 7)
        : null,
      isCurrent: qualification?.isCurrent ?? false,
      relavantDetails: qualification?.relavantDetails || "",
    },
  });

  // Apply server validation errors to form
  useEffect(() => {
    if (
      serverError?.validationErrors &&
      serverError.validationErrors.length > 0
    ) {
      serverError.validationErrors.forEach((err: any) => {
        setError(err.field.name as keyof QualificationFormData, {
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

  const onSubmit = (data: QualificationFormData) => {
    onSave({
      ...data,
      endDate: data.isCurrent ? null : data.endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Controller
          control={control}
          name="qualification"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="qualification">Qualification *</FieldLabel>
              <Input
                {...field}
                id="qualification"
                placeholder="e.g., Bachelor of Science in Computer Science"
                aria-invalid={fieldState.invalid || undefined}
                className="text-xs sm:text-sm"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>

      <div>
        <Controller
          control={control}
          name="instituteName"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="instituteName">Institute Name *</FieldLabel>
              <Input
                {...field}
                id="instituteName"
                placeholder="e.g., University of Technology"
                aria-invalid={fieldState.invalid || undefined}
                className="text-xs sm:text-sm"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>

      <div>
        <Controller
          control={control}
          name="descriptions"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="descriptions">Description *</FieldLabel>
              <Textarea
                {...field}
                id="descriptions"
                placeholder="e.g., Bachelor of Science in Computer Science"
                aria-invalid={fieldState.invalid || undefined}
                className="text-xs sm:text-sm min-h-20 resize-none"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
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
                  className="text-xs sm:text-sm"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

        <div>
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
                  className="text-xs sm:text-sm disabled:opacity-50"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
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
              <span className="text-xs sm:text-sm font-medium">
                Currently Studying
              </span>
            </label>
          )}
        />
      </div>

      <div>
        <Controller
          control={control}
          name="relavantDetails"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="relavantDetails">
                Relevant Details
              </FieldLabel>
              <Textarea
                {...field}
                id="relavantDetails"
                placeholder="e.g., Activities, accomplishments, or any other relevant information"
                aria-invalid={fieldState.invalid || undefined}
                className="text-xs sm:text-sm min-h-20 resize-none"
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
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
          {qualification ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  );
}
