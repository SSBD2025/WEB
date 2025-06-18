import { useQuery } from "@tanstack/react-query"
import { getAllFoodPyramids } from "@/api/foodPyramid.api"
import type { FoodPyramid } from "@/types/food_pyramid"

export const GET_ALL_FOOD_PYRAMIDS = "food-pyramids"

export const useGetAllFoodPyramids = () => {
  return useQuery<FoodPyramid[]>({
    queryKey: [GET_ALL_FOOD_PYRAMIDS],
    queryFn: getAllFoodPyramids,
  })
}
