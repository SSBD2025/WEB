import { registerUser } from "@/api/auth.api";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { RegisterUserRequest } from "@/types/register_user";
import { useTranslation } from "react-i18next";
import axios from "axios";

export const useRegisterUser = (userType: "client" | "dietician" | "admin") => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: (payload: RegisterUserRequest) =>
      registerUser(userType, payload),
    onSuccess: () => {
      toast.success(t("register.success"));
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 409) {
          if (data.message === "account_constraint_violation: email already in use") {
            toast.error(t("register.error.emailExist"));
          } else if (
              data.message === "account_constraint_violation: login already in use"
          ) {
            toast.error(t("register.error.loginExist"));
          } else {
            axiosErrorHandler(error);
          }
        } else if (status === 403) {
          toast.error(t("register.error.accessDenied"));
        } else if (status === 401) {
          toast.error(t("register.error.unauthorized"));
        } else if (status === 400) {
          const violations = data?.violations;
          if (Array.isArray(violations)) {
            const passwordViolation = violations.find(
              (v) => v.fieldName === "account.password"
            );
            if (passwordViolation) {
              toast.error(t("register.error.passwordRegex"));
              return;
            }
            const firstNameViolation = violations.find(
              (v) => v.fieldName === "account.firstName"
            );
            if (firstNameViolation) {
              toast.error(t("register.error.firstNameRegex"));
              return;
            }
            const lastNameViolation = violations.find(
              (v) => v.fieldName === "account.lastName"
            );
            if (lastNameViolation) {
              toast.error(t("register.error.lastNameRegex"));
              return;
            }
            const loginViolation = violations.find(
              (v) => v.fieldName === "account.login"
            );
            if (loginViolation) {
              toast.error(t("register.error.loginRegex"));
              return;
            }
          }
          toast.error("Nie powinno Cię tu być");
        } else {
          axiosErrorHandler(error, t("register.error.generic"));
        }
      } else {
        toast.error(t("register.error.unknown"));
      }
    },
  });
};
