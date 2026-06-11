---
name: ghost-testing
description: Add or update tests in the Ghost frontend. Use when writing unit, component, integration, form, hook, service, API contract, or regression tests, or when setting up a test runner in this Next.js 16 React 19 TypeScript project.
---

# Ghost Testing

Use with `ghost-project-follow`.

## Current State

This repo currently has no test runner, no `test` script, and no existing test files. Do not assume Jest, Vitest, React Testing Library, MSW, or Playwright are already installed.

## Before Adding Tests

1. Inspect `package.json` and the target feature.
2. If no runner exists, propose the smallest useful setup before adding dependencies:
   - Unit/schema/service/hook tests: Vitest.
   - React component/form tests: Vitest plus React Testing Library and jsdom.
   - Browser flows: Playwright only when real routing/auth/browser behavior matters.
3. Keep test files next to the code they verify unless the repo later establishes a centralized test folder.
4. Prefer testing feature behavior at stable boundaries: schemas, service request construction, application hooks, form validation, and user-visible component behavior.

## What To Test

- Zod schemas: required fields, transforms/refinements, nullable/optional behavior, and edge cases.
- Services: method, URL, params, and request body match `openapi/swagger.json`; mock `@/lib/axios/request`.
- Application hooks: query keys, mutation variables, invalidation behavior, and success/error callback behavior.
- Forms/components: user-visible validation, submit payload shape, disabled/loading states, and server validation mapping.
- Job tracker: pagination/query-key separation, status updates, optimistic or scoped cache updates, and view-specific behavior.

## Test Style

- Test behavior, not implementation details.
- Use existing types and schemas rather than duplicating fixtures by hand.
- Keep fixtures small and local unless multiple tests genuinely reuse them.
- Avoid snapshots for ordinary UI; assert meaningful text, roles, payloads, and state.
- Mock Clerk, Axios/request, and router behavior at the boundary being tested.

## Validation

- After a test runner is added, add scripts to `package.json` such as `test`, and optionally `test:watch`.
- Run the narrow test command for changed tests.
- Run `pnpm lint`; run `pnpm build` when test setup changes TypeScript, Next config, providers, or shared types.

