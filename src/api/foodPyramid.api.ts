import apiClient from "@/lib/apiClient";

export const getAllFoodPyramids = async () => {
  const response = await apiClient.get("/mod/food-pyramids");
  return response.data;
};

export const getFoodPyramidById = async (id: string) => {
  const response = await apiClient.get(`/mod/food-pyramids/${id}`);
  return response.data;
};

export const getCurrentFoodPyramidByClient = async () => {
  const response = await apiClient.get("/mod/client-food-pyramids/current");
  return response.data;
};

export const getCurrentFoodPyramidByDietician = async (clientId: string) => {
  const response = await apiClient.get(
    `/mod/client-food-pyramids/client/${clientId}/current`
  );
  return response.data;
};
