import { useMutation, useQueryClient } from "@tanstack/react-query"
import { assignFoodPyramidToClient } from "@/api/client.api"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import type { AxiosError } from "axios"

interface AssignFoodPyramidData {
  clientId: string
  foodPyramidId: string
}

export const useAssignFoodPyramid = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AssignFoodPyramidData) => assignFoodPyramidToClient(data.clientId, data.foodPyramidId),
    onSuccess: () => {
      toast.success(t("assign_food_pyramid.success"))
      queryClient.invalidateQueries({ queryKey: ["clientPyramids"] })
      queryClient.invalidateQueries({ queryKey: ["clientPyramidsByDietician"] })
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
          toast.error(t("exceptions.food_pyramid_already_assigned"))
      } else if (error.response?.status === 404) {
        const errorMessage = error.response?.data as string
        if (errorMessage === "client_not_found") {
          toast.error(t("exceptions.client_not_found"))
        } else if (errorMessage === "food_pyramid_not_found") {
          toast.error(t("exceptions.food_pyramid_not_found"))
        }
      }
    },
  })
}
