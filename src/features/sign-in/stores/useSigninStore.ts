import { create } from "zustand";

interface SigninState {
  isChecked: boolean | null;
  setIsChecked: (isChecked: boolean | null) => void;
}

export const useSigninStore = create<SigninState>((set) => ({
  isChecked: null,
  setIsChecked: (isChecked) => set({ isChecked }),
}));
