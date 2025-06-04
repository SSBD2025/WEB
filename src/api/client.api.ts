import apiClient from "@/lib/apiClient";

export const getClientsByDietician = async (searchPhrase?: string) => {
  const params = searchPhrase ? { searchPhrase } : {};
  const response = await apiClient.get("/mod/clients/dietician", { params });
  return response.data;
};
