import { getCurrentFoodPyramidByClient } from "@/api/foodPyramid.api";
import { CurrentPyramidResponse } from "@/types/food_pyramid";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentPyramidClient = (enabled: boolean) => {
  return useQuery<CurrentPyramidResponse>({
    queryKey: ["currentPyramidClient"],
    queryFn: getCurrentFoodPyramidByClient,
    enabled,
  });
};
