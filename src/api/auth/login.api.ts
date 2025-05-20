import { LoginRequest, TwoFactorLoginRequest } from "@/types/login";
import authClient from "@/lib/authClient";

export const loginUser = async (body: LoginRequest) => {
    const response = await authClient.post('/account/login', body);
    return response.data;
};

export const twoFactorLogin = async (body: TwoFactorLoginRequest) => {
    const response = await authClient.post(
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
