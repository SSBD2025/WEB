import { useQuery } from "@tanstack/react-query"
import { getAllFoodPyramids } from "@/api/foodPyramid.api"
import type { FoodPyramid } from "@/types/food_pyramid"

export const useGetAllFoodPyramids = () => {
  return useQuery<FoodPyramid[]>({
    queryKey: ["food-pyramids"],
    queryFn: getAllFoodPyramids,
  })
}
