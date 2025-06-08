import { AccessLevel } from "@/types/user";
import ROUTES from "@/constants/routes.ts";

export interface RoleLink {
  label: string;
  path: string;
}

export const ROLE_LINKS: Record<Exclude<AccessLevel, null>, RoleLink[]> = {
  admin: [{ label: "Dashboard", path: "/admin/dashboard" }],
  dietician: [],
  client: [{label: "Pyramids", path: ROUTES.CLIENT_ALL_PYRAMIDS}],
};
