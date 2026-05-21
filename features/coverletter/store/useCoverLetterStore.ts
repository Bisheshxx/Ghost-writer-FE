import { create } from "zustand";

type CoverLetterState = {
  coverLetter: string | null;
  isCoverLetterLoading: boolean;
  isCoverLetterError: boolean;
  setCoverLetter: (coverLetter: string) => void;
  setIsCoverLetterLoading: (isCoverLetterLoading: boolean) => void;
  setIsCoverLetterError: (isCoverLetterError: boolean) => void;
};

export const useCoverLetterStore = create<CoverLetterState>()((set) => ({
  coverLetter: null,
  isCoverLetterLoading: false,
  isCoverLetterError: false,
  setCoverLetter: (coverLetter) => set({ coverLetter }),
  setIsCoverLetterLoading: (isCoverLetterLoading) =>
    set({ isCoverLetterLoading }),
  setIsCoverLetterError: (isCoverLetterError) => set({ isCoverLetterError }),
}));
