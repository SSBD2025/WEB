import { getCurrentFoodPyramidByDietician } from "@/api/foodPyramid.api";
import { CurrentPyramidResponse } from "@/types/food_pyramid";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentPyramidByDietician = (
  clientId: string | undefined,
  enabled: boolean
) => {
  return useQuery<CurrentPyramidResponse>({
    queryKey: ["currentPyramidDietician", clientId],
    queryFn: () => getCurrentFoodPyramidByDietician(clientId!),
    enabled,
  });
};
