export const SKILLS_DIALOGS = {
  CREATE: "skills:create",
  EDIT_TECHNICAL: "skills:edit-technical",
  EDIT_PERSONAL: "skills:edit-personal",
  EDIT_AWARD: "skills:edit-award",
} as const;

export type SkillsDialog = (typeof SKILLS_DIALOGS)[keyof typeof SKILLS_DIALOGS];
