import {useMutation} from "@tanstack/react-query";
import {loginUser} from "@/api/auth/login.api.ts";
import {axiosErrorHandler} from "@/lib/axiosErrorHandler.ts";
import {toast} from "sonner";

export const useLogin = () => {
    return useMutation({
        mutationFn: loginUser,
        onError: (error) => axiosErrorHandler(error, "Failed to login"),
        onSuccess: (data) => {
            localStorage.setItem("token", data.accessToken);
            toast.success("User login successfully");
        }
    })
}