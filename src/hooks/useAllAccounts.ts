import { AccountsQueryParams, getAllAccounts } from "@/api/account.api";
import { AllAccounts } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const ALL_ACCOUNTS_QUERY_KEY = "allAccounts";

export const useAllAccounts = (params: AccountsQueryParams) => {
    const query = useQuery<AllAccounts>({
        queryKey: [ALL_ACCOUNTS_QUERY_KEY, params],
        queryFn: () => getAllAccounts(params),
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
