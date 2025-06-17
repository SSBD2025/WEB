import { useMutation, useQueryClient } from "@tanstack/react-query"
import { assignFoodPyramidToClient } from "@/api/client.api"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { axiosErrorHandler } from "@/lib/axiosErrorHandler"
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
      axiosErrorHandler(error, t("exceptions.unknown_error"))
    }
  })
}
