import apiClient from "@/lib/apiClient";

export const getAllFoodPyramids = async () => {
    const response = await apiClient.get("/mod/food-pyramids")
    return response.data
}

export const getFoodPyramidById = async (id: string) => {
    const response = await apiClient.get(`/mod/food-pyramids/${id}`)
    return response.data
}
