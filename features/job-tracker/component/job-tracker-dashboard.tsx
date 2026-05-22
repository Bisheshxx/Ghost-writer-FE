"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { INITIAL_JOB_ROWS } from "../constants";
import {
  jobTrackerEntrySchema,
  type JobTrackerEntryFormValues,
} from "../schema/job-tracker.schema";
import type {
  GeneratedPayload,
  JobRow,
  JobStatus,
} from "../types/job-tracker";
import BulkGenerationActions from "./bulk-generation-actions";
import GeneratedPayloadPreview from "./generated-payload-preview";
import JobTrackerFilters from "./job-tracker-filters";
import JobTrackerHeader from "./job-tracker-header";
import JobTrackerViewTabs from "./job-tracker-view-tabs";

export default function JobTrackerDashboard() {
  const [generatedPayloads, setGeneratedPayloads] = useState<
    GeneratedPayload[]
  >([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [jobRows, setJobRows] = useState<JobRow[]>(INITIAL_JOB_ROWS);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

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

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return jobRows;

    return jobRows.filter((row) =>
      `${row.company} ${row.title} ${row.description} ${row.location}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [jobRows, query]);

  const selectedRows = useMemo(
    () => jobRows.filter((row) => selected.includes(row.id)),
    [jobRows, selected],
  );

  const allFilteredRowsSelected =
    filteredRows.length > 0 &&
    filteredRows.every((row) => selected.includes(row.id));

  const handleCreateEntry = (values: JobTrackerEntryFormValues) => {
    const nextRow: JobRow = {
      id: crypto.randomUUID(),
      company: values.company,
      title: values.title,
      description: values.description,
      location: values.location,
      status: "Empty",
      link: values.link,
    };

    setJobRows((current) => [nextRow, ...current]);
    setIsCreateOpen(false);
    form.reset();
  };

  const handleBulkGenerate = () => {
    setGeneratedPayloads(
      selectedRows.map(({ company, title, description, location }) => ({
        company,
        title,
        description,
        location,
      })),
    );
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
    setJobRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, status } : row)),
    );
  };

  const handleToggleAll = () => {
    const visibleRowIds = filteredRows.map((row) => row.id);

    if (allFilteredRowsSelected) {
      setSelected((current) =>
        current.filter((id) => !visibleRowIds.includes(id)),
      );
      return;
    }

    setSelected((current) => Array.from(new Set([...current, ...visibleRowIds])));
  };

  const handleToggleRow = (rowId: string) => {
    setSelected((current) =>
      current.includes(rowId)
        ? current.filter((id) => id !== rowId)
        : [...current, rowId],
    );
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-4 md:px-6">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <JobTrackerHeader
          canBulkGenerate={selectedRows.length > 0}
          form={form}
          isCreateOpen={isCreateOpen}
          onBulkGenerate={handleBulkGenerate}
          onCreateEntry={handleCreateEntry}
          onCreateOpenChange={setIsCreateOpen}
          onPasteJobLink={handlePasteJobLink}
        />

        <JobTrackerFilters query={query} onQueryChange={setQuery} />
      </section>

      <BulkGenerationActions
        selectedCount={selectedRows.length}
        onClearSelection={handleClearSelection}
        onGenerate={handleBulkGenerate}
      />

      <GeneratedPayloadPreview payloads={generatedPayloads} />

      <JobTrackerViewTabs
        allSelected={allFilteredRowsSelected}
        isLoading={isLoading}
        rows={filteredRows}
        selectedIds={selected}
        onClearSearch={() => setQuery("")}
        onCreateEntry={() => setIsCreateOpen(true)}
        onStatusChange={handleStatusChange}
        onToggleAll={handleToggleAll}
        onToggleRow={handleToggleRow}
      />
    </div>
  );
}
