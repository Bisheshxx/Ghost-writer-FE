"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Award } from "../types/skills.d";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { AwardFormData, awardListSchema } from "../schema/award.schema";
import { useSkillsUiStore } from "../store/useSkillsUiStore";
import { showSuccess } from "@/lib/toast/toast.lib";
import { useUpdateAwards } from "../application/useSkillsActions";

interface Props {
  awards: Award[];
  id: string | undefined;
}

export default function AwardListForm({ awards, id }: Props) {
  const { setOpenDialogName } = useSkillsUiStore();
  const { control, handleSubmit } = useForm<AwardFormData>({
    resolver: zodResolver(awardListSchema),
    defaultValues: { awards: awards.map((a) => ({ ...a })) },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "awards" });

  const onAddAward = () =>
    append({ title: "", details: "", issuer: "", issuedDate: "" });

  const onRemoveAward = (index: number) => remove(index);

  const updateAwardList = useUpdateAwards({
    onSuccess: () => {
      showSuccess("Personal Skill has been updated successfully!");
      setOpenDialogName(null);
    },
  });

  const submit = async (data: AwardFormData) => {
    // onSave(data.awards);
    if (!id) return;
    await updateAwardList.mutateAsync({ id, data });
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {fields.map((field, idx) => (
        <div key={field.id} className="border rounded p-3">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="font-semibold text-sm">Award {idx + 1}</h3>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => onRemoveAward(idx)}
            >
              Remove
            </Button>
          </div>

          <div className="space-y-3">
            <Controller
              control={control}
              name={`awards.${idx}.title` as const}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor={`award-title-${idx}`}>
                    Title *
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`award-title-${idx}`}
                    aria-invalid={fieldState.invalid || undefined}
                    className="text-xs sm:text-sm"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={control}
              name={`awards.${idx}.details` as const}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor={`award-details-${idx}`}>
                    Details
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id={`award-details-${idx}`}
                    aria-invalid={fieldState.invalid || undefined}
                    rows={2}
                    className="text-xs sm:text-sm"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={control}
              name={`awards.${idx}.issuer` as const}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor={`award-issuer-${idx}`}>
                    Issuer
                  </FieldLabel>
                  <Input
                    {...field}
                    id={`award-issuer-${idx}`}
                    aria-invalid={fieldState.invalid || undefined}
                    className="text-xs sm:text-sm"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              control={control}
              name={`awards.${idx}.issuedDate` as const}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid || undefined}>
                  <FieldLabel htmlFor={`award-issued-date-${idx}`}>
                    Issued Date
                  </FieldLabel>
                  <Input
                    {...field}
                    type="date"
                    id={`award-issued-date-${idx}`}
                    aria-invalid={fieldState.invalid || undefined}
                    className="text-xs sm:text-sm"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
        </div>
      ))}

      <div>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={onAddAward}
          className="mt-1"
        >
          Add award
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
