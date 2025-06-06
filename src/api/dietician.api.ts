import apiClient from "@/lib/apiClient";

export const getAvailableDieticians = async (searchPhrase?: string) => {
  const params = searchPhrase ? { searchPhrase } : {};
  const response = await apiClient.get(
    "/mod/clients/get-available-dieticians",
    { params },
  );
  return response.data;
};
