import authClient from "@/lib/authClient"
import { RegisterUserRequest } from "@/types/register_user"

export const registerUser = async (
    userType: "client" | "dietician",
    body: RegisterUserRequest
) => {
    const endpoint = `/${userType}/register`
    const res = await authClient.post(endpoint, body)
    return res.data
}