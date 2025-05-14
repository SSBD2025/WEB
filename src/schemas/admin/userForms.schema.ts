import { z } from "zod"
import i18n from "@/i18n"

export const personalDataSchema = z.object({
  firstName: z
    .string()
    .min(2, i18n.t("admin.user_account.forms.first_name_min"))
    .max(30, i18n.t("admin.user_account.forms.first_name_max"))
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, i18n.t("admin.validation.name_format"))
    .trim(),
  lastName: z
    .string()
    .min(2, i18n.t("admin.user_account.forms.last_name_min"))
    .max(30, i18n.t("admin.user_account.forms.last_name_max"))
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, i18n.t("admin.validation.name_format"))
    .trim(),
})

export const emailSchema = z.object({
  email: z
    .string()
    .email(i18n.t("admin.user_account.forms.email_invalid"))
    .max(50, i18n.t("admin.validation.email_too_long"))
    .trim()
    .toLowerCase(),
})

export type PersonalDataFormValues = z.infer<typeof personalDataSchema>
export type EmailFormValues = z.infer<typeof emailSchema>
