import apiClient from "@/lib/apiClient";
import { AllAccounts } from "@/types/user";

export interface AccountsQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const getAllAccounts = async ({
  page,
  size,
  sortBy,
  sortOrder,
}: AccountsQueryParams) => {
  const sort = sortBy && sortOrder ? `${sortBy},${sortOrder}` : undefined;
  const res = await apiClient.get("/account", {
    params: {
      page,
      size,
      ...(sort ? { sort } : {}),
    },
  });
  return res.data as AllAccounts;
};
