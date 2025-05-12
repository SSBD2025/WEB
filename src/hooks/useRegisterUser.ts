import { registerUser } from "@/api/auth.api";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            toast.success(
                "User registered successfully. Please check your email to verify your account."
            );
        },
        onError: (error: unknown) => {
            return axiosErrorHandler(
                error,
                "An error occurred while registering the user."
            );
        },
    });
};