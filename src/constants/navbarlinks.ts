import { AccessLevel } from "@/types/user";
import { t } from "i18next";
import ROUTES from "@/constants/routes.ts";

export interface RoleLink {
  label: string;
  path: string;
}

export const ROLE_LINKS: Record<Exclude<AccessLevel, null>, RoleLink[]> = {
  admin: [{ label: "Dashboard", path: "/admin/dashboard" }],
  dietician: [
    { label: t("navbar.diet_profiles"), path: "/food-pyramids" },
  ],
  client: [{label: "Pyramids", path: ROUTES.CLIENT_ALL_PYRAMIDS}],
};
