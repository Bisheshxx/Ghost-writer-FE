import Link from "next/link";
import {
  ExternalLink,
  FileText,
  Mail,
  PencilLine,
  Play,
  Trash2,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { JobRow, JobStatus } from "../types/job-tracker";
import IconTooltipButton from "./icon-tooltip-button";
import JobStatusSelect from "./job-status-select";
import {
  JobTrackerEmptyState,
  JobTrackerLoadingState,
} from "./job-tracker-states";

type StatusChangeHandler = (
  rowId: string,
  status: JobStatus,
) => void | Promise<void>;

type JobTrackerTableProps = {
  allSelected: boolean;
  generatingIds: string[];
  isLoading: boolean;
  rows: JobRow[];
  selectedIds: string[];
  onClearSearch: () => void;
  onCreateEntry: () => void;
  onDeleteRow: (row: JobRow) => void;
  onEditRow: (row: JobRow) => void;
  onGenerateRow: (rowId: string) => void;
  onStatusChange: StatusChangeHandler;
  onToggleAll: () => void;
  onToggleRow: (rowId: string) => void;
};

export default function JobTrackerTable({
  allSelected,
  generatingIds,
  isLoading,
  rows,
  selectedIds,
  onClearSearch,
  onCreateEntry,
  onDeleteRow,
  onEditRow,
  onGenerateRow,
  onStatusChange,
  onToggleAll,
  onToggleRow,
}: JobTrackerTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-background/80 shadow-sm">
      {isLoading ? (
        <JobTrackerLoadingState />
      ) : rows.length === 0 ? (
        <JobTrackerEmptyState
          onClearSearch={onClearSearch}
          onCreateEntry={onCreateEntry}
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Table className="w-full table-fixed">
              <TableHeader className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <TableRow>
                  <TableHead className="w-11 px-3 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={onToggleAll}
                    />
                  </TableHead>
                  <TableHead className="px-3 py-3 font-medium xl:hidden">
                    Job
                  </TableHead>
                  <TableHead className="hidden px-3 py-3 font-medium xl:table-cell">
                    Company
                  </TableHead>
                  <TableHead className="hidden px-3 py-3 font-medium xl:table-cell">
                    Job Title
                  </TableHead>
                  <TableHead className="hidden px-3 py-3 font-medium xl:table-cell">
                    Location
                  </TableHead>
                  <TableHead className="w-36 px-3 py-3 font-medium lg:w-40">
                    Status
                  </TableHead>
                  <TableHead className="w-24 px-3 py-3 font-medium">
                    Generation
                  </TableHead>
                  <TableHead className="w-32 px-3 py-3 font-medium">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <JobTrackerTableRow
                    key={row.id}
                    isGenerating={generatingIds.includes(row.id)}
                    isSelected={selectedIds.includes(row.id)}
                    row={row}
                    onDeleteRow={onDeleteRow}
                    onEditRow={onEditRow}
                    onGenerateRow={onGenerateRow}
                    onStatusChange={onStatusChange}
                    onToggleRow={onToggleRow}
                  />
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 p-3 md:hidden">
            {rows.map((row) => (
              <JobTrackerMobileCard
                key={row.id}
                isGenerating={generatingIds.includes(row.id)}
                isSelected={selectedIds.includes(row.id)}
                row={row}
                onDeleteRow={onDeleteRow}
                onEditRow={onEditRow}
                onGenerateRow={onGenerateRow}
                onStatusChange={onStatusChange}
                onToggleRow={onToggleRow}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function JobTrackerTableRow({
  isGenerating,
  isSelected,
  row,
  onDeleteRow,
  onEditRow,
  onGenerateRow,
  onStatusChange,
  onToggleRow,
}: {
  isGenerating: boolean;
  isSelected: boolean;
  row: JobRow;
  onDeleteRow: (row: JobRow) => void;
  onEditRow: (row: JobRow) => void;
  onGenerateRow: (rowId: string) => void;
  onStatusChange: StatusChangeHandler;
  onToggleRow: (rowId: string) => void;
}) {
  return (
    <TableRow className={isSelected ? "bg-muted/40" : ""}>
      <TableCell className="px-4 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleRow(row.id)}
        />
      </TableCell>
      <TableCell className="px-3 py-4 xl:hidden">
        <JobSummary row={row} />
      </TableCell>
      <TableCell className="hidden px-3 py-4 font-medium xl:table-cell">
        <Link
          className="inline-flex max-w-full items-center gap-1 text-primary underline-offset-4 hover:underline"
          href={row.link}
          target="_blank"
          rel="noreferrer"
        >
          <span className="truncate">{row.company}</span>
          <ExternalLink className="size-3.5 shrink-0" />
        </Link>
      </TableCell>
      <TableCell className="hidden truncate px-3 py-4 xl:table-cell">
        {row.title}
      </TableCell>
      <TableCell className="hidden truncate px-3 py-4 xl:table-cell">
        {row.location}
      </TableCell>
      <TableCell className="px-3 py-4">
        <JobStatusSelect
          value={row.status}
          onValueChange={(status) => {
            if (status) {
              void onStatusChange(row.id, status);
            }
          }}
          ariaLabel={`Update status for ${row.title}`}
          className="h-9 w-full"
        />
      </TableCell>
      <TableCell className="px-3 py-4">
        <GenerationIndicators row={row} />
      </TableCell>
      <TableCell className="px-3 py-4">
        <RowActions
          isGenerating={isGenerating}
          row={row}
          onDeleteRow={onDeleteRow}
          onEditRow={onEditRow}
          onGenerateRow={onGenerateRow}
        />
      </TableCell>
    </TableRow>
  );
}

function JobTrackerMobileCard({
  isGenerating,
  isSelected,
  row,
  onDeleteRow,
  onEditRow,
  onGenerateRow,
  onStatusChange,
  onToggleRow,
}: {
  isGenerating: boolean;
  isSelected: boolean;
  row: JobRow;
  onDeleteRow: (row: JobRow) => void;
  onEditRow: (row: JobRow) => void;
  onGenerateRow: (rowId: string) => void;
  onStatusChange: StatusChangeHandler;
  onToggleRow: (rowId: string) => void;
}) {
  return (
    <div
      className={`grid gap-4 rounded-lg border bg-background p-3 ${
        isSelected ? "border-primary/40 bg-muted/40" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleRow(row.id)}
          className="mt-1"
        />
        <JobSummary row={row} />
      </div>

      <div className="grid gap-3">
        <JobStatusSelect
          value={row.status}
          onValueChange={(status) => {
            if (status) {
              void onStatusChange(row.id, status);
            }
          }}
          ariaLabel={`Update status for ${row.title}`}
          className="h-9 w-full"
        />
        <div className="flex items-center justify-between gap-3">
          <GenerationIndicators row={row} />
          <RowActions
            isGenerating={isGenerating}
            row={row}
            onDeleteRow={onDeleteRow}
            onEditRow={onEditRow}
            onGenerateRow={onGenerateRow}
          />
        </div>
      </div>
    </div>
  );
}

function GenerationIndicators({ row }: { row: JobRow }) {
  if (!row.hasResume && !row.hasCoverLetter) {
    return <span className="text-sm text-muted-foreground">N/A</span>;
  }

  return (
    <div className="flex items-center gap-1">
      {row.hasResume && (
        <IconTooltipButton
          icon={FileText}
          label="Resume"
          ariaLabel="Open resume"
        />
      )}
      {row.hasCoverLetter && (
        <IconTooltipButton
          icon={Mail}
          label="Cover letter"
          ariaLabel="Open cover letter generation"
        />
      )}
    </div>
  );
}

function JobSummary({ row }: { row: JobRow }) {
  return (
    <div className="min-w-0 flex-1">
      <Link
        className="inline-flex max-w-full items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
        href={row.link}
        target="_blank"
        rel="noreferrer"
      >
        <span className="truncate">{row.company}</span>
        <ExternalLink className="size-3.5 shrink-0" />
      </Link>
      <div className="mt-1 truncate text-sm text-foreground">{row.title}</div>
      <div className="mt-1 truncate text-xs text-muted-foreground">
        {row.location}
      </div>
    </div>
  );
}

function RowActions({
  isGenerating,
  row,
  onDeleteRow,
  onEditRow,
  onGenerateRow,
}: {
  isGenerating: boolean;
  row: JobRow;
  onDeleteRow: (row: JobRow) => void;
  onEditRow: (row: JobRow) => void;
  onGenerateRow: (rowId: string) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <IconTooltipButton
        icon={PencilLine}
        label="Edit"
        ariaLabel="Edit generation"
        onClick={() => onEditRow(row)}
      />
      <IconTooltipButton
        icon={Trash2}
        label="Delete"
        ariaLabel="Delete generation"
        onClick={() => onDeleteRow(row)}
      />
      <IconTooltipButton
        icon={Play}
        label={isGenerating ? "Generating" : "Run generation"}
        ariaLabel="Run generation"
        iconClassName={`size-4 fill-current ${
          isGenerating ? "animate-spin" : ""
        }`}
        onClick={() => onGenerateRow(row.id)}
      />
    </div>
  );
}
