import {
  startTransition,
  useOptimistic,
  useRef,
  useState,
  type DragEvent,
  type UIEvent,
} from "react";
import { ExternalLink, GripVertical } from "lucide-react";
import Link from "next/link";

import { useJobsByStatusInfinite } from "../application/useJobTrackerActions";
import { JOB_STATUS_OPTIONS } from "../constants";
import type { JobRow, JobStatus } from "../types/job-tracker";

const statusColumnStyles: Record<JobStatus, string> = {
  Empty: "border-muted-foreground/20 bg-muted/30",
  Generated: "border-blue-500/20 bg-blue-500/5",
  Applied: "border-emerald-500/20 bg-emerald-500/5",
  Accepted: "border-green-600/20 bg-green-600/5",
  Rejected: "border-red-500/20 bg-red-500/5",
  "Interview stage": "border-amber-500/20 bg-amber-500/5",
};

const KANBAN_COLUMN_LIMIT = 10;
const KANBAN_SCROLL_THRESHOLD = 80;

type JobTrackerKanbanProps = {
  onStatusChange: (rowId: string, status: JobStatus) => Promise<void>;
};

type OptimisticJobMove = {
  clientId: number;
  row: JobRow;
  status: JobStatus;
};

export default function JobTrackerKanban({
  onStatusChange,
}: JobTrackerKanbanProps) {
  const [draggingRow, setDraggingRow] = useState<JobRow | null>(null);
  const [pendingMoves, setPendingMoves] = useState<OptimisticJobMove[]>([]);
  const optimisticMoveIdRef = useRef(0);
  // Keep dragged cards in their target columns while the API updates and
  // React Query refetches. This prevents stale column data from flickering in.
  const [optimisticMoves, addOptimisticMove] = useOptimistic(
    pendingMoves,
    mergeOptimisticMove,
  );

  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    row: JobRow,
  ) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", row.id);
    setDraggingRow(row);
  };

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
    nextStatus: JobStatus,
  ) => {
    event.preventDefault();

    const rowId = event.dataTransfer.getData("text/plain") || draggingRow?.id;
    const row = draggingRow?.id === rowId ? draggingRow : null;

    if (rowId && row && row.status !== nextStatus) {
      optimisticMoveIdRef.current += 1;

      // clientId makes each drop unique, so an older request cannot clear a
      // newer optimistic move for the same job.
      const move = {
        clientId: optimisticMoveIdRef.current,
        row,
        status: nextStatus,
      };

      startTransition(() => {
        addOptimisticMove(move);
        setPendingMoves((current) => mergeOptimisticMove(current, move));
      });

      // onStatusChange resolves after query invalidation, so removing the
      // overlay here reveals fresh server data instead of stale cached data.
      void onStatusChange(rowId, nextStatus)
        .catch(() => undefined)
        .finally(() => {
          setPendingMoves((current) =>
            current.filter(
              (pendingMove) =>
                pendingMove.row.id !== rowId ||
                pendingMove.clientId !== move.clientId,
            ),
          );
        });
    } else if (rowId) {
      void onStatusChange(rowId, nextStatus);
    }

    setDraggingRow(null);
  };

  return (
    <div className="max-h-[620px] overflow-x-auto rounded-2xl border bg-background/80 p-4 shadow-sm">
      <div className="grid min-w-[1100px] grid-cols-6 gap-3">
        {JOB_STATUS_OPTIONS.map((status) => (
          <KanbanStatusColumn
            key={status}
            draggingRowId={draggingRow?.id ?? null}
            optimisticMoves={optimisticMoves}
            status={status}
            onDragEnd={() => setDraggingRow(null)}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}

function KanbanStatusColumn({
  draggingRowId,
  optimisticMoves,
  status,
  onDragEnd,
  onDragStart,
  onDrop,
}: {
  draggingRowId: string | null;
  optimisticMoves: OptimisticJobMove[];
  status: JobStatus;
  onDragEnd: () => void;
  onDragStart: (event: DragEvent<HTMLDivElement>, row: JobRow) => void;
  onDrop: (event: DragEvent<HTMLDivElement>, nextStatus: JobStatus) => void;
}) {
  const jobsQuery = useJobsByStatusInfinite({
    limit: KANBAN_COLUMN_LIMIT,
    status,
  });
  const columnCount = getOptimisticColumnCount(
    jobsQuery.meta?.total ?? jobsQuery.rows.length,
    status,
    optimisticMoves,
  );
  const statusRows = getOptimisticStatusRows(
    jobsQuery.rows,
    status,
    optimisticMoves,
    columnCount,
  );

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    const isNearBottom =
      scrollHeight - scrollTop - clientHeight <= KANBAN_SCROLL_THRESHOLD;

    if (
      isNearBottom &&
      jobsQuery.hasNextPage &&
      !jobsQuery.isFetchingNextPage
    ) {
      void jobsQuery.fetchNextPage();
    }
  };

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => onDrop(event, status)}
      className={`flex h-[560px] min-h-0 flex-col rounded-xl border p-3 ${statusColumnStyles[status]}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{status}</h3>
        <span className="rounded-full border bg-background/70 px-2 py-0.5 text-xs text-muted-foreground">
          {columnCount}
        </span>
      </div>

      <div
        onScroll={handleScroll}
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1"
      >
        {jobsQuery.isLoading ? (
          <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed bg-background/40 px-3 text-center text-xs text-muted-foreground">
            Loading jobs...
          </div>
        ) : jobsQuery.isError ? (
          <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed bg-background/40 px-3 text-center text-xs text-muted-foreground">
            Could not load jobs
          </div>
        ) : statusRows.length > 0 ? (
          <>
            {statusRows.map((row) => (
              <KanbanJobCard
                key={row.id}
                isDragging={draggingRowId === row.id}
                row={row}
                onDragEnd={onDragEnd}
                onDragStart={(event) => onDragStart(event, row)}
              />
            ))}
            {jobsQuery.isFetchingNextPage && (
              <div className="rounded-lg border border-dashed bg-background/40 px-3 py-4 text-center text-xs text-muted-foreground">
                Loading more jobs...
              </div>
            )}
          </>
        ) : (
          <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed bg-background/40 px-3 text-center text-xs text-muted-foreground">
            Drop jobs here
          </div>
        )}
      </div>
    </div>
  );
}

function mergeOptimisticMove(
  current: OptimisticJobMove[],
  nextMove: OptimisticJobMove,
) {
  return [
    nextMove,
    ...current.filter((move) => move.row.id !== nextMove.row.id),
  ];
}

function getOptimisticStatusRows(
  rows: JobRow[],
  status: JobStatus,
  moves: OptimisticJobMove[],
  maxRows: number,
) {
  const moveByRowId = new Map(moves.map((move) => [move.row.id, move]));
  const rowIds = new Set(rows.map((row) => row.id));

  // A moved card may not exist in the target column query yet, so inject it
  // from the optimistic move until the refetch includes it.
  const movedIntoColumn = moves
    .filter((move) => move.status === status && !rowIds.has(move.row.id))
    .map((move) => ({ ...move.row, status: move.status }));

  // Apply pending moves to stale server rows first. Rows optimistically moved
  // away from this column are filtered out before rendering.
  const visibleRows = rows
    .map((row) => {
      const move = moveByRowId.get(row.id);

      return move ? { ...row, status: move.status } : row;
    })
    .filter((row) => row.status === status);

  // Refetches can briefly combine stale pages with the optimistic insert. Keep
  // one row per job, sort consistently, and do not render more rows than the
  // metadata-backed optimistic count says the column should contain.
  return sortKanbanRows(dedupeRows([...movedIntoColumn, ...visibleRows])).slice(
    0,
    maxRows,
  );
}

function dedupeRows(rows: JobRow[]) {
  return [...new Map(rows.map((row) => [row.id, row])).values()];
}

function sortKanbanRows(rows: JobRow[]) {
  return [...rows].sort(compareKanbanRows);
}

function compareKanbanRows(a: JobRow, b: JobRow) {
  const timestampDiff = getSortableTime(b) - getSortableTime(a);

  if (timestampDiff !== 0) return timestampDiff;

  const titleDiff = a.title.localeCompare(b.title);

  if (titleDiff !== 0) return titleDiff;

  const companyDiff = a.company.localeCompare(b.company);

  if (companyDiff !== 0) return companyDiff;

  return a.id.localeCompare(b.id);
}

function getSortableTime(row: JobRow) {
  const timestamp = row.updatedAt ?? row.createdAt;

  return timestamp ? Date.parse(timestamp) || 0 : 0;
}

function getOptimisticColumnCount(
  count: number,
  status: JobStatus,
  moves: OptimisticJobMove[],
) {
  return Math.max(
    0,
    moves.reduce((total, move) => {
      if (move.row.status === status && move.status !== status) {
        return total - 1;
      }

      if (move.row.status !== status && move.status === status) {
        return total + 1;
      }

      return total;
    }, count),
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
