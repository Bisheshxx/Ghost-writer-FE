import { create } from "zustand";
import { IProject } from "../types/project.d";
import { ProjectDialog } from "../constants";

type ProjectUiState = {
  openDialogName: ProjectDialog | null;
  selectedProject: IProject | null;
  setOpenDialogName: (dialog: ProjectDialog | null) => void;
  setSelectedProject: (project: IProject | null) => void;
};

export const useProjectUiStore = create<ProjectUiState>()((set) => ({
  openDialogName: null,
  selectedProject: null,
  setOpenDialogName: (openDialogName) => set({ openDialogName }),
  setSelectedProject: (selectedProject) => set({ selectedProject }),
}));
