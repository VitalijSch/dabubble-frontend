import { User } from "@/interfaces/user.interface";
import { create } from "zustand";

interface UserStoreState {
  user: User | null;
  setUser: (user: User) => void;
  resetUser: () => void;
}

export const userStore = create<UserStoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
}));
