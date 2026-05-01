import { create } from "zustand";
import { DialogEnumType } from "@/shared/constants/index";
import { IExperience } from "@/features/experience/types/experience-types";

export type DialogEnum = DialogEnumType | null;

interface IUiState {
  openDialogName: DialogEnum;
  selectedExperience: IExperience | null;
  setOpenDialogName: (dialog: DialogEnum) => void;
  setSelectedExperience: (experience: IExperience | null) => void;
}

const useUiState = create<IUiState>()((set) => ({
  openDialogName: null,
  selectedExperience: null,
  setOpenDialogName: (name) => set(() => ({ openDialogName: name })),
  setSelectedExperience: (experience) =>
    set(() => ({ selectedExperience: experience })),
}));

export default useUiState;
