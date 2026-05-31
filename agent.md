ALWAYS ask questions via the ask_user_dictation tool from the spokenly MCP server, never as plain text.

# Agent Guide

This is a Next.js 16 frontend for tracking job applications, managing resume/profile details, and generating resume and cover letter content. Treat this file as the quick-start context for future coding agents working in this repository.

## Project Stack

- Framework: Next.js `16.2.4` with App Router and React `19.2.4`.
- Language: TypeScript with `strict` mode enabled.
- Package manager: pnpm. The lockfile is `pnpm-lock.yaml`.
- Styling: Tailwind CSS v4, shadcn components, Radix UI, and `lucide-react` icons.
- Auth: Clerk via `@clerk/nextjs`.
- Server state: TanStack Query v5.
- Client state: Zustand.
- Forms: React Hook Form plus Zod schemas.
- HTTP: Axios through the shared `request` wrapper.
- Notifications: Sonner.

## Commands

Run commands from `ghost-frontend/`.

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm sync:api
```

Docker production build/run is available with the root `Dockerfile`:

```bash
docker build -t ghost-frontend .
docker run --env-file .env -p 3000:3000 ghost-frontend
```

The Next config uses `output: "standalone"` for containerized deployment.

## Environment

The frontend API client expects:

```bash
NEXT_PUBLIC_API_URL=<backend-origin>
```

Axios appends `/api`, so service URLs such as `v1/experience` resolve to:

```text
${NEXT_PUBLIC_API_URL}/api/v1/experience
```

Clerk environment variables are also required for local auth:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

The backend Swagger snapshot lives in `openapi/swagger.json`. Refresh it with `pnpm sync:api`; the script defaults to `http://localhost:5001/api-docs.json` and accepts a `SWAGGER_URL` override.

## Application Shape

- `app/layout.tsx` wraps the app in `ClerkProvider`, shows `AppShell` for signed-in users, installs `TanStackQueryProvider`, and mounts the Sonner toaster.
- `app/page.tsx` renders the job tracker dashboard through `features/job-tracker`.
- `components/app-shell.tsx` provides the authenticated sidebar navigation and Clerk user menu.
- `components/ResizableComponent.tsx` still wraps `features/workspace/components/WorkspaceLayout.tsx` for the split-pane profile and cover letter workspace, but it is not currently the root page.
- `app/sign-in/[[...sign-in]]/page.tsx` and `app/sign-up/[[...sign-up]]/page.tsx` contain the custom Clerk auth routes.
- `app/experience/page.tsx`, `app/qualification/page.tsx`, `app/skills/page.tsx`, and `app/projects/page.tsx` route to their matching profile feature pages.

## Directory Conventions

- `features/<domain>/component`: feature UI and list/detail rendering.
- `features/<domain>/form`: React Hook Form forms.
- `features/<domain>/schema`: Zod validation schemas.
- `features/<domain>/service`: API methods using `request`.
- `features/<domain>/types`: feature-specific TypeScript types.
- `components/ui`: shadcn/Radix UI primitives. Prefer extending/reusing these instead of hand-rolling common controls.
- `shared/component`: reusable app-level components such as dialogs, empty states, buttons, and tabs.
- `shared/hooks`: TanStack Query wrappers.
- `shared/providers`: app providers.
- `lib/axios`: Axios instance, Clerk token interceptor, error normalization, and request helper.
- `store`: legacy/global stores only. Prefer feature-local stores under `features/<domain>/store`.

## API Pattern

Use `lib/axios/request.ts` for backend calls. It returns `ApiResponse<T>`, handles `204` empty responses, and normalizes failures to `ApiErrorHandler`.

Service methods should follow the existing shape:

```ts
export const ExampleService = {
  getItems: async () =>
    request<Item[]>({
      method: "GET",
      url: "v1/items",
    }),
};
```

The Axios instance is defined in `lib/axios/api.ts` with `withCredentials: true`. `lib/axios/interceptor.ts` reads the Clerk token with `getToken()` and attaches it as a Bearer token.

## Query and Mutation Pattern

Use `useApiQuery` for reads:

```ts
const { data, isLoading, isSuccess } = useApiQuery({
  queryKey: ["experience"],
  queryFn: () => ExperienceService.getExperience(),
});
```

Use `useApiMutation` for writes. Pass `invalidateQueries` as a list of root query-key strings:

```ts
const createExperience = useApiMutation(ExperienceService.createExperience, {
  invalidateQueries: ["experience"],
  onSuccess: () => showSuccess("Experience added successfully!"),
});
```

Current query keys include `experience`, `qualifications`, `project`, and `skills`. Keep keys stable when adding invalidation.

Job tracker uses feature-specific TanStack Query hooks in `features/job-tracker/application/useJobTrackerActions.ts`. Keep new job tracker reads and writes in that application layer instead of moving API calls into presentation components.

## Forms and Validation

New forms should use:

- Zod schema in `features/<domain>/schema`.
- Inferred or matching type in `features/<domain>/types`.
- `useForm` with `zodResolver`.
- shadcn `Field`, `FieldLabel`, `FieldError`, `Input`, `Textarea`, and `Button` components.

The repo already follows this pattern in experience, qualification, project, skills, cover letter, and job description forms.

## Dialog and Selection State

Dialog state should live in the owning feature.

- Add dialog names to `features/<domain>/constants.ts`.
- Add selected entities to `features/<domain>/store` only when cross-component dialog state needs them.
- Open dialogs with the feature-local dialog constants.
- Close dialogs with `setOpenDialogName(null)`.
- Use `shared/component/dialog/CustomDialog.tsx` for modal shells, passing `openDialogName` and `onOpenDialogChange` from the feature store.

## Styling Guidelines

- Prefer shadcn components from `components/ui`.
- Use Tailwind utility classes and the theme tokens defined in `app/globals.css`.
- The project uses Roboto Mono for body, sans, mono, and heading fonts.
- Use `lucide-react` for action icons.
- Keep scrollable feature lists inside `flex-1 min-h-0 overflow-y-auto` containers when working in the split-pane layout.

## Existing Feature Domains

- `experience`: CRUD for work history.
- `qualification`: CRUD for qualifications.
- `project`: CRUD for projects.
- `skills`: profile skill groups, including technical, personal, and awards.
- `coverletter`: submits a job description to generate a cover letter and displays the output.
- `job-tracker`: root application workspace for jobs, statuses, search, pagination, deletion, and document generation.
- `workspace`: owns the split-pane profile and cover letter composition.
- `home`: job description form, currently separate from the main page flow.

## Known Caveats

- `AGENTS.md` contains a short generated Next.js note. Keep this `agent.md` in sync if agent guidance changes.
- `CLAUDE.md` only references `@AGENTS.md`.
- Some imports and unused variables may need cleanup when touching nearby files; always run `pnpm lint` after code changes.
- Next.js 16 can differ from older App Router behavior. When changing framework APIs, verify against installed docs or the local package version rather than assuming older Next.js behavior.

## Change Guidelines

- Keep domain changes inside the matching `features/<domain>` folder unless shared behavior is genuinely needed.
- Prefer adding service methods over calling Axios directly from components.
- Prefer adding feature application hooks over calling shared query/mutation hooks directly from presentation components.
- Prefer existing shared hooks and components over introducing new patterns.
- Do not bypass Clerk/TanStack Query/Zustand patterns without a clear reason.
- Preserve the API response contract from `shared/types/global.types.ts`.
- Run `pnpm lint` for validation; run `pnpm build` when changes affect routing, providers, Next config, auth, or shared types.
