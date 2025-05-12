import {LoginRequest} from "@/types/login";
import apiClient from "@/lib/apiClient.ts";

export const loginUser = async (body: LoginRequest) => {
    const response = await apiClient.post('/account/login', body);
    return response.data;
}