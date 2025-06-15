import { deleteFeedback } from "@/api/feedback.api";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CLIENT_PYRAMIDS } from "./useClientPyramids";

export const useDeleteFeedback = (pyramidId: string) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: deleteFeedback,
    onError: (error) =>
      axiosErrorHandler(
        error,
        t("client_food_pyramid_list.feedback_delete_error")
      ),
    onSuccess: () => {
      toast.success(t("client_food_pyramid_list.feedback_delete_success"));
      queryClient.removeQueries({
        queryKey: [CLIENT_PYRAMIDS, "feedback", pyramidId],
      });

      queryClient.invalidateQueries({
        queryKey: [CLIENT_PYRAMIDS],
      });
    },
  });
};
