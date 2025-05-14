import { useMutation } from "@tanstack/react-query";
import { changeUserPassword } from "@/api/user.api.ts";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler.ts";
import { toast } from "sonner";

export const useChangeMePassword = () => {
  return useMutation({
    mutationFn: changeUserPassword,
    onError: (error) => {
      axiosErrorHandler(error, "Failed to update user password");
    },
    onSuccess: () => {
      toast.success("User password updated successfully");
    },
  });
}