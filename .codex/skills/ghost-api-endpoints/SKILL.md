---
name: ghost-api-endpoints
description: Add or update frontend endpoint integration in the Ghost frontend. Use when creating new endpoint service methods, syncing Swagger, changing request/response types, adding params or pagination, wiring mutations/queries, or fixing frontend API contract issues against openapi/swagger.json.
---

# Ghost API Endpoints

Use with `ghost-project-follow`. For full feature UI work, also use `ghost-feature-api`.

## Endpoint Workflow

1. Read `openapi/swagger.json` for every path, method, param, body, response, and wrapper shape. Do not invent API contracts.
2. If Swagger is stale or the backend changed, run `pnpm sync:api` before coding.
3. Inspect the closest existing service:
   - CRUD: `features/experience/service/experience-service.ts`
   - Pagination and params: `features/job-tracker/service/job-tracker-service.ts`
   - Simple generation action: `features/coverletter/service/coverletter-service.ts`
4. Add service methods in `features/<domain>/service/` using `request` from `@/lib/axios/request`.
5. Keep service URLs without `/api`; Axios already appends `/api`. Example: Swagger `/api/v1/experience` becomes `v1/experience`.
6. Type successful payload data as `request<TData>()`. Type no-content responses as `request<null>()`.
7. Preserve backend wrapper bodies exactly, such as `{ experiences: [experience] }`.
8. Put query and mutation orchestration in `features/<domain>/application/`.

## Hook Pattern

- Prefer `useApiQuery` from `shared/hooks/useApiQuery` for straightforward reads. It unwraps `response.data?.data` and exposes `meta`.
- Prefer `useApiMutation` from `shared/hooks/useApiMutation` for writes. Pass `invalidateQueries` as root query-key strings.
- Use direct `useQuery`, `useMutation`, and `useQueryClient` only when the flow needs custom keys, pagination, optimistic updates, or scoped invalidation. `features/job-tracker/application/useJobTrackerActions.ts` is the baseline.
- Components and forms should call application hooks, not services.

## Types And Errors

- Keep API response contracts aligned with `shared/types/global.types.ts`.
- Use `ApiErrorHandler` behavior from `lib/axios/request.ts`; do not duplicate error normalization in services.
- Map server validation errors into forms near the form or dialog owner.

## Validation

- Check the endpoint path, method, body, params, and response against Swagger after editing.
- Run `pnpm lint`.
- Run `pnpm build` when endpoint changes affect shared types, routes, providers, auth, or cross-feature contracts.

