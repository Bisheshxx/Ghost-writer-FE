import { create } from "zustand";

interface IStore {
  jobDescription: string | null;
  setJobDescription: (jobDescription: string) => void;
}

const useJobStore = create<IStore>()((set) => ({
  jobDescription: null,
  setJobDescription: (jobDescription) => set(() => ({ jobDescription })),
}));

export default useJobStore;
