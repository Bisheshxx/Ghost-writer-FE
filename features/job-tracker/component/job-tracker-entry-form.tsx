import type { UseFormReturn } from "react-hook-form";
import { ClipboardPaste } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LoadingButtonComponent from "@/shared/component/button/LoadingButtonComponent";

import type { JobTrackerEntryFormValues } from "../schema/job-tracker.schema";

type JobTrackerEntryFormProps = {
  form: UseFormReturn<JobTrackerEntryFormValues>;
  isSubmitting: boolean;
  submitText: string;
  onSubmit: (values: JobTrackerEntryFormValues) => void;
  onPasteJobLink?: () => Promise<void>;
};

export default function JobTrackerEntryForm({
  form,
  isSubmitting,
  submitText,
  onSubmit,
  onPasteJobLink,
}: JobTrackerEntryFormProps) {
  const errors = form.formState.errors;

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <Label htmlFor="company">Company</Label>
        <Input id="company" {...form.register("company")} />
        {errors.company?.message && (
          <p className="text-sm text-destructive">{errors.company.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Job title</Label>
        <Input id="title" {...form.register("title")} />
        {errors.title?.message && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Job description</Label>
        <Textarea
          id="description"
          rows={5}
          className="max-h-48 overflow-y-auto"
          {...form.register("description")}
        />
        {errors.description?.message && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" {...form.register("location")} />
        {errors.location?.message && (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="link">Job link</Label>
        <div className="flex gap-2">
          <Input id="link" {...form.register("link")} placeholder="https://..." />
          {onPasteJobLink && (
            <Button
              type="button"
              variant="outline"
              className="shrink-0 gap-2"
              onClick={onPasteJobLink}
            >
              <ClipboardPaste className="size-4" />
              Paste
            </Button>
          )}
        </div>
        {errors.link?.message && (
          <p className="text-sm text-destructive">{errors.link.message}</p>
        )}
      </div>

      <DialogFooter>
        <LoadingButtonComponent isLoading={isSubmitting} text={submitText} />
      </DialogFooter>
    </form>
  );
}
