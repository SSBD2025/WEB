import { useMutation } from "@tanstack/react-query";
import { changeUserEmail } from "@/api/user.api";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler.ts";
import { toast } from "sonner";


export const useChangeMeEmail = () => {
  return useMutation({
    mutationFn: changeUserEmail,
    onError: (error) => {
      axiosErrorHandler(error, "Failed to update user email");
    },
    onSuccess: () => {
      toast.success("User email updated successfully");
    },
  });
}