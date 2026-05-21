import { create } from "zustand";

interface IStore {
  jobDescription: string;
  setJobDescription: (jobDescription: string) => void;
  coverLetter: string | null;
  setCoverLetter: (coverLetter: string) => void;
  isCoverLetterLoading: boolean;
  setIsCoverLetterLoading: (isCoverLetterLoading: boolean) => void;
  isCoverLetterError: boolean;
  setIsCoverLetterError: (isCoverLetterError: boolean) => void;
}

const useJobStore = create<IStore>()((set) => ({
  jobDescription: "",
  setJobDescription: (jobDescription) => set(() => ({ jobDescription })),
  coverLetter: null,
  setCoverLetter: (coverLetter) => set(() => ({ coverLetter })),
  isCoverLetterLoading: false,
  setIsCoverLetterLoading: (isCoverLetterLoading) =>
    set(() => ({ isCoverLetterLoading })),
  isCoverLetterError: false,
  setIsCoverLetterError: (isCoverLetterError) =>
    set(() => ({ isCoverLetterError })),
}));

export default useJobStore;
