import type { UseFormReturn } from "react-hook-form";
import { ArrowUpDown, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomDialog from "@/shared/component/dialog/CustomDialog";

import { JOB_TRACKER_DIALOGS } from "../constants";
import type { JobTrackerEntryFormValues } from "../schema/job-tracker.schema";
import { useJobTrackerUiStore } from "../store/useJobTrackerUiStore";
import type { JobSortOrder, JobStatus } from "../types/job-tracker";
import JobStatusSelect from "./job-status-select";
import JobTrackerEntryForm from "./job-tracker-entry-form";

type JobTrackerFiltersProps = {
  form: UseFormReturn<JobTrackerEntryFormValues>;
  isCreating: boolean;
  query: string;
  sortOrder: JobSortOrder;
  statusFilter: JobStatus | "";
  onCreateEntry: (values: JobTrackerEntryFormValues) => void;
  onPasteJobLink: () => Promise<void>;
  onQueryChange: (query: string) => void;
  onSortOrderChange: (sortOrder: JobSortOrder) => void;
  onStatusFilterChange: (status: JobStatus | "") => void;
};

export default function JobTrackerFilters({
  form,
  isCreating,
  query,
  sortOrder,
  statusFilter,
  onCreateEntry,
  onPasteJobLink,
  onQueryChange,
  onSortOrderChange,
  onStatusFilterChange,
}: JobTrackerFiltersProps) {
  const { openDialogName, setOpenDialogName } = useJobTrackerUiStore();
  const nextSortOrder = sortOrder === "desc" ? "asc" : "desc";

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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
        <JobStatusSelect
          value={statusFilter}
          onValueChange={onStatusFilterChange}
          includeAllOption
          placeholder="All statuses"
          ariaLabel="Filter by status"
          className="h-10 w-full sm:w-44"
        />

        <Button
          type="button"
          variant="outline"
          className="justify-start gap-2"
          onClick={() => onSortOrderChange(nextSortOrder)}
        >
          <ArrowUpDown className="size-4" />
          <span className="text-muted-foreground">Sort:</span>
          Date added: {sortOrder === "desc" ? "newest" : "oldest"}
        </Button>

        <CustomDialog
          button={
            <Button className="gap-2">
              <Plus className="size-4" /> Create entry
            </Button>
          }
          width="sm:max-w-xl"
          title="Create a generation entry"
          description="Capture the company, job title, description, location, and job link used for generation."
          dialogName={JOB_TRACKER_DIALOGS.CREATE}
          openDialogName={openDialogName}
          onOpenDialogChange={setOpenDialogName}
        >
          <JobTrackerEntryForm
            form={form}
            isSubmitting={isCreating}
            submitText="Create entry"
            onSubmit={onCreateEntry}
            onPasteJobLink={onPasteJobLink}
          />
        </CustomDialog>
      </div>
    </div>
  );
}
