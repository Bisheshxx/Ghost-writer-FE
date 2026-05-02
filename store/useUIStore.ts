import { create } from "zustand";
import { DialogEnumType } from "@/shared/constants/index";
import { IExperience } from "@/features/experience/types/experience-types";
import { IQualification } from "@/features/qualification/types/qualification.d";

export type DialogEnum = DialogEnumType | null;

interface IUiState {
  openDialogName: DialogEnum;
  selectedExperience: IExperience | null;
  selectedQualification: IQualification | null;
  setOpenDialogName: (dialog: DialogEnum) => void;
  setSelectedExperience: (experience: IExperience | null) => void;
  setSelectedQualification: (qualification: IQualification | null) => void;
}

const useUiState = create<IUiState>()((set) => ({
  openDialogName: null,
  selectedExperience: null,
  selectedQualification: null,
  setOpenDialogName: (name) => set(() => ({ openDialogName: name })),
  setSelectedExperience: (experience) =>
    set(() => ({ selectedExperience: experience })),
  setSelectedQualification: (qualification) =>
    set(() => ({ selectedQualification: qualification })),
}));

export default useUiState;
