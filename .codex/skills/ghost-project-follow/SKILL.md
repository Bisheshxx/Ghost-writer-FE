---
name: ghost-project-follow
description: Follow Ghost frontend project conventions before making code changes. Use for any implementation, refactor, feature, route, component, hook, endpoint, or test work in this repository so changes obey AGENTS.md, agent.md, Next.js 16 local docs, shadcn, feature-folder, validation, and command conventions.
---

# Ghost Project Follow

Use this skill at the start of code work in `ghost-frontend`.

## Required Context

1. Read the nearest `AGENTS.md` for the files being changed. Root rules always apply.
2. Read `agent.md` when the task touches app shape, API, query/mutation, forms, dialogs, styling, or validation.
3. For Next.js framework APIs, read the relevant local guide in `node_modules/next/dist/docs/` before editing. This repo uses Next.js `16.2.4`; do not rely on older App Router assumptions.

## Repo Rules To Follow

- Keep routes thin in `app/`; feature work belongs in `features/<domain>/`.
- Use existing feature folders: `application`, `component`, `form`, `schema`, `service`, `store`, and `types`.
- Use shadcn primitives from `components/ui` for common controls. Install missing shadcn components before hand-rolling common UI, unless shadcn is unavailable or insufficient.
- Use `zod` plus `react-hook-form` for forms.
- Search `features/<domain>`, `components`, `shared`, and `lib` before adding helpers.
- Use `lucide-react` icons for actions when an icon exists.
- Preserve Clerk, TanStack Query, Zustand, Axios, and API response patterns.
- Do not create new skills, hooks, docs, or nested `AGENTS.md` unless the user asked for them or you first explain pros/cons and get approval.

## Validation

- Run `pnpm lint` for code changes.
- Run `pnpm build` when changes affect routes, providers, auth, shared types, Next config, API contracts, or anything likely to fail only at compile time.
- If tests are added later, run the narrow test command plus lint.

