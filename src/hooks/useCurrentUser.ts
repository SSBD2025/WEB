import { getCurrentUser } from "@/api/user.api";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const token = localStorage.getItem("token");

  return useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!token,
  });
};
