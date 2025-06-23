import { addFeedback, updateFeedback } from "@/api/feedback.api";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CLIENT_PYRAMIDS } from "./useClientPyramids";
import { Feedback } from "@/types/food_pyramid";
import axios from "axios";

export const useAddFeedback = (pyramidId: string) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: addFeedback,
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 400) {
          const violations = data?.violations;
          if (Array.isArray(violations)) {
            const descriptionViolation = violations.find(
              (v) => v.fieldName === "description"
            );
            if (descriptionViolation) {
              toast.error(t("client_food_pyramid_list.feedback_description_error"));
              return;
            }
          }
        } else {
          axiosErrorHandler(error, t("client_food_pyramid_list.feedback_error"));
        }
      } else {
        toast.error(t("client_food_pyramid_list.unknown_error"));
      }
    },
    onSuccess: () => {
      toast.success(t("client_food_pyramid_list.feedback_success"));

      queryClient.invalidateQueries({
        queryKey: [CLIENT_PYRAMIDS, "feedback", pyramidId],
      });

      queryClient.invalidateQueries({
        queryKey: [CLIENT_PYRAMIDS],
      });
    },
  });
};

export const useUpdateFeedback = (pyramidId: string) => {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: ({ data }: { data: Feedback }) => updateFeedback({ data }),
    onError: (error) =>
      axiosErrorHandler(
        error,
        t("client_food_pyramid_list.feedback_update_error")
      ),
    onSuccess: () => {
      toast.success(t("client_food_pyramid_list.feedback_update_success"));

      queryClient.invalidateQueries({
        queryKey: [CLIENT_PYRAMIDS, "feedback", pyramidId],
      });

      queryClient.invalidateQueries({
        queryKey: [CLIENT_PYRAMIDS],
      });
    },
  });
};
