"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { showError, showSuccess } from "@/lib/toast/toast.lib";
import { useDebounce } from "@/shared/hooks/useDebounce";

import {
  useCreateJob,
  useDeleteJob,
  useGenerateJobDocuments,
  useJobs,
  useUpdateJobStatus,
} from "../application/useJobTrackerActions";
import {
  jobTrackerEntrySchema,
  type JobTrackerEntryFormValues,
} from "../schema/job-tracker.schema";
import type {
  GeneratedPayload,
  JobStatus,
} from "../types/job-tracker";
import BulkGenerationActions from "./bulk-generation-actions";
import GeneratedPayloadPreview from "./generated-payload-preview";
import JobTrackerFilters from "./job-tracker-filters";
import JobTrackerHeader from "./job-tracker-header";
import JobTrackerViewTabs from "./job-tracker-view-tabs";

const PAGE_LIMIT = 10;

export default function JobTrackerDashboard() {
  const [generatedPayloads, setGeneratedPayloads] = useState<
    GeneratedPayload[]
  >([]);
  const [generatingIds, setGeneratingIds] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  const listParams = useMemo(
    () => ({
      limit: PAGE_LIMIT,
      page,
      search: debouncedQuery.trim(),
    }),
    [page, debouncedQuery],
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
      setIsCreateOpen(false);
      form.reset();
    },
    onError: (error) => showError(getErrorMessage(error)),
  });

  const updateStatusMutation = useUpdateJobStatus({
    onSuccess: () => showSuccess("Job status updated"),
    onError: (error) => showError(getErrorMessage(error)),
  });

  const deleteJobMutation = useDeleteJob({
    onSuccess: (_data, deletedRowId) => {
      showSuccess("Job deleted");
      setSelected((current) =>
        current.filter((id) => id !== deletedRowId),
      );
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

  const handleDeleteRow = (rowId: string) => {
    deleteJobMutation.mutate(rowId);
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

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-4 md:px-6">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <JobTrackerHeader
          canBulkGenerate={selectedRows.length > 0}
          form={form}
          isCreating={createJobMutation.isPending}
          isCreateOpen={isCreateOpen}
          onBulkGenerate={() =>
            handleGenerateJobs(selectedRows.map(({ id }) => id))
          }
          onCreateEntry={handleCreateEntry}
          onCreateOpenChange={setIsCreateOpen}
          onPasteJobLink={handlePasteJobLink}
        />

        <JobTrackerFilters query={query} onQueryChange={handleQueryChange} />
      </section>

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
        onCreateEntry={() => setIsCreateOpen(true)}
        onDeleteRow={handleDeleteRow}
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
    </div>
  );
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "An unexpected error occurred";
}
