# Kanban Pagination API Plan

## Summary

Use per-status pagination for the Kanban board. Each Kanban column should fetch and paginate its own jobs independently because each status can have a different number of jobs.

The table view can use normal global pagination. The Kanban view should not depend on one shared page of mixed-status jobs.

## API Shape

Fetch jobs for one status at a time:

```http
GET /jobs?status=Generated&page=1&limit=20&search=frontend
```

Expected response shape:

```ts
type PaginatedJobsResponse = {
  data: JobRow[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};
```

Update a job status:

```http
PATCH /jobs/:id/status
```

```ts
type UpdateJobStatusPayload = {
  status: JobStatus;
};
```

## Frontend Structure

Keep API integration inside the job tracker feature:

- `features/job-tracker/service/job-tracker-service.ts`
- `features/job-tracker/application/useJobTrackerActions.ts`

Recommended hooks:

```ts
useJobTrackerTableJobs({ page, limit, query })
useJobTrackerKanbanColumnJobs({ status, query })
useUpdateJobStatus()
```

Use React Query query keys like:

```ts
["job-tracker", "table", { page, limit, query }]
["job-tracker", "kanban", status, query]
```

Prefer `useInfiniteQuery` for Kanban columns because each column needs independent `fetchNextPage` behavior.

## Kanban Behavior

- Initial Kanban load fetches page 1 for every status column.
- Scrolling near the bottom of a status column fetches the next page for that status only.
- Each status column owns its own loading and has-more state.
- Show a small inline loader at the bottom of a column while loading more.
- Show the API `meta.total` count in the column header, not only the currently loaded count.
- Search/filter changes reset every Kanban column back to page 1.

## Drag And Drop Status Updates

Table status changes and Kanban drag-and-drop should call the same status mutation.

On drop:

- Optimistically remove the job from the old status column cache.
- Insert the job at the top of the new status column cache.
- Update or invalidate table queries so table view reflects the new status.
- Roll back the card to the old column if the mutation fails.

Do not require every page in a destination column to be loaded before moving a card there.

## Test Scenarios

- Kanban loads page 1 for every status.
- Scrolling one status column fetches only that status column's next page.
- Dragging a job from `Generated` to `Applied` updates the UI immediately.
- A failed status mutation restores the job to its original status.
- Search query changes reset Kanban pagination.
- Table pagination works independently from Kanban pagination.
- Column counts use API totals instead of loaded row counts.

## Assumptions

- Backend supports filtering jobs by `status`.
- Page-based pagination is acceptable for v1.
- Cursor pagination is preferred later if jobs are frequently reordered or updated.
- The Kanban board should prioritize column-level lazy loading over exact global ordering across all jobs.
