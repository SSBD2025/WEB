import { getAllAccounts } from "@/api/account.api";
import { AccountWithRoles } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const ALL_ACCOUNTS_QUERY_KEY = ["allAccounts"];

export const useAllAccounts = () => {
  const query = useQuery<AccountWithRoles[]>({
    queryKey: ALL_ACCOUNTS_QUERY_KEY,
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
