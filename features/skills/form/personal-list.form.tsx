"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError } from "@/components/ui/field";
import {
  PersonalFormData,
  personalListSchema,
} from "../schema/personal.schema";
import { useSkillsUiStore } from "../store/useSkillsUiStore";
import { showSuccess } from "@/lib/toast/toast.lib";
import { useUpdatePersonalSkills } from "../application/useSkillsActions";

interface Props {
  personalSkills: string[];
  id: string | undefined;
}

export default function PersonalListForm({ personalSkills, id }: Props) {
  const [tempVal, setTempVal] = React.useState("");
  const { setOpenDialogName } = useSkillsUiStore();

  const { control, handleSubmit, setValue } = useForm<PersonalFormData>({
    resolver: zodResolver(personalListSchema),
    defaultValues: { personalSkills },
  });

  const skills = useWatch({
    control,
    name: "personalSkills",
  });

  const onAddSkill = (value: string) => {
    const val = value.trim();
    if (!val) return;
    const current: string[] = skills || [];
    const next = Array.from(new Set([...(current || []), val]));
    setValue("personalSkills", next, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onRemoveSkill = (skill: string) => {
    const current: string[] = skills || [];
    const next = current.filter((s) => s !== skill);
    setValue("personalSkills", next || [], {
      shouldValidate: false,
      shouldDirty: true,
    });
  };

  const updatePersonalList = useUpdatePersonalSkills({
    onSuccess: () => {
      showSuccess("Personal Skill has been updated successfully!");
      setOpenDialogName(null);
    },
  });

  const submit = async (data: PersonalFormData) => {
    if (!id) return;
    await updatePersonalList.mutateAsync({ id, data });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <div className="text-xs sm:text-sm font-medium mb-2">
          Personal Skills *
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {(skills || personalSkills || []).map((skill: string) => (
            <span
              key={skill}
              className="inline-flex items-center gap-2 bg-gray-50 border rounded-full px-2 py-1 text-xs"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => onRemoveSkill(skill)}
                className="text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="mt-3">
          <Controller
            control={control}
            name="personalSkills"
            render={({ fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <Input
                  placeholder="Type and press Enter to add"
                  id="personal-skill-input"
                  value={tempVal}
                  onChange={(e) => setTempVal(e.target.value)}
                  aria-invalid={fieldState.invalid || undefined}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onAddSkill(tempVal);
                      setTempVal("");
                    }
                  }}
                  className="text-xs sm:text-sm"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>
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
