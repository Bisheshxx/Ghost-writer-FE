export const DIALOG_ENUMS = {
  CREATE_EXPERIENCE: "create-experience",
  EDIT_EXPERIENCE: "edit-experience",
  DELETE_EXPERIENCE: "delete-experience",
  CREATE_QUALIFICATION: "create-qualification",
  EDIT_QUALIFICATION: "edit-qualification",
  DELETE_QUALIFICATION: "delete-qualification",
  CREATE_PROJECT: "create-project",
  EDIT_PROJECT: "edit-project",
  DELETE_PROJECT: "delete-project",
  CREATE_TECHNICAL_SKILL: "create-technical-skill",
  EDIT_TECHNICAL_SKILL: "edit-technical-skill",
  DELETE_TECHNICAL_SKILL: "delete-technical-skill",
  CREATE_PERSONAL_SKILL: "create-personal-skill",
  EDIT_PERSONAL_SKILL: "edit-personal-skill",
  DELETE_PERSONAL_SKILL: "delete-personal-skill",
  CREATE_AWARD: "create-award",
  EDIT_AWARD: "edit-award",
  DELETE_AWARD: "delete-award",
} as const;

export type DialogEnumType = (typeof DIALOG_ENUMS)[keyof typeof DIALOG_ENUMS];
