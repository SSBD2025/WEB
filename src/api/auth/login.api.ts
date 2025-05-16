import { LoginRequest, TwoFactorLoginRequest } from "@/types/login";
import apiClient from "@/lib/apiClient.ts";

export const loginUser = async (body: LoginRequest) => {
    const response = await apiClient.post('/account/login', body);
    return response.data;
};

export const twoFactorLogin = async (body: TwoFactorLoginRequest) => {
    const response = await apiClient.post(
        '/account/login/2fa',
        { code: body.code },
        {
            headers: {
                Authorization: `Bearer ${body.access2FAToken}`,
            },
        }
    );
    return response.data;
};
