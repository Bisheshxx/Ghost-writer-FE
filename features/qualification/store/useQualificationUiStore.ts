import { create } from "zustand";
import { IQualification } from "../types/qualification.d";
import { QualificationDialog } from "../constants";

type QualificationUiState = {
  openDialogName: QualificationDialog | null;
  selectedQualification: IQualification | null;
  setOpenDialogName: (dialog: QualificationDialog | null) => void;
  setSelectedQualification: (qualification: IQualification | null) => void;
};

export const useQualificationUiStore = create<QualificationUiState>()(
  (set) => ({
    openDialogName: null,
    selectedQualification: null,
    setOpenDialogName: (openDialogName) => set({ openDialogName }),
    setSelectedQualification: (selectedQualification) =>
      set({ selectedQualification }),
  }),
);
