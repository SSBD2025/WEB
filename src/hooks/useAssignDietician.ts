import { useMutation } from "@tanstack/react-query";
import { assignDietician } from "@/api/client.api.ts";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler.ts";
import { t } from "i18next";
import { toast } from "sonner";

export const useAssignDietician = () => {
  return useMutation({
    mutationFn: assignDietician,
    onError: (error) =>
      axiosErrorHandler(error, t("assign_dietician.failed_to_assignDietician")),
    onSuccess: () => {
      toast.success(t("assign_dietician.success"));
    },
  });
};
