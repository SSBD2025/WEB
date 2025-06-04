import apiClient from "@/lib/apiClient";

export const getClientsByDietician = async () => {
    const response = await apiClient.get("/mod/clients/dietician");
    return response.data;
};