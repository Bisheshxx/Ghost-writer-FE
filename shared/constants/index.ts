export const DIALOG_ENUMS = {
  CREATE_EXPERIENCE: "create-experience",
  EDIT_EXPERIENCE: "edit-experience",
  DELETE_EXPERIENCE: "delete-experience",
  CREATE_QUALIFICATION: "create-qualification",
  EDIT_QUALIFICATION: "edit-qualification",
  DELETE_QUALIFICATION: "delete-qualification",
} as const;

export type DialogEnumType = (typeof DIALOG_ENUMS)[keyof typeof DIALOG_ENUMS];
