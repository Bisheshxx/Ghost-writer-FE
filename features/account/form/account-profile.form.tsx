"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
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

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          control={control}
          name="firstName"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="firstName">First name</FieldLabel>
              <Input
                {...field}
                id="firstName"
                placeholder="Your first name"
                aria-invalid={fieldState.invalid || undefined}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="lastName">Last name</FieldLabel>
              <Input
                {...field}
                id="lastName"
                placeholder="Your last name"
                aria-invalid={fieldState.invalid || undefined}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>

      <Controller
        control={control}
        name="username"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              {...field}
              id="username"
              placeholder="username"
              aria-invalid={fieldState.invalid || undefined}
            />
            <FieldDescription>
              This is stored in Clerk and can be used for account display inside Ghost Writer.
            </FieldDescription>
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
}
