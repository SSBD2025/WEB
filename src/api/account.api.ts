import apiClient from "@/lib/apiClient";
import { AllAccounts } from "@/types/user";

export interface AccountsQueryParams {
  searchPhrase?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getAllAccounts = async ({
       searchPhrase,
       page,
       size,
       sortBy,
       sortOrder,
     }: AccountsQueryParams) => {
  const sort = sortBy && sortOrder ? `${sortBy},${sortOrder}` : undefined;
  const res = await apiClient.get("/account", {
    params: {
      ...(searchPhrase ? { searchPhrase } : {}),
      ...(typeof page === "number" ? { page } : {}),
      ...(typeof size === "number" ? { size } : {}),
      ...(sort ? { sort } : {}),
    },
  });
  return res.data as AllAccounts;
};

