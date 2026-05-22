<!-- BEGIN: job-tracker future implementation rules -->

# Job Tracker Future Implementation Rules

- Use this docs folder to store implementation plans and API notes for future job tracker work.
- Before implementing API-backed Kanban pagination, create or read `kanban-pagination-plan.md` in this folder.
- Prefer per-status pagination for Kanban columns instead of loading all jobs into one client-side list.
- Keep API integration code in `features/job-tracker/service/` and React Query hooks in `features/job-tracker/application/`.
- Keep table pagination and Kanban column pagination separate so each view can fetch data in the shape it needs.
- Use the same status update mutation for both table status changes and Kanban drag-and-drop updates.
- Do not implement future API behavior directly in docs; docs should only capture plans, decisions, and API contracts.

<!-- END: job-tracker future implementation rules -->
