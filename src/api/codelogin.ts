import authClient from "@/lib/authClient";
import {Codelogin, CodeloginRequest} from "@/types/codelogin";

export const codeloginRequest = async (body: CodeloginRequest) => {
    const response = await authClient.post('/account/auth/email/request', body);
    return response.data;
}

export const codelogin = async (body: Codelogin) => {
    const response = await authClient.post('/account/auth/email', body);
    return response.data;
}