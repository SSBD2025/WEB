import authClient from "@/lib/authClient"
import { RegisterUserRequest } from "@/types/auth"

export const registerUser = async (body: RegisterUserRequest) => {
    const res = await authClient.post("/register", body)
    return res.data
}