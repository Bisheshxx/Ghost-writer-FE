import { create } from "zustand";
import { DialogEnumType } from "@/shared/constants/index";
import { IExperience } from "@/features/experience/types/experience-types";
import { IQualification } from "@/features/qualification/types/qualification.d";
import { IProject } from "@/features/project/types/project.d";
import {
  ISkill,
  TechnicalSkill,
  Award,
} from "@/features/skills/types/skills.d";

export type DialogEnum = DialogEnumType | null;

interface IUiState {
  openDialogName: DialogEnum;
  selectedExperience: IExperience | null;
  selectedQualification: IQualification | null;
  selectedProject: IProject | null;
  selectedSkill: ISkill | null;
  selectedTechnicalSkill: TechnicalSkill | null;
  selectedPersonalSkill: string | null;
  selectedAward: Award | null;
  setOpenDialogName: (dialog: DialogEnum) => void;
  setSelectedExperience: (experience: IExperience | null) => void;
  setSelectedQualification: (qualification: IQualification | null) => void;
  setSelectedProject: (project: IProject | null) => void;
  setSelectedSkill: (skill: ISkill | null) => void;
  setSelectedTechnicalSkill: (tech: TechnicalSkill | null) => void;
  setSelectedPersonalSkill: (skill: string | null) => void;
  setSelectedAward: (award: Award | null) => void;
}

const useUiState = create<IUiState>()((set) => ({
  openDialogName: null,
  selectedExperience: null,
  selectedQualification: null,
  selectedProject: null,
  selectedSkill: null,
  selectedTechnicalSkill: null,
  selectedPersonalSkill: null,
  selectedAward: null,
  setOpenDialogName: (name) => set(() => ({ openDialogName: name })),
  setSelectedExperience: (experience) =>
    set(() => ({ selectedExperience: experience })),
  setSelectedQualification: (qualification) =>
    set(() => ({ selectedQualification: qualification })),
  setSelectedProject: (project) => set(() => ({ selectedProject: project })),
  setSelectedSkill: (skill) => set(() => ({ selectedSkill: skill })),
  setSelectedTechnicalSkill: (tech) =>
    set(() => ({ selectedTechnicalSkill: tech })),
  setSelectedPersonalSkill: (skill) =>
    set(() => ({ selectedPersonalSkill: skill })),
  setSelectedAward: (award) => set(() => ({ selectedAward: award })),
}));

export default useUiState;
