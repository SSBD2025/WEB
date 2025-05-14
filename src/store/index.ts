import { AccessLevel } from "@/components/shared/ThemeWrapper";
import { create } from "zustand";

type Store = {
  currentRole: AccessLevel | null;
  setCurrentRole: (role: AccessLevel) => void;
};

const useRole = create<Store>()((set) => ({
  currentRole: null,
  setCurrentRole: (role) => set({ currentRole: role }),
}));

export default useRole;
