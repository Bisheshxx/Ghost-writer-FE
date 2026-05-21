export const EXPERIENCE_DIALOGS = {
  CREATE: "experience:create",
  EDIT: "experience:edit",
  DELETE: "experience:delete",
} as const;

export type ExperienceDialog =
  (typeof EXPERIENCE_DIALOGS)[keyof typeof EXPERIENCE_DIALOGS];
