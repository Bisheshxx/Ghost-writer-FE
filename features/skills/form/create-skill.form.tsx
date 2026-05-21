"use client";

import { useState } from "react";
import {
  useFieldArray,
  useForm,
  useWatch,
  Controller,
  type Control,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { showSuccess } from "@/lib/toast/toast.lib";
import {
  createTechnicalStepSchema,
  createPersonalStepSchema,
  createAwardsStepSchema,
  type CreateTechnicalStepData,
  type CreatePersonalStepData,
  type CreateAwardsStepData,
  type CreateSkillPayload,
} from "../schema/create-skill.schema";
import { useSkillsUiStore } from "../store/useSkillsUiStore";
import { useCreateSkill } from "../application/useSkillsActions";

const STEPS = ["Technical Skills", "Personal Skills", "Awards"] as const;

const emptyTechnicalSkill = { category: "", technologies: [] as string[] };
const emptyAward = {
  title: "",
  details: "",
  issuer: "",
  issuedDate: "",
};

export default function CreateSkillForm() {
  const { setOpenDialogName } = useSkillsUiStore();
  const [step, setStep] = useState(0);
  const [technicalSkills, setTechnicalSkills] = useState<
    CreateTechnicalStepData["technicalSkills"]
  >([emptyTechnicalSkill]);
  const [personalSkills, setPersonalSkills] = useState<
    CreatePersonalStepData["personalSkills"]
  >([]);
  const [awards, setAwards] = useState<CreateAwardsStepData["awards"]>([
    emptyAward,
  ]);

  const createSkillMutation = useCreateSkill({
    onSuccess: () => {
      showSuccess("Skills created successfully!");
      setOpenDialogName(null);
    },
  });

  const handleTechnicalNext = (
    nextTechnicalSkills: CreateTechnicalStepData["technicalSkills"],
  ) => {
    setTechnicalSkills(nextTechnicalSkills);
    setStep(1);
  };

  const handlePersonalNext = (
    nextPersonalSkills: CreatePersonalStepData["personalSkills"],
  ) => {
    setPersonalSkills(nextPersonalSkills);
    setStep(2);
  };

  const handleAwardsSubmit = async (
    nextAwards: CreateAwardsStepData["awards"],
  ) => {
    setAwards(nextAwards);

    const payload: CreateSkillPayload = {
      technicalSkills,
      personalSkills,
      awards: nextAwards,
    };

    await createSkillMutation.mutateAsync(payload);
  };

  return (
    <div className="space-y-6">
      <StepIndicator step={step} />

      {step === 0 && (
        <TechnicalSkillsStep
          initialValue={technicalSkills}
          onCancel={() => setOpenDialogName(null)}
          onNext={handleTechnicalNext}
        />
      )}

      {step === 1 && (
        <PersonalSkillsStep
          initialValue={personalSkills}
          onCancel={() => setOpenDialogName(null)}
          onPrevious={() => setStep(0)}
          onNext={handlePersonalNext}
        />
      )}

      {step === 2 && (
        <AwardsStep
          initialValue={awards}
          onCancel={() => setOpenDialogName(null)}
          onPrevious={() => setStep(1)}
          onSubmit={handleAwardsSubmit}
          isSubmitting={createSkillMutation.isPending}
        />
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
      {STEPS.map((label, index) => (
        <div key={label} className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-1 ${
              index === step
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {index + 1}. {label}
          </span>
          {index < STEPS.length - 1 && <span className="text-gray-400">/</span>}
        </div>
      ))}
    </div>
  );
}

function TechnicalSkillsStep({
  initialValue,
  onCancel,
  onNext,
}: {
  initialValue: CreateTechnicalStepData["technicalSkills"];
  onCancel: () => void;
  onNext: (technicalSkills: CreateTechnicalStepData["technicalSkills"]) => void;
}) {
  const { control, handleSubmit, setValue, getValues } =
    useForm<CreateTechnicalStepData>({
      resolver: zodResolver(createTechnicalStepSchema),
      defaultValues: {
        technicalSkills:
          initialValue.length > 0 ? initialValue : [emptyTechnicalSkill],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "technicalSkills",
  });

  const addTechnology = (index: number, value: string) => {
    const tech = value.trim();
    if (!tech) return;

    const current = getValues(`technicalSkills.${index}.technologies`) || [];
    const next = Array.from(new Set([...current, tech]));
    setValue(`technicalSkills.${index}.technologies`, next, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeTechnology = (index: number, tech: string) => {
    const current = getValues(`technicalSkills.${index}.technologies`) || [];
    setValue(
      `technicalSkills.${index}.technologies`,
      current.filter((item) => item !== tech),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onNext(data.technicalSkills))}
      className="space-y-4"
    >
      {fields.map((field, index) => (
        <TechnicalSkillItemRow
          key={field.id}
          control={control}
          index={index}
          canRemove={fields.length > 1}
          onRemove={() => remove(index)}
          onAddTechnology={addTechnology}
          onRemoveTechnology={removeTechnology}
        />
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ ...emptyTechnicalSkill })}
      >
        Add technical skill
      </Button>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Next</Button>
      </DialogFooter>
    </form>
  );
}

function PersonalSkillsStep({
  initialValue,
  onCancel,
  onPrevious,
  onNext,
}: {
  initialValue: CreatePersonalStepData["personalSkills"];
  onCancel: () => void;
  onPrevious: () => void;
  onNext: (personalSkills: CreatePersonalStepData["personalSkills"]) => void;
}) {
  const [newPersonalSkill, setNewPersonalSkill] = useState("");
  const { control, handleSubmit, setValue, getValues } =
    useForm<CreatePersonalStepData>({
      resolver: zodResolver(createPersonalStepSchema),
      defaultValues: {
        personalSkills: initialValue,
      },
    });

  const personalSkills = useWatch({ control, name: "personalSkills" }) || [];

  const addPersonalSkill = () => {
    const skill = newPersonalSkill.trim();
    if (!skill) return;

    const current = getValues("personalSkills") || [];
    const next = Array.from(new Set([...current, skill]));
    setValue("personalSkills", next, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setNewPersonalSkill("");
  };

  const removePersonalSkill = (skill: string) => {
    const current = getValues("personalSkills") || [];
    setValue(
      "personalSkills",
      current.filter((item) => item !== skill),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onNext(data.personalSkills))}
      className="space-y-4"
    >
      <div className="flex flex-wrap gap-2">
        {personalSkills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-2 bg-gray-50 border rounded-full px-2 py-1 text-xs"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => removePersonalSkill(skill)}
              className="text-gray-500 hover:text-gray-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <Controller
        control={control}
        name="personalSkills"
        render={({ fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor="create-personal-skill-input">
              Personal Skills *
            </FieldLabel>
            <Input
              id="create-personal-skill-input"
              value={newPersonalSkill}
              placeholder="Type and press Enter to add"
              onChange={(e) => setNewPersonalSkill(e.target.value)}
              aria-invalid={fieldState.invalid || undefined}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addPersonalSkill();
                }
              }}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="submit">Next</Button>
      </DialogFooter>
    </form>
  );
}

function AwardsStep({
  initialValue,
  onCancel,
  onPrevious,
  onSubmit,
  isSubmitting,
}: {
  initialValue: CreateAwardsStepData["awards"];
  onCancel: () => void;
  onPrevious: () => void;
  onSubmit: (awards: CreateAwardsStepData["awards"]) => void | Promise<void>;
  isSubmitting: boolean;
}) {
  const { control, handleSubmit } = useForm<CreateAwardsStepData>({
    resolver: zodResolver(createAwardsStepSchema),
    defaultValues: {
      awards: initialValue.length > 0 ? initialValue : [emptyAward],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "awards",
  });

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data.awards))}
      className="space-y-4"
    >
      {fields.map((field, index) => (
        <div key={field.id} className="border rounded p-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Award {index + 1}</p>
            {fields.length > 1 && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            )}
          </div>

          <Controller
            control={control}
            name={`awards.${index}.title`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor={`create-award-title-${index}`}>
                  Title *
                </FieldLabel>
                <Input
                  {...field}
                  id={`create-award-title-${index}`}
                  aria-invalid={fieldState.invalid || undefined}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={`awards.${index}.details`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor={`create-award-details-${index}`}>
                  Details *
                </FieldLabel>
                <Textarea
                  {...field}
                  id={`create-award-details-${index}`}
                  aria-invalid={fieldState.invalid || undefined}
                  rows={2}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={`awards.${index}.issuer`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor={`create-award-issuer-${index}`}>
                  Issuer *
                </FieldLabel>
                <Input
                  {...field}
                  id={`create-award-issuer-${index}`}
                  aria-invalid={fieldState.invalid || undefined}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={`awards.${index}.issuedDate`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor={`create-award-issued-date-${index}`}>
                  Issued Date *
                </FieldLabel>
                <Input
                  {...field}
                  type="date"
                  id={`create-award-issued-date-${index}`}
                  aria-invalid={fieldState.invalid || undefined}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ ...emptyAward })}
      >
        Add award
      </Button>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Skills"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function TechnicalSkillItemRow({
  control,
  index,
  canRemove,
  onRemove,
  onAddTechnology,
  onRemoveTechnology,
}: {
  control: Control<CreateTechnicalStepData>;
  index: number;
  canRemove: boolean;
  onRemove: () => void;
  onAddTechnology: (index: number, value: string) => void;
  onRemoveTechnology: (index: number, tech: string) => void;
}) {
  const [newTech, setNewTech] = useState("");
  const technologies =
    useWatch({
      control,
      name: `technicalSkills.${index}.technologies`,
    }) || [];

  return (
    <div className="border rounded p-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Technical Skill {index + 1}</p>
        {canRemove && (
          <Button type="button" size="sm" variant="ghost" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>

      <Controller
        control={control}
        name={`technicalSkills.${index}.category`}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={`create-tech-category-${index}`}>
              Category *
            </FieldLabel>
            <Input
              {...field}
              id={`create-tech-category-${index}`}
              aria-invalid={fieldState.invalid || undefined}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <Controller
        control={control}
        name={`technicalSkills.${index}.technologies`}
        render={({ fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor={`create-tech-input-${index}`}>
              Technologies *
            </FieldLabel>
            <div className="flex flex-wrap gap-2 mb-2 mt-2">
              {technologies.map((tech: string) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-2 bg-gray-50 border rounded-full px-2 py-1 text-xs"
                >
                  <span>{tech}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveTechnology(index, tech)}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <Input
              id={`create-tech-input-${index}`}
              value={newTech}
              placeholder="Type and press Enter to add"
              onChange={(e) => setNewTech(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onAddTechnology(index, newTech);
                  setNewTech("");
                }
              }}
              aria-invalid={fieldState.invalid || undefined}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </div>
  );
}
