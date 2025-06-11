import { getFoodPyramidById } from "@/api/foodPyramid.api";
import { FoodPyramidResponse } from "@/types/food_pyramid";
import { useQuery } from "@tanstack/react-query";

export const useGetFoodPyramid = (id: string) => {
  const query = useQuery<FoodPyramidResponse>({
    queryKey: ["foodPyramid", id],
    queryFn: () => getFoodPyramidById(id),
    enabled: !!id,
  });

  return {
    ...query,
    error: query.error
      ? {
          title: "Failed to fetch food pyramid",
          details: (query.error as Error).message,
        }
      : undefined,
  };
};
