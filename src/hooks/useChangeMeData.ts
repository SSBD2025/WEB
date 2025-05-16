import {useMutation} from "@tanstack/react-query";
import {changeUserData, disable2FA, enable2FA} from "@/api/user.api.ts";
import {axiosErrorHandler} from "@/lib/axiosErrorHandler.ts";
import {toast} from "sonner";
import { useTranslation } from "react-i18next"
import { useCurrentUser } from "./useCurrentUser";

export const useChangeMeData = () => {
    const { t } = useTranslation()
    return useMutation({
        mutationFn: changeUserData,
        onError: (error) => {
            axiosErrorHandler(error, t("profile.toasts.2fa_error"));
        },
        onSuccess: () => {
            toast.success(t("profile.toasts.data_updated"));
        },
    });
}

export const useEnable2FA = () => { 
const { t } = useTranslation()
const {refetch} = useCurrentUser();

    return useMutation({
        mutationFn: enable2FA,
        onError: (error) => {
            axiosErrorHandler(error, t("profile.toasts.data_change_error"));
        },
        onSuccess: () => {
            toast.success(t("profile.toasts.2fa_enabled"));
            refetch();
        },
    });
}
export const useDisable2FA = () => {
    const { t } = useTranslation()
    const {refetch} = useCurrentUser();
    return useMutation({
        mutationFn: disable2FA,
        onError: (error) => {
            axiosErrorHandler(error, t("profile.toasts.2fa_error"));
        },
        onSuccess: () => {
            toast.success(t("profile.toasts.2fa_disabled"));
            refetch();
        },
    });
}