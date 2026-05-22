import { useState, type DragEvent } from "react";
import { ExternalLink, GripVertical } from "lucide-react";
import Link from "next/link";

import { JOB_STATUS_OPTIONS } from "../constants";
import type { JobRow, JobStatus } from "../types/job-tracker";
import {
  JobTrackerEmptyState,
  JobTrackerLoadingState,
} from "./job-tracker-states";

const statusColumnStyles: Record<JobStatus, string> = {
  Empty: "border-muted-foreground/20 bg-muted/30",
  Generated: "border-blue-500/20 bg-blue-500/5",
  Applied: "border-emerald-500/20 bg-emerald-500/5",
  Accepted: "border-green-600/20 bg-green-600/5",
  Rejected: "border-red-500/20 bg-red-500/5",
  "Interview stage": "border-amber-500/20 bg-amber-500/5",
};

type JobTrackerKanbanProps = {
  isLoading: boolean;
  rows: JobRow[];
  onClearSearch: () => void;
  onCreateEntry: () => void;
  onStatusChange: (rowId: string, status: JobStatus) => void;
};

export default function JobTrackerKanban({
  isLoading,
  rows,
  onClearSearch,
  onCreateEntry,
  onStatusChange,
}: JobTrackerKanbanProps) {
  const [draggingRowId, setDraggingRowId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border bg-background/80 shadow-sm">
        <JobTrackerLoadingState />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border bg-background/80 shadow-sm">
        <JobTrackerEmptyState
          onClearSearch={onClearSearch}
          onCreateEntry={onCreateEntry}
        />
      </div>
    );
  }

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    rowId: string,
  ) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", rowId);
    setDraggingRowId(rowId);
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
    nextStatus: JobStatus,
  ) => {
    event.preventDefault();

    const rowId = event.dataTransfer.getData("text/plain") || draggingRowId;

    if (rowId) {
      onStatusChange(rowId, nextStatus);
    }

    setDraggingRowId(null);
  };

  return (
    <div className="max-h-[620px] overflow-x-auto rounded-2xl border bg-background/80 p-4 shadow-sm">
      <div className="grid min-w-[1100px] grid-cols-6 gap-3">
        {JOB_STATUS_OPTIONS.map((status) => {
          const statusRows = rows.filter((row) => row.status === status);

          return (
            <div
              key={status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, status)}
              className={`flex h-[560px] min-h-0 flex-col rounded-xl border p-3 ${statusColumnStyles[status]}`}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{status}</h3>
                <span className="rounded-full border bg-background/70 px-2 py-0.5 text-xs text-muted-foreground">
                  {statusRows.length}
                </span>
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
                {statusRows.length > 0 ? (
                  statusRows.map((row) => (
                    <KanbanJobCard
                      key={row.id}
                      isDragging={draggingRowId === row.id}
                      row={row}
                      onDragEnd={() => setDraggingRowId(null)}
                      onDragStart={(event) => handleDragStart(event, row.id)}
                    />
                  ))
                ) : (
                  <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed bg-background/40 px-3 text-center text-xs text-muted-foreground">
                    Drop jobs here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KanbanJobCard({
  isDragging,
  row,
  onDragEnd,
  onDragStart,
}: {
  isDragging: boolean;
  row: JobRow;
  onDragEnd: () => void;
  onDragStart: (event: DragEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      draggable
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
      className={`rounded-lg border bg-background p-3 shadow-sm transition hover:border-primary/40 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{row.title}</div>
          <div className="mt-1 truncate text-xs text-muted-foreground">
            {row.company}
          </div>
        </div>
        <GripVertical className="mt-0.5 size-4 shrink-0 cursor-grab text-muted-foreground" />
      </div>

      <p className="mt-3 line-clamp-3 text-xs text-muted-foreground">
        {row.description}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        <span className="truncate text-muted-foreground">{row.location}</span>
        <Link
          href={row.link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-primary underline-offset-4 hover:underline"
        >
          <ExternalLink className="size-3" />
          Open
        </Link>
      </div>
    </div>
  );
}
