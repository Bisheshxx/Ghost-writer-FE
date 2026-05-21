export const QUALIFICATION_DIALOGS = {
  CREATE: "qualification:create",
  EDIT: "qualification:edit",
  DELETE: "qualification:delete",
} as const;

export type QualificationDialog =
  (typeof QUALIFICATION_DIALOGS)[keyof typeof QUALIFICATION_DIALOGS];
