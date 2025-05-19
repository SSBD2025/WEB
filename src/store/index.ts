import { AccessLevel } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  currentRole: AccessLevel | null;
  setCurrentRole: (role: AccessLevel | null) => void;
};

const useRole = create<Store>()(
  persist(
    (set) => ({
      currentRole: null,
      setCurrentRole: (role) => set({ currentRole: role }),
    }),
    {
      name: "user-role",
    }
  )
);

export default useRole;
