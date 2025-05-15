import { AccessLevel } from "@/components/shared/ThemeWrapper";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  currentRole: AccessLevel | null;
  setCurrentRole: (role: AccessLevel) => void;
};

const useRole = create<Store>()(
  persist(
    (set) => ({
      currentRole: null,
      setCurrentRole: (role) => set({ currentRole: role }),
    }),
    {
      name: "user-role", // klucz w localStorage
    }
  )
);

export default useRole;
