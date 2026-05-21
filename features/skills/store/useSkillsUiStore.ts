import { create } from "zustand";
import { SkillsDialog } from "../constants";

type SkillsUiState = {
  openDialogName: SkillsDialog | null;
  setOpenDialogName: (dialog: SkillsDialog | null) => void;
};

export const useSkillsUiStore = create<SkillsUiState>()((set) => ({
  openDialogName: null,
  setOpenDialogName: (openDialogName) => set({ openDialogName }),
}));
