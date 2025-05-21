import authClient from "@/lib/authClient.ts";

export const refresh = async (): Promise<{ value: string }> => {
    const response = await authClient.post("/account/refresh");
    return response.data;
};