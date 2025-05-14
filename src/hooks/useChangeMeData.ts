import {useMutation} from "@tanstack/react-query";
import {changeUserData} from "@/api/user.api.ts";
import {axiosErrorHandler} from "@/lib/axiosErrorHandler.ts";
import {toast} from "sonner";

export const useChangeMeData = () => {
    return useMutation({
        mutationFn: changeUserData,
        onError: (error) => {
            axiosErrorHandler(error, "Failed to update user data");
        },
        onSuccess: () => {
            toast.success("User data updated successfully");
        },
    });
}