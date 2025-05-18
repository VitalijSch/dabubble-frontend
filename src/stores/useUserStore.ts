import { User } from "@/interfaces/user";
import { create } from "zustand";

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
}));
