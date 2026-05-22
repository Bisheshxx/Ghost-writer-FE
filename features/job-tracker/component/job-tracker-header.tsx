import type { UseFormReturn } from "react-hook-form";
import {
  CheckCircle2,
  ClipboardPaste,
  Plus,
  SquarePen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { JOB_SUMMARY_ITEMS } from "../constants";
import type { JobTrackerEntryFormValues } from "../schema/job-tracker.schema";

type JobTrackerHeaderProps = {
  canBulkGenerate: boolean;
  form: UseFormReturn<JobTrackerEntryFormValues>;
  isCreateOpen: boolean;
  onBulkGenerate: () => void;
  onCreateEntry: (values: JobTrackerEntryFormValues) => void;
  onCreateOpenChange: (open: boolean) => void;
  onPasteJobLink: () => Promise<void>;
};

export default function JobTrackerHeader({
  canBulkGenerate,
  form,
  isCreateOpen,
  onBulkGenerate,
  onCreateEntry,
  onCreateOpenChange,
  onPasteJobLink,
}: JobTrackerHeaderProps) {
  const errors = form.formState.errors;

  return (
    <Card className="border-border/60 bg-background/80 shadow-sm backdrop-blur">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-2xl">Cover letter pipeline</CardTitle>
            <CardDescription>
              Manage the company, role, description, location, and generation
              status for each target.
            </CardDescription>
          </div>

          <div className="flex flex-wrap gap-2">
            <Dialog open={isCreateOpen} onOpenChange={onCreateOpenChange}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="size-4" /> Create entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Create a generation entry</DialogTitle>
                  <DialogDescription>
                    Capture the company, job title, description, location, and
                    job link used for generation.
                  </DialogDescription>
                </DialogHeader>

                <form
                  className="grid gap-4"
                  onSubmit={form.handleSubmit(onCreateEntry)}
                >
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" {...form.register("company")} />
                    {errors.company?.message && (
                      <p className="text-sm text-destructive">
                        {errors.company.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="title">Job title</Label>
                    <Input id="title" {...form.register("title")} />
                    {errors.title?.message && (
                      <p className="text-sm text-destructive">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Job description</Label>
                    <Textarea
                      id="description"
                      rows={5}
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
                      <p className="text-sm text-destructive">
                        {errors.location.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="link">Job link</Label>
                    <div className="flex gap-2">
                      <Input
                        id="link"
                        {...form.register("link")}
                        placeholder="https://..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="shrink-0 gap-2"
                        onClick={onPasteJobLink}
                      >
                        <ClipboardPaste className="size-4" />
                        Paste
                      </Button>
                    </div>
                    {errors.link?.message && (
                      <p className="text-sm text-destructive">
                        {errors.link.message}
                      </p>
                    )}
                  </div>

                  <DialogFooter>
                    <Button type="submit" className="gap-2">
                      <CheckCircle2 className="size-4" /> Create entry
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="gap-2"
              onClick={onBulkGenerate}
              disabled={!canBulkGenerate}
            >
              <SquarePen className="size-4" /> Bulk generate
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {JOB_SUMMARY_ITEMS.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </CardHeader>
    </Card>
  );
}
