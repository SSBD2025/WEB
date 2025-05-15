import { z } from "zod";
import i18n from "@/i18n"

export const loginSchema = z.object({
    login: z
        .string()
        .min(4, { message: i18n.t("login.error.login_too_short") })
        .max(50, { message: i18n.t("login.error.login_too_long") }),
    password: z
        .string()
        .min(8, { message: i18n.t("login.error.password_too_short") })
        .max(60, { message: i18n.t("login.error.password_too_long") }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
