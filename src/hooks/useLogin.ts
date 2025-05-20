import { useCurrentUser } from "./useCurrentUser";
import { useMutation } from "@tanstack/react-query";
import { loginUser, twoFactorLogin } from "@/api/auth/login.api.ts";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler.ts";
import { toast } from "sonner";
import { t } from "i18next";

export const useLogin = () => {
  const { refetch } = useCurrentUser();

  return useMutation({
    mutationFn: loginUser,
    onError: (error) => axiosErrorHandler(error, t("login.failed_to_login")),
    onSuccess: (data) => {
      const payload = JSON.parse(atob(data.value.split(".")[1]));
      if (payload.typ !== "access2fa") {
        localStorage.setItem("token", data.value);
        toast.success(t("login.login_successful"));
      }
      refetch();
    },
  });
};

export const use2faLogin = () => {
  const { refetch } = useCurrentUser();
  return useMutation({
    mutationFn: twoFactorLogin,
    onError: (error) => axiosErrorHandler(error, t("login.failed_to_login")),
    onSuccess: (data) => {
      localStorage.setItem("token", data.value);
      toast.success(t("login.login_successful"));

      refetch();
    },
  });
};
