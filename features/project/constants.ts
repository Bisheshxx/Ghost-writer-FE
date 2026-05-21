export const PROJECT_DIALOGS = {
  CREATE: "project:create",
  EDIT: "project:edit",
  DELETE: "project:delete",
} as const;

export type ProjectDialog = (typeof PROJECT_DIALOGS)[keyof typeof PROJECT_DIALOGS];
