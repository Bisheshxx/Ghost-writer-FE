---
name: ghost-feature-api
description: Build or update API-backed feature modules in the Ghost Writer frontend. Use when adding a new feature/domain, extending an existing feature service, wiring React Query hooks, creating Zod/RHF forms, or implementing frontend CRUD flows that must follow openapi/swagger.json and the existing feature-domain structure.
---

# Ghost Feature API

## Workflow

1. Read `openapi/swagger.json` before writing API code. Do not invent endpoints, methods, request bodies, response shapes, or path params.
2. Inspect the nearest existing feature with the same behavior. Use `features/experience` as the CRUD baseline unless another domain is clearly closer.
3. Keep route files in `app/`. Put feature-specific code under `features/<domain>/`.
4. Add or update these files as needed:
   - `schema/`: Zod validation schema.
   - `types/`: entity, form, request, and response types.
   - `service/`: backend methods using `request` from `@/lib/axios/request`.
   - `application/`: TanStack Query hooks and invalidation.
   - `store/`: feature-local dialog or selection state only when needed.
   - `component/` and `form/`: UI and React Hook Form components.
   - `index.tsx`: page-level feature export.
5. Use shadcn UI from `components/ui`, `react-hook-form`, and `zod` for forms.
6. Keep API calls out of presentation components. Components should call feature application hooks.
7. Validate with `pnpm lint`; run `pnpm build` when routes, shared types, providers, auth, or API contracts change.

## Swagger Rules

- Match frontend service URLs to Swagger paths without the `/api/` prefix because Axios already appends `/api`.
- Example: Swagger path `/api/v1/experience` becomes service URL `v1/experience`.
- Use the exact path parameter names and HTTP methods from Swagger.
- For `204` responses, type the service response as `request<null>()`.
- If Swagger uses wrapper bodies, preserve them. Example: creating experience sends `{ experiences: [experience] }`.
- If the backend Swagger changed, run `pnpm sync:api` before implementing.

## References

Read `references/baseline.md` when adding a new feature or when unsure which local pattern to follow.
