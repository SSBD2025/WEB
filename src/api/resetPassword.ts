import apiClient from "@/lib/apiClient.ts";
import {PasswordReset, PasswordResetRequest} from "@/types/reset_password";

export const resetPasswordRequest = async (body: PasswordResetRequest) => {
    const response = await apiClient.post('/account/reset/password/request', body);
    return response.data;
}

export const resetPassword = async (body: PasswordReset, token: string) => {
    const response = await apiClient.post('/account/reset/password/' + token, body);
    return response.data;
}