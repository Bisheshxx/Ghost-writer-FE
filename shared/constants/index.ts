export const DIALOG_ENUMS = {
  CREATE_EXPERIENCE: "create-experience",
  EDIT_EXPERIENCE: "edit-experience",
  DELETE_EXPERIENCE: "delete-experience",
} as const;

export type DialogEnumType = (typeof DIALOG_ENUMS)[keyof typeof DIALOG_ENUMS];
