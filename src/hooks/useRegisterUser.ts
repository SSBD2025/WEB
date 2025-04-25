import { registerUser } from "@/api/auth.api";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: registerUser,
        onError: (error) => axiosErrorHandler(error, "Failed to register user"),
        onSuccess: () => {
            toast.success("User registered successfully");
        }
    })
}