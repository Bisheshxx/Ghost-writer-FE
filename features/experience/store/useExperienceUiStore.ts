import { create } from "zustand";
import { IExperience } from "../types/experience-types";
import { ExperienceDialog } from "../constants";

type ExperienceUiState = {
  openDialogName: ExperienceDialog | null;
  selectedExperience: IExperience | null;
  setOpenDialogName: (dialog: ExperienceDialog | null) => void;
  setSelectedExperience: (experience: IExperience | null) => void;
};

export const useExperienceUiStore = create<ExperienceUiState>()((set) => ({
  openDialogName: null,
  selectedExperience: null,
  setOpenDialogName: (openDialogName) => set({ openDialogName }),
  setSelectedExperience: (selectedExperience) => set({ selectedExperience }),
}));
