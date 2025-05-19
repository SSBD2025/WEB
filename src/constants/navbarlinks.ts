import { AccessLevel } from "@/types/user";

export interface RoleLink {
  label: string;
  path: string;
}

export const ROLE_LINKS: Record<Exclude<AccessLevel, null>, RoleLink[]> = {
  admin: [{ label: "Dashboard", path: "/admin/dashboard" }],
  dietician: [],
  client: [],
};
