import {useQuery} from "@tanstack/react-query";
import {FoodPyramid} from "@/types/food_pyramid";
import {getCurrentFoodPyramidByAlgorithm} from "@/api/foodPyramid.api.ts";

export const GET_DIET_PROFILE_BY_ALGORITHM = "get_profile_by_algorithm";

export const useGenerateDietProfileByAlgorithm = (clientId: string) => {
    const query = useQuery<FoodPyramid>({
        queryKey: [GET_DIET_PROFILE_BY_ALGORITHM, clientId],
        queryFn: () => getCurrentFoodPyramidByAlgorithm(clientId),
        enabled: !!clientId,
    })

    return {
        ...query,
        error: query.error
    }

}