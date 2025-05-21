import { useMutation } from "@tanstack/react-query";
import { forceChangeUserPassword } from "@/api/user.api";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { queryClient } from "@/lib/queryClient";
import { CURRENT_USER_QUERY_KEY } from "./useCurrentUser";

export const useForceChangePassword = () => {
    const { t } = useTranslation();
    return useMutation({
        mutationFn: forceChangeUserPassword,
        onError: (error) => {
            axiosErrorHandler(error, t("profile.toasts.password_change_error"));
        },
        onSuccess: () => {
            toast.success(t("profile.toasts.password_changed"));

            queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
        },
    });
};