import { addFeedback } from "@/api/feedback.api";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CLIENT_PYRAMIDS } from "./useClientPyramids";

export const useAddFeedback = (pyramidId: string) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: addFeedback,
    onError: (error) =>
      axiosErrorHandler(error, t("client_food_pyramid_list.feedback_error")),
    onSuccess: () => {
      toast.success(t("client_food_pyramid_list.feedback_success"));

      queryClient.invalidateQueries({
        queryKey: [CLIENT_PYRAMIDS, "feedback", pyramidId]
      })
    },
  });
};
