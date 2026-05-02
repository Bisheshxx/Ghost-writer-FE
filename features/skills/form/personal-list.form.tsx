"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FieldError } from "@/components/ui/field";

interface Props {
  personalSkills: string[];
  onSave: (skills: string[]) => void;
  onCancel: () => void;
}

const personalListSchema = z.object({
  personalSkills: z
    .array(z.string().min(1, "Skill cannot be empty"))
    .min(1, "Add at least one skill"),
});

type FormValues = {
  personalSkills: string[];
};

export default function PersonalListForm({
  personalSkills,
  onSave,
  onCancel,
}: Props) {
  const [tempVal, setTempVal] = React.useState("");

  const { control, handleSubmit, setValue, getValues } = useForm<FormValues>({
    resolver: zodResolver(personalListSchema),
    defaultValues: { personalSkills },
  });

  const onAddSkill = (value: string) => {
    const val = value.trim();
    if (!val) return;
    const current: string[] = getValues("personalSkills") || [];
    const next = Array.from(new Set([...(current || []), val]));
    setValue("personalSkills", next, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onRemoveSkill = (skill: string) => {
    const current: string[] = getValues("personalSkills") || [];
    const next = current.filter((s) => s !== skill);
    setValue("personalSkills", next, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const submit = (data: FormValues) => {
    onSave(data.personalSkills);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <div className="text-xs sm:text-sm font-medium mb-2">
          Personal Skills *
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {(getValues("personalSkills") || personalSkills || []).map(
            (skill: string) => (
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
            ),
          )}
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
          onClick={onCancel}
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
