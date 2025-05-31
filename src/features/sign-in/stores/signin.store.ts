import { create } from "zustand";

interface SigninStoreState {
  isChecked: boolean | null;
  setIsChecked: (isChecked: boolean | null) => void;
}

export const signinStore = create<SigninStoreState>((set) => ({
  isChecked: null,
  setIsChecked: (isChecked) => set({ isChecked }),
}));
