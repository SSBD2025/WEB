import apiClient from "@/lib/apiClient";
import { AllAccounts } from "@/types/user";

export interface AccountsQueryParams {
  page?: number;
  size?: number;
  sort?: string;
}

export const getAllAccounts = async (params: AccountsQueryParams) => {
  console.log(params);
  const res = await apiClient.get("/account", { params });
  return res.data as AllAccounts;
};