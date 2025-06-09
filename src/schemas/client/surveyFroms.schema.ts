import { z } from "zod";
import i18n from "@/i18n";

export const periodicSurveySchema = z.object({
    weight : z.number({required_error: i18n.t("periodic_survey.form.violations.required")})
        .min(20, i18n.t("periodic_survey.form.violations.weight_min"))
        .max(350, i18n.t("periodic_survey.form.violations.weight_max")),
    bloodPressure: z.string()
        .regex(/^\d{2,3}\/\d{2,3}$/, i18n.t("periodic_survey.form.violations.blood_pressure_pattern")),
    bloodSugarLevel: z.number({required_error: i18n.t("periodic_survey.form.violations.required")})
        .min(10, i18n.t("periodic_survey.form.violations.blood_sugar_min"))
        .max(500, i18n.t("periodic_survey.form.violations.blood_sugar_max")),
});