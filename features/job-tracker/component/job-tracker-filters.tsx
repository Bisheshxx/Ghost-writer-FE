import type { UseFormReturn } from "react-hook-form";
import { ArrowUpDown, ClipboardPaste, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import LoadingButtonComponent from "@/shared/component/button/LoadingButtonComponent";

import { JOB_STATUS_OPTIONS } from "../constants";
import type { JobTrackerEntryFormValues } from "../schema/job-tracker.schema";
import type { JobStatus } from "../types/job-tracker";

const ALL_STATUSES_VALUE = "all";

type JobTrackerFiltersProps = {
  form: UseFormReturn<JobTrackerEntryFormValues>;
  isCreating: boolean;
  isCreateOpen: boolean;
  query: string;
  statusFilter: JobStatus | "";
  onCreateEntry: (values: JobTrackerEntryFormValues) => void;
  onCreateOpenChange: (open: boolean) => void;
  onPasteJobLink: () => Promise<void>;
  onQueryChange: (query: string) => void;
  onStatusFilterChange: (status: JobStatus | "") => void;
};

export default function JobTrackerFilters({
  form,
  isCreating,
  isCreateOpen,
  query,
  statusFilter,
  onCreateEntry,
  onCreateOpenChange,
  onPasteJobLink,
  onQueryChange,
  onStatusFilterChange,
}: JobTrackerFiltersProps) {
  const errors = form.formState.errors;

  return (
    <div className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search companies, titles, locations"
          className="h-10 pl-9"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:shrink-0">
        <Select
          value={statusFilter || ALL_STATUSES_VALUE}
          onValueChange={(value) =>
            onStatusFilterChange(
              value === ALL_STATUSES_VALUE ? "" : (value as JobStatus),
            )
          }
        >
          <SelectTrigger
            aria-label="Filter by status"
            className="h-10 w-full sm:w-44"
          >
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_STATUSES_VALUE}>All statuses</SelectItem>
            {JOB_STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" className="justify-start gap-2">
          <ArrowUpDown className="size-4" />
          <span className="text-muted-foreground">Sort:</span>
          Date added
        </Button>

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
                Capture the company, job title, description, location, and job
                link used for generation.
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
                <LoadingButtonComponent
                  isLoading={isCreating}
                  text="Create entry"
                />
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
