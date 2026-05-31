# Ghost Writer Frontend

Ghost Writer is a Next.js frontend for tracking job applications, managing profile data, and generating resume and cover letter content from a backend API.

## Stack

- Next.js `16.2.4` with App Router
- React `19.2.4`
- TypeScript with strict mode
- pnpm
- Tailwind CSS v4
- shadcn/Radix UI components
- Clerk authentication
- TanStack Query for server state
- Zustand for feature UI state
- React Hook Form and Zod for forms
- Axios for backend requests
- Sonner for toast notifications

## Main Features

- Job tracker at `/`
  - Search and paginate jobs
  - Create jobs
  - Update job status
  - Delete jobs
  - Generate resume and cover letter text for one or more jobs
  - View generated document previews
- Profile management
  - `/experience`
  - `/qualification`
  - `/skills`
  - `/projects`
- Auth pages
  - `/sign-in`
  - `/sign-up`
  - `/sso-callback`

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create a local `.env` file with the required values:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend API

The frontend expects the backend origin in `NEXT_PUBLIC_API_URL`. The Axios client appends `/api`, so a service URL such as `v1/jobs` resolves to:

```text
${NEXT_PUBLIC_API_URL}/api/v1/jobs
```

The current Swagger snapshot is stored at:

```text
openapi/swagger.json
```

Refresh it from the backend with:

```bash
pnpm sync:api
```

By default this fetches:

```text
http://localhost:5001/api-docs.json
```

Override the source with:

```bash
SWAGGER_URL=http://localhost:5001/api-docs.json pnpm sync:api
```

Use `openapi/swagger.json` as the source of truth for backend endpoints.

## Scripts

```bash
pnpm dev       # Start the local Next.js dev server
pnpm build     # Build the production app
pnpm start     # Start the production app
pnpm lint      # Run ESLint
pnpm sync:api  # Refresh openapi/swagger.json from the backend
```

## Docker

The project includes a production `Dockerfile` that builds the Next.js standalone output.

```bash
docker build -t ghost-frontend .
docker run --env-file .env -p 3000:3000 ghost-frontend
```

## Project Structure

```text
app/                         App Router routes and root layout
components/                  Shared app shell and shadcn UI components
features/<domain>/           Feature-specific UI, forms, schemas, services, stores, and types
lib/axios/                   Axios client, Clerk token interceptor, and request helper
lib/toast/                   Toast helpers
openapi/swagger.json         Synced backend Swagger snapshot
scripts/sync-swagger.ts      Swagger sync script
shared/component/            Reusable app-level components
shared/hooks/                Shared TanStack Query helpers
shared/providers/            Shared React providers
shared/types/                Shared API response types
```

Feature folders generally follow this shape:

```text
features/<domain>/
  application/   Feature hooks and mutation/query orchestration
  component/     Feature UI
  form/          React Hook Form components
  schema/        Zod schemas
  service/       Backend API methods
  store/         Feature-local UI state
  types/         Feature TypeScript types
```

## Development Notes

- Prefer existing shadcn components from `components/ui` before creating new UI primitives.
- Keep route files in `app/`.
- Keep feature-specific code in `features/<domain>/`.
- Use Zod plus React Hook Form for forms.
- Use feature services for backend calls instead of calling Axios directly in components.
- Use the synced Swagger file before adding or changing frontend API calls.
- Run `pnpm lint` before pushing; run `pnpm build` when changes affect routes, shared types, providers, auth, or API contracts.
