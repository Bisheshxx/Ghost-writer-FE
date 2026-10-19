import { create } from "zustand";

import type { JobTrackerDialog } from "../constants";
import type { JobRow } from "../types/job-tracker";

type JobTrackerUiState = {
  openDialogName: JobTrackerDialog | null;
  selectedJob: JobRow | null;
  setOpenDialogName: (dialog: JobTrackerDialog | null) => void;
  setSelectedJob: (job: JobRow | null) => void;
};

export const useJobTrackerUiStore = create<JobTrackerUiState>()((set) => ({
  openDialogName: null,
  selectedJob: null,
  setOpenDialogName: (openDialogName) => set({ openDialogName }),
  setSelectedJob: (selectedJob) => set({ selectedJob }),
}));
