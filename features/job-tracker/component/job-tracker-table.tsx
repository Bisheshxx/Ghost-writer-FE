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

import { JOB_STATUS_OPTIONS, JOB_TABLE_HEADERS } from "../constants";
import type { JobRow, JobStatus } from "../types/job-tracker";
import IconTooltipButton from "./icon-tooltip-button";
import {
  JobTrackerEmptyState,
  JobTrackerLoadingState,
} from "./job-tracker-states";

type JobTrackerTableProps = {
  allSelected: boolean;
  isLoading: boolean;
  rows: JobRow[];
  selectedIds: string[];
  onClearSearch: () => void;
  onCreateEntry: () => void;
  onStatusChange: (rowId: string, status: JobStatus) => void;
  onToggleAll: () => void;
  onToggleRow: (rowId: string) => void;
};

export default function JobTrackerTable({
  allSelected,
  isLoading,
  rows,
  selectedIds,
  onClearSearch,
  onCreateEntry,
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
        <Table className="min-w-[1300px]">
          <TableHeader className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <TableRow>
              <TableHead className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                />
              </TableHead>
              {JOB_TABLE_HEADERS.map((header) => (
                <TableHead key={header} className="px-4 py-3 font-medium">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <JobTrackerTableRow
                key={row.id}
                isSelected={selectedIds.includes(row.id)}
                row={row}
                onStatusChange={onStatusChange}
                onToggleRow={onToggleRow}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

function JobTrackerTableRow({
  isSelected,
  row,
  onStatusChange,
  onToggleRow,
}: {
  isSelected: boolean;
  row: JobRow;
  onStatusChange: (rowId: string, status: JobStatus) => void;
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
      <TableCell className="px-4 py-4 font-medium">{row.company}</TableCell>
      <TableCell className="px-4 py-4">{row.title}</TableCell>
      <TableCell className="max-w-[360px] px-4 py-4 text-muted-foreground">
        {row.description}
      </TableCell>
      <TableCell className="px-4 py-4">{row.location}</TableCell>
      <TableCell className="px-4 py-4">
        <StatusSelect
          value={row.status}
          onChange={(status) => onStatusChange(row.id, status)}
        />
      </TableCell>
      <TableCell className="px-4 py-4">
        <div className="flex items-center gap-1">
          <IconTooltipButton
            icon={FileText}
            label="Resume"
            ariaLabel="Open resume"
          />
          <IconTooltipButton
            icon={Mail}
            label="Cover letter"
            ariaLabel="Open cover letter generation"
          />
        </div>
      </TableCell>
      <TableCell className="px-4 py-4">
        <Link
          className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
          href={row.link}
          target="_blank"
          rel="noreferrer"
        >
          <ExternalLink className="size-3.5" /> Open
        </Link>
      </TableCell>
      <TableCell className="px-4 py-4">
        <div className="flex items-center gap-1">
          <IconTooltipButton
            icon={PencilLine}
            label="Edit"
            ariaLabel="Edit generation"
          />
          <IconTooltipButton
            icon={Trash2}
            label="Delete"
            ariaLabel="Delete generation"
          />
          <IconTooltipButton
            icon={Play}
            label="Run generation"
            iconClassName="size-4 fill-current"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: JobStatus;
  onChange: (status: JobStatus) => void;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as JobStatus)}
      className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {JOB_STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
