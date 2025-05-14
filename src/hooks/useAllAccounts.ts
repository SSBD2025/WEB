import { getAllAccounts } from "@/api/account.api";
import { AccountWithRoles } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useAllAccounts = () => {
  const query = useQuery<AccountWithRoles[]>({
    queryKey: ["allAccounts"],
    queryFn: getAllAccounts,
  });

  return {
    ...query,
    error: query.error
      ? {
          title: "Failed to fetch accounts",
          details: (query.error as Error).message,
        }
      : undefined,
  };
};
