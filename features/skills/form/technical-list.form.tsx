"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import {
  useForm,
  useFieldArray,
  Controller,
  useWatch,
  type Control,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TechnicalListFormData,
  technicalListSchema,
} from "../schema/technical.schema";
import { TechnicalSkill } from "../types/skills.d";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useSkillsUiStore } from "../store/useSkillsUiStore";
import { showSuccess } from "@/lib/toast/toast.lib";
import { useUpdateTechnicalSkills } from "../application/useSkillsActions";

interface Props {
  technicalSkills: TechnicalSkill[];
  id: string | undefined;
}

type FormValues = {
  technicalSkills: TechnicalSkill[];
};

export default function TechnicalListForm({ technicalSkills, id }: Props) {
  const { setOpenDialogName } = useSkillsUiStore();
  const { control, handleSubmit, setValue, getValues } =
    useForm<TechnicalListFormData>({
      resolver: zodResolver(technicalListSchema),
      defaultValues: {
        technicalSkills: technicalSkills.map((t) => ({ ...t })),
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "technicalSkills",
  });

  const onAddTech = (index: number, value: string) => {
    const val = value.trim();
    if (!val) return;
    const current: string[] =
      getValues(`technicalSkills.${index}.technologies`) || [];
    const next = Array.from(new Set([...(current || []), val]));
    setValue(`technicalSkills.${index}.technologies`, next, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onRemoveTech = (index: number, tech: string) => {
    const current: string[] =
      getValues(`technicalSkills.${index}.technologies`) || [];
    const next = (current || []).filter((t) => t !== tech);
    setValue(`technicalSkills.${index}.technologies`, next, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onAddSkill = () => append({ category: "", technologies: [] });

  const onRemoveSkill = (index: number) => remove(index);

  const updateTechnicalList = useUpdateTechnicalSkills({
    onSuccess: () => {
      showSuccess("Technical skill updated successfully!");
      setOpenDialogName(null);
    },
  });

  const submit = async (data: TechnicalListFormData) => {
    if (!id) return;
    await updateTechnicalList.mutateAsync({ id, data });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {fields.map((field, idx) => (
        <TechnicalSkillRow
          key={field.id}
          control={control}
          index={idx}
          onAddTech={onAddTech}
          onRemoveTech={onRemoveTech}
          onRemoveSkill={onRemoveSkill}
        />
      ))}

      <div>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={onAddSkill}
          className="mt-1"
        >
          Add technical skill
        </Button>
      </div>

      <DialogFooter className="gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpenDialogName(null)}
          className="text-xs sm:text-sm"
        >
          Cancel
        </Button>
        <Button type="submit" className="text-xs sm:text-sm">
          Save
        </Button>
      </DialogFooter>
    </form>
  );
}

function TechnicalSkillRow({
  control,
  index,
  onAddTech,
  onRemoveTech,
  onRemoveSkill,
}: {
  control: Control<FormValues>;
  index: number;
  onAddTech: (index: number, value: string) => void;
  onRemoveTech: (index: number, tech: string) => void;
  onRemoveSkill: (index: number) => void;
}) {
  const technologies =
    useWatch({
      control,
      name: `technicalSkills.${index}.technologies` as const,
    }) || [];

  return (
    <div className="border rounded p-3">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex-1">
          <Controller
            control={control}
            name={`technicalSkills.${index}.category` as const}
            render={({ field: f, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor={`tech-category-${index}`}>
                  Category *
                </FieldLabel>
                <Input
                  {...f}
                  id={`tech-category-${index}`}
                  aria-invalid={fieldState.invalid || undefined}
                  className="text-xs sm:text-sm"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            type="button"
            onClick={() => onRemoveSkill(index)}
          >
            Remove
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xs sm:text-sm font-medium mb-2">
          Technologies *
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {technologies.map((tech: string) => (
            <span
              key={tech}
              className="inline-flex items-center gap-2 bg-gray-50 border rounded-full px-2 py-1 text-xs"
            >
              <span>{tech}</span>
              <button
                type="button"
                onClick={() => onRemoveTech(index, tech)}
                className="text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="mt-2">
          <Controller
            control={control}
            name={`technicalSkills.${index}.technologies` as const}
            render={({ fieldState: techFieldState }) => (
              <Field data-invalid={techFieldState.invalid || undefined}>
                <Controller
                  control={control}
                  name={`technicalSkills.${index}.__newTech` as any}
                  defaultValue={""}
                  render={({ field: f }) => (
                    <Input
                      {...f}
                      placeholder="Type and press Enter to add"
                      id={`tech-input-${index}`}
                      aria-invalid={techFieldState.invalid || undefined}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onAddTech(index, f.value);
                          f.onChange("");
                        }
                      }}
                      className="text-xs sm:text-sm"
                    />
                  )}
                />
                <FieldError errors={[techFieldState.error]} />
              </Field>
            )}
          />
        </div>
      </div>
    </div>
  );
}
