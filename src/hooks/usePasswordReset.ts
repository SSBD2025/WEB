import {useMutation} from "@tanstack/react-query";
import {axiosErrorHandler} from "@/lib/axiosErrorHandler.ts";
import {resetPassword, resetPasswordRequest} from "@/api/resetPassword.ts";
import {PasswordReset} from "@/types/reset_password";

export const usePasswordResetRequest = () => {
    return useMutation({
        mutationFn: resetPasswordRequest,
        onError: (error) => axiosErrorHandler(error, "Reset Request Failed"),
    })
}

export const usePasswordReset = () => {
    return useMutation({
        mutationFn: ({ body, token }: { body: PasswordReset; token: string }) =>
            resetPassword(body, token),
        onError: (error) => axiosErrorHandler(error, "Reset Request Failed"),
    });
};