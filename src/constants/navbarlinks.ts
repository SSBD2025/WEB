import { AccessLevel } from "@/types/user";
import { t } from "i18next";
import ROUTES from "@/constants/routes.ts";

export interface RoleLink {
  label: string;
  path: string;
}

export const ROLE_LINKS: Record<Exclude<AccessLevel, null>, RoleLink[]> = {

  admin: [{ label: "Dashboard", path: ROUTES.ADMIN_DASHBOARD }],
  dietician: [
    { label: t("navbar.diet_profiles"), path: ROUTES.FOOD_PYRAMIDS },
    { label: "Dashboard", path: ROUTES.DIETICIAN_DASHBOARD },
    { label: t("navbar.blood_test_order"), path: ROUTES.DIETICIAN_MEDICAL_EXAMINATIONS_LIST }
  ],
  client: [
    {label: t("navbar.diet_profiles"), path: ROUTES.CLIENT_ALL_PYRAMIDS},
    {label: t("navbar.periodic_survey_list"), path: ROUTES.CLIENT_PERIODIC_SURVEY_LIST},
    {label: t("navbar.blood_test_reports"), path: ROUTES.CLIENT_BLOOD_REPORT},
    {label: t("navbar.charts"), path: ROUTES.CLIENT_MEDICAL_CHARTS},
    {label: t("navbar.permanent_survey"), path: ROUTES.CLIENT_PERMANENT_SURVEY}, //TODO przeniesc
  ],
};
