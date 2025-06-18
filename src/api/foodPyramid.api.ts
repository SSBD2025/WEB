import apiClient from "@/lib/apiClient";
import {FoodPyramid} from "@/types/food_pyramid";

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

export const getCurrentFoodPyramidByAlgorithm = async (clientId: string) => {
  const response = await apiClient.get(
      `/mod/algorithm/${clientId}`
  );
  return response.data;
};

export const submitNewFoodPyramid = async (clientId: string, payload: FoodPyramid) => {
  const response = await apiClient.post(
      `mod/client-food-pyramids/new/${clientId}`, payload
  );

  return response.data;
}