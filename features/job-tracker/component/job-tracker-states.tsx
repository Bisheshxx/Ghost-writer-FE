import { LoaderCircle, Plus, SquareDashed } from "lucide-react";

import { Button } from "@/components/ui/button";

export function JobTrackerLoadingState() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 px-6 py-12 text-center">
      <div className="flex items-center gap-3 rounded-full border bg-muted/40 px-4 py-2">
        <LoaderCircle className="size-5 animate-spin text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Loading jobs
        </span>
      </div>
      <div className="grid w-full max-w-4xl gap-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-12 animate-pulse rounded-xl border bg-muted/30"
          />
        ))}
      </div>
    </div>
  );
}

export function JobTrackerEmptyState({
  onClearSearch,
  onCreateEntry,
}: {
  onClearSearch: () => void;
  onCreateEntry: () => void;
}) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="rounded-full border bg-muted/40 p-4">
        <SquareDashed className="size-7 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">No jobs found</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          There are no rows to show for the current search. Create a new entry
          or clear the filter to see results.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" onClick={onClearSearch}>
          Clear search
        </Button>
        <Button onClick={onCreateEntry} className="gap-2">
          <Plus className="size-4" /> Create entry
        </Button>
      </div>
    </div>
  );
}
