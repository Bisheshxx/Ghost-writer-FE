"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type Control, type FieldPath, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { accountProfileSchema } from "../schema/account.schema";
import type { AccountProfileFormData } from "../types/account.types";

type AccountProfileFormProps = {
  defaultValues: AccountProfileFormData;
  isSaving?: boolean;
  onSave: (data: AccountProfileFormData) => Promise<void> | void;
};

export default function AccountProfileForm({
  defaultValues,
  isSaving = false,
  onSave,
}: AccountProfileFormProps) {
  const { control, handleSubmit, reset } = useForm<AccountProfileFormData>({
    resolver: zodResolver(accountProfileSchema),
    defaultValues,
  });

  const handleSave = async (data: AccountProfileFormData) => {
    await onSave(data);
    reset(data);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <AccountProfileField
          control={control}
          name="firstName"
          label="First name"
          placeholder="Your first name"
        />
        <AccountProfileField
          control={control}
          name="lastName"
          label="Last name"
          placeholder="Your last name"
        />
        <AccountProfileField
          control={control}
          name="phoneNumber"
          label="Phone number"
          placeholder="Your phone number"
          type="tel"
        />
        <AccountProfileField
          control={control}
          name="location"
          label="Location"
          placeholder="City, country"
        />
        <AccountProfileField
          control={control}
          name="linkedinUrl"
          label="LinkedIn URL"
          placeholder="https://linkedin.com/in/username"
          type="url"
        />
        <AccountProfileField
          control={control}
          name="githubUrl"
          label="GitHub URL"
          placeholder="https://github.com/username"
          type="url"
        />
        <div className="md:col-span-2">
          <AccountProfileField
            control={control}
            name="portfolioUrl"
            label="Portfolio URL"
            placeholder="https://your-portfolio.com"
            type="url"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}

function AccountProfileField({
  control,
  label,
  name,
  placeholder,
  type = "text",
}: {
  control: Control<AccountProfileFormData>;
  label: string;
  name: FieldPath<AccountProfileFormData>;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...field}
            id={name}
            placeholder={placeholder}
            type={type}
            aria-invalid={fieldState.invalid || undefined}
          />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
