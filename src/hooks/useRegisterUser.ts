import { registerUser } from "@/api/auth.api";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {RegisterUserRequest} from "@/types/register_user";

export const useRegisterUser = (userType: "client" | "dietician") => {
    return useMutation({
        mutationFn: (payload: RegisterUserRequest) => registerUser(userType, payload),
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
