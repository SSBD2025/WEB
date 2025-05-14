import apiClient from "@/lib/apiClient";

export const getAllAccounts = async () => {
  const res = await apiClient.get("/account");
  return res.data;
};