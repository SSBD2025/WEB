import apiClient from "@/lib/apiClient";

export const getCurrentUser = async () => {
  const res = await apiClient.get("/account/me");
  return res.data;
};
