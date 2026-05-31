<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Codebase rules:

##Do's:

- use shadcn components from `components/ui/` for every component where an appropriate primitive exists; if the needed shadcn component is not already installed in the project, install it and implement with it instead of hand-rolling common UI controls like buttons, dialogs, inputs, selects, tables, tabs, cards, sheets, or tooltips, unless shadcn is unavailable or clearly insufficient
- use zod for validation and react-hook-form for any type of form
- follow the existing project structure: keep route files in `app/`, feature-specific code in `features/<domain>/` with subfolders like `component/`, `form/`, `schema/`, `service/`, `store/`, and `types/`, shared reusable UI in `components/`, and shared helpers in `lib/`
- when adding new feature work, prefer creating or extending the matching `features/<domain>/` package instead of placing feature UI directly under `components/`
- if there is a possible use case for adding `skills`, `hooks`, docs files, or additional `AGENTS.md` files, ask the user first and explain the pros and cons before creating them

<!-- END:nextjs-agent-rules -->
