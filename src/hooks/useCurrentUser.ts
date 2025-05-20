import { getCurrentUser } from "@/api/user.api";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const token = localStorage.getItem("token");

  const query = useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!token, 
    retry: false,
  });

  return {
    ...query,
    error: query.error
      ? {
          title: "Failed to fetch user",
          details: (query.error as Error).message,
        }
      : undefined,
  };
};
