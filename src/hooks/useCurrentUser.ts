import { getCurrentUser } from "@/api/user.api";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const CURRENT_USER_QUERY_KEY = ["currentUser"];

export const useCurrentUser = () => {
  const token = localStorage.getItem("token");

  const query = useQuery<User>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: getCurrentUser,
    enabled: !!token, 
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
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
