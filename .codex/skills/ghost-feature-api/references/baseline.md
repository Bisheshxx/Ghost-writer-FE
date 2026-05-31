# Ghost Frontend Feature Baseline

Use this as the baseline for API-backed feature work in `ghost-frontend`.

## Source Files To Inspect First

- `openapi/swagger.json`: source of truth for backend paths, methods, params, and request bodies.
- `features/experience`: baseline CRUD feature.
- `features/job-tracker`: baseline for pagination, per-feature React Query hooks, and generated document actions.
- `shared/types/global.types.ts`: `ApiResponse<T>`, optional `meta`, and pagination metadata.
- `lib/axios/request.ts`: request wrapper and `204` behavior.
- `shared/hooks/useApiQuery.tsx` and `shared/hooks/useApiMutation.tsx`: shared query and mutation helpers.

## Experience Feature Pattern

`features/experience` is split as:

```text
features/experience/
  application/useExperienceActions.ts
  component/experience-component.tsx
  constants.ts
  form/experience.form.tsx
  index.tsx
  schema/experience.schema.ts
  service/experience-service.ts
  store/useExperienceUiStore.ts
  types/experience-types.ts
```

Use the same shape for new CRUD domains.

## Service Pattern

Use `request` from `@/lib/axios/request`.

```ts
export const ExampleService = {
  getItems: async () =>
    request<Item[]>({
      method: "GET",
      url: "v1/items",
    }),

  createItem: async (data: ExampleFormData) =>
    request<Item>({
      method: "POST",
      url: "v1/items",
      data,
    }),

  updateItem: async (id: string, data: ExampleFormData) =>
    request<Item>({
      method: "PATCH",
      url: `v1/items/${id}`,
      data,
    }),

  deleteItem: async (id: string) =>
    request<null>({
      method: "DELETE",
      url: `v1/items/${id}`,
    }),
};
```

Adjust request bodies to Swagger exactly. For experience create, Swagger requires:

```ts
data: {
  experiences: [experience],
}
```

## Application Hook Pattern

Use one stable root query key per feature. Keep invalidation here.

```ts
export const EXAMPLE_QUERY_KEY = "example";

export function useExamples() {
  return useApiQuery({
    queryKey: [EXAMPLE_QUERY_KEY],
    queryFn: () => ExampleService.getItems(),
  });
}

export function useCreateExample(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useApiMutation(ExampleService.createItem, {
    invalidateQueries: [EXAMPLE_QUERY_KEY],
    ...options,
  });
}
```

For richer flows such as paginated jobs, use direct `useQuery`, `useMutation`, and `useQueryClient` inside the feature application hook, as `features/job-tracker/application/useJobTrackerActions.ts` does.

## Form Pattern

- Define the Zod schema in `schema/`.
- Infer form data from the schema in `types/` when practical.
- Build forms with `useForm`, `zodResolver`, and shadcn fields.
- Keep server validation mapping inside the form or dialog owner.
- Use `CustomDialog` for existing modal CRUD patterns.

## UI State Pattern

Use a feature-local Zustand store only for cross-component UI state such as:

- current dialog name
- selected entity for edit/delete

Prefer local `useState` for one-component state.

## Route Pattern

Add an `app/<route>/page.tsx` only when the feature should have a route.

```tsx
import ExamplePage from "@/features/example";

export default function Page() {
  return <ExamplePage />;
}
```

Then add navigation to `components/app-shell.tsx` only if the page should appear in the authenticated sidebar.

## Validation Checklist

- `openapi/swagger.json` was checked for every endpoint used.
- No endpoint or request body was invented.
- Feature code lives under `features/<domain>/`.
- Components call application hooks, not services directly.
- Forms use Zod and React Hook Form.
- Mutations invalidate the feature query key.
- `pnpm lint` passes.
- `pnpm build` runs when the change affects routes, shared types, providers, auth, or API contracts.
