import { useMutation } from "@tanstack/react-query";
import { changeUserEmail } from "@/api/user.api";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler.ts";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/lib/queryClient";
import { CURRENT_USER_QUERY_KEY } from "./useCurrentUser";

export const useChangeMeEmail = () => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: changeUserEmail,
    onError: (error) => {
      axiosErrorHandler(error, t("profile.toasts.email_change_error"));
    },
    onSuccess: () => {
      toast.success(t("profile.toasts.email_changed"));

      queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
    },
  });
};
