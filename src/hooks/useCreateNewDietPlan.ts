import {useMutation} from "@tanstack/react-query";
import {submitNewFoodPyramid} from "@/api/foodPyramid.api.ts";
import {axiosErrorHandler} from "@/lib/axiosErrorHandler.ts";
import {t} from "i18next";
import {FoodPyramid} from "@/types/food_pyramid";
import {toast} from "sonner";
import {queryClient} from "@/lib/queryClient.ts";
import {GET_ALL_FOOD_PYRAMIDS} from "@/hooks/useGetAllFoodPyramids.ts";

export const useCreateNewDietPlan = (clientId: string) => {
    return useMutation(({
        mutationFn: (payload: FoodPyramid) =>
            submitNewFoodPyramid(clientId, payload),
        onError: (error: Error) => {
            axiosErrorHandler(error, t("create_diet_profile.error"))
        },
        onSuccess: () => {
            toast.success(t("create_diet_profile.success"));
            queryClient.invalidateQueries({queryKey: [GET_ALL_FOOD_PYRAMIDS]})
        }
    }))
}