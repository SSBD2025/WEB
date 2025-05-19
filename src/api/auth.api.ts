import authClient from "@/lib/authClient";
import { RegisterUserRequest } from "@/types/register_user";

export const registerUser = async (
    userType: "client" | "dietician" | "admin",
    body: RegisterUserRequest
) => {
    const endpoint = `/${userType}/register`;
    const config = userType === "admin"
        ? {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
        : {};
    const res = await authClient.post(endpoint, body, config);
    return res.data;
};
