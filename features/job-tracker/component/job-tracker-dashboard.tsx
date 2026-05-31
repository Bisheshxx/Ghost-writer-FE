"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { showError, showSuccess } from "@/lib/toast/toast.lib";
import CustomDialog from "@/shared/component/dialog/CustomDialog";
import { useDebounce } from "@/shared/hooks/useDebounce";

import {
  useCreateJob,
  useDeleteJob,
  useGenerateJobDocuments,
  useJobs,
  useUpdateJob,
  useUpdateJobStatus,
} from "../application/useJobTrackerActions";
import { JOB_TRACKER_DIALOGS } from "../constants";
import {
  jobTrackerEntrySchema,
  type JobTrackerEntryFormValues,
} from "../schema/job-tracker.schema";
import { useJobTrackerUiStore } from "../store/useJobTrackerUiStore";
import type {
  GeneratedPayload,
  JobRow,
  JobSortOrder,
  JobStatus,
} from "../types/job-tracker";
import BulkGenerationActions from "./bulk-generation-actions";
import GeneratedPayloadPreview from "./generated-payload-preview";
import JobTrackerEntryForm from "./job-tracker-entry-form";
import JobTrackerFilters from "./job-tracker-filters";
import JobTrackerViewTabs from "./job-tracker-view-tabs";
import PageTitle from "@/components/page-title";

const PAGE_LIMIT = 10;

export default function JobTrackerDashboard() {
  const [generatedPayloads, setGeneratedPayloads] = useState<
    GeneratedPayload[]
  >([]);
  const [generatingIds, setGeneratingIds] = useState<string[]>([]);
  const { setOpenDialogName, setSelectedJob } = useJobTrackerUiStore();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<JobStatus | "">("");
  const [sortOrder, setSortOrder] = useState<JobSortOrder>("desc");
  const debouncedQuery = useDebounce(query, 300);

  const listParams = useMemo(
    () => ({
      limit: PAGE_LIMIT,
      page,
      search: debouncedQuery.trim(),
      status: statusFilter,
      sortOrder,
    }),
    [page, debouncedQuery, statusFilter, sortOrder],
  );
  const jobsQuery = useJobs(listParams);
  const jobRows = jobsQuery.data;
  const pagination = jobsQuery.meta;

  const form = useForm<JobTrackerEntryFormValues>({
    resolver: zodResolver(jobTrackerEntrySchema),
    defaultValues: {
      company: "",
      title: "",
      description: "",
      location: "",
      link: "",
    },
  });

  const createJobMutation = useCreateJob({
    onSuccess: () => {
      showSuccess("Job created");
      setOpenDialogName(null);
      form.reset();
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  const handleEditRow = (row: JobRow) => {
    setSelectedJob(row);
    setOpenDialogName(JOB_TRACKER_DIALOGS.EDIT);
  };

  const updateStatusMutation = useUpdateJobStatus({
    onSuccess: () => showSuccess("Job status updated"),
    onError: (error) => showError(getErrorMessage(error)),
  });

  const deleteJobMutation = useDeleteJob({
    onSuccess: (_data, deletedRowId) => {
      showSuccess("Job deleted");
      setSelected((current) => current.filter((id) => id !== deletedRowId));
      setSelectedJob(null);
      setOpenDialogName(null);
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  const generateDocumentsMutation = useGenerateJobDocuments();

  const selectedRows = useMemo(
    () => jobRows.filter((row) => selected.includes(row.id)),
    [jobRows, selected],
  );

  const allFilteredRowsSelected =
    jobRows.length > 0 && jobRows.every((row) => selected.includes(row.id));

  const handleCreateEntry = (values: JobTrackerEntryFormValues) => {
    createJobMutation.mutate({ ...values, status: "Empty" });
  };

  const handleGenerateJobs = async (rowIds: string[]) => {
    if (rowIds.length === 0) return;

    setGeneratingIds((current) => Array.from(new Set([...current, ...rowIds])));

    try {
      const responses = await Promise.all(
        rowIds.map((rowId) => generateDocumentsMutation.mutateAsync(rowId)),
      );
      const payloads = responses
        .map((response) => response.data)
        .filter((payload): payload is GeneratedPayload => Boolean(payload));

      setGeneratedPayloads((current) => [...payloads, ...current]);
      showSuccess("Generated resume and cover letter");
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setGeneratingIds((current) =>
        current.filter((id) => !rowIds.includes(id)),
      );
    }
  };

  const handleClearSelection = () => {
    setSelected([]);
    setGeneratedPayloads([]);
  };

  const handlePasteJobLink = async () => {
    const clipboardText = await navigator.clipboard.readText();
    const value = clipboardText.trim();

    if (!value) return;

    form.setValue("link", value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleStatusChange = (rowId: string, status: JobStatus) => {
    updateStatusMutation.mutate({ id: rowId, status });
  };

  const handleDeleteRow = (row: JobRow) => {
    setSelectedJob(row);
    setOpenDialogName(JOB_TRACKER_DIALOGS.DELETE);
  };

  const handleToggleAll = () => {
    const visibleRowIds = jobRows.map((row) => row.id);

    if (allFilteredRowsSelected) {
      setSelected((current) =>
        current.filter((id) => !visibleRowIds.includes(id)),
      );
      return;
    }

    setSelected((current) =>
      Array.from(new Set([...current, ...visibleRowIds])),
    );
  };

  const handleToggleRow = (rowId: string) => {
    setSelected((current) =>
      current.includes(rowId)
        ? current.filter((id) => id !== rowId)
        : [...current, rowId],
    );
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleStatusFilterChange = (status: JobStatus | "") => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleSortOrderChange = (order: JobSortOrder) => {
    setSortOrder(order);
    setPage(1);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-4 md:px-6">
      <PageTitle title="Dashboard" />
      <JobTrackerFilters
        form={form}
        isCreating={createJobMutation.isPending}
        query={query}
        sortOrder={sortOrder}
        statusFilter={statusFilter}
        onCreateEntry={handleCreateEntry}
        onPasteJobLink={handlePasteJobLink}
        onQueryChange={handleQueryChange}
        onSortOrderChange={handleSortOrderChange}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <BulkGenerationActions
        isGenerating={generatingIds.length > 0}
        selectedCount={selectedRows.length}
        onClearSelection={handleClearSelection}
        onGenerate={() => handleGenerateJobs(selectedRows.map(({ id }) => id))}
      />

      <GeneratedPayloadPreview payloads={generatedPayloads} />

      <JobTrackerViewTabs
        allSelected={allFilteredRowsSelected}
        generatingIds={generatingIds}
        isLoading={jobsQuery.isLoading}
        rows={jobRows}
        selectedIds={selected}
        onClearSearch={() => setQuery("")}
        onCreateEntry={() => setOpenDialogName(JOB_TRACKER_DIALOGS.CREATE)}
        onDeleteRow={handleDeleteRow}
        onEditRow={handleEditRow}
        onGenerateRow={(rowId) => handleGenerateJobs([rowId])}
        onStatusChange={handleStatusChange}
        onToggleAll={handleToggleAll}
        onToggleRow={handleToggleRow}
      />

      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-background/80 px-4 py-3 text-sm text-muted-foreground">
          <div>
            Page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.total} jobs
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1 || jobsQuery.isFetching}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!pagination.hasNextPage || jobsQuery.isFetching}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <JobTrackerEditDialog />
      <JobTrackerDeleteDialog
        isDeleting={deleteJobMutation.isPending}
        onConfirmDelete={(rowId) => deleteJobMutation.mutate(rowId)}
      />
    </div>
  );
}

function JobTrackerEditDialog() {
  const { openDialogName, selectedJob, setOpenDialogName, setSelectedJob } =
    useJobTrackerUiStore();

  const form = useForm<JobTrackerEntryFormValues>({
    resolver: zodResolver(jobTrackerEntrySchema),
    defaultValues: {
      company: "",
      title: "",
      description: "",
      location: "",
      link: "",
    },
  });

  useEffect(() => {
    if (!selectedJob) return;

    form.reset({
      company: selectedJob.company,
      title: selectedJob.title,
      description: selectedJob.description,
      location: selectedJob.location,
      link: selectedJob.link,
    });
  }, [form, selectedJob]);

  const updateJobMutation = useUpdateJob({
    onSuccess: () => {
      showSuccess("Job updated");
      setOpenDialogName(null);
      setSelectedJob(null);
      form.reset();
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  if (!selectedJob) return null;

  const handleUpdateEntry = (values: JobTrackerEntryFormValues) => {
    updateJobMutation.mutate({
      id: selectedJob.id,
      data: values,
    });
  };

  return (
    <CustomDialog
      width="sm:max-w-xl"
      title="Edit generation entry"
      description="Update the company, job title, description, location, and job link used for generation."
      dialogName={JOB_TRACKER_DIALOGS.EDIT}
      openDialogName={openDialogName}
      onOpenDialogChange={setOpenDialogName}
    >
      <JobTrackerEntryForm
        form={form}
        isSubmitting={updateJobMutation.isPending}
        submitText="Update entry"
        onSubmit={handleUpdateEntry}
      />
    </CustomDialog>
  );
}

function JobTrackerDeleteDialog({
  isDeleting,
  onConfirmDelete,
}: {
  isDeleting: boolean;
  onConfirmDelete: (rowId: string) => void;
}) {
  const { openDialogName, selectedJob, setOpenDialogName } =
    useJobTrackerUiStore();

  if (!selectedJob) return null;

  const handleCancel = () => {
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-sm"
      title="Delete Job?"
      description={`Are you sure you want to delete "${selectedJob.title}" at "${selectedJob.company}"? This action cannot be undone.`}
      dialogName={JOB_TRACKER_DIALOGS.DELETE}
      openDialogName={openDialogName}
      onOpenDialogChange={setOpenDialogName}
    >
      <DialogFooter className="gap-2">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="text-sm"
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          variant="outline"
          className="text-sm text-red-600 border-red-300 hover:bg-red-50"
          onClick={() => onConfirmDelete(selectedJob.id)}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting" : "Delete"}
        </Button>
      </DialogFooter>
    </CustomDialog>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred";
}
