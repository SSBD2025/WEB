import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/auth/login.api.ts";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler.ts";
import { toast } from "sonner";
import { useCurrentUser } from "./useCurrentUser";

export const useLogin = () => {
  const {refetch} = useCurrentUser();

  return useMutation({
    mutationFn: loginUser,
    onError: (error) => axiosErrorHandler(error, "Failed to login"),
    onSuccess: async (data) => {
      localStorage.setItem("token", data.accessToken);
      toast.success("User login successfully");

      refetch();
    },
  });
};
