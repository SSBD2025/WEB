import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignDietician, getClientStatus } from "@/api/client.api.ts";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler.ts";
import { t } from "i18next";
import { toast } from "sonner";

export const useAssignDietician = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignDietician,
    onError: (error) =>
      axiosErrorHandler(error, t("assign_dietician.failed_to_assignDietician")),
    onSuccess: () => {
      toast.success(t("assign_dietician.success"));
      queryClient.invalidateQueries({ queryKey: CLIENT_STATUS });
    },
  });
};

export const CLIENT_STATUS = ["client-status"];

interface ClientStatus {
  hasAssignedDietician: boolean;
}

export const useClientStatus = () => {
  return useQuery<ClientStatus>({
    queryKey: CLIENT_STATUS,
    queryFn: getClientStatus,
  });
};
