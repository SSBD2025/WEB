import { useMutation } from "@tanstack/react-query";
import { changeUserPassword } from "@/api/user.api.ts";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler.ts";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/lib/queryClient";
import { CURRENT_USER_QUERY_KEY } from "./useCurrentUser";

export const useChangeMePassword = () => {
  const { t } = useTranslation();
  return useMutation({
    mutationFn: changeUserPassword,
    onError: (error) => {
      axiosErrorHandler(error, t("profile.toasts.password_change_error"));
    },
    onSuccess: () => {
      toast.success(t("profile.toasts.password_changed"));

      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
  });
};
