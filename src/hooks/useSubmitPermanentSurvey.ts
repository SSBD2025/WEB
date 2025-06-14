import { useMutation, useQuery } from "@tanstack/react-query";
import { submitPermanentSurvey, getPermanentSurvey } from "@/api/client.api.ts";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler.ts";
import { t } from "i18next";
import { toast } from "sonner";
import { PermanentSurvey } from "@/types/permanent_survey.ts";
import { getClientPermanentSurvey } from "@/api/dietician.api.ts";

export const useSubmitPermanentSurvey = () => {
  return useMutation({
    mutationFn: submitPermanentSurvey,
    onError: (error) =>
      axiosErrorHandler(error, t("submit_permanent_survey.error")),
    onSuccess: () => {
      toast.success(t("submit_permanent_survey.success"));
    },
  });
};

export const useGetPermanentSurvey = () => {
  const query = useQuery<PermanentSurvey>({
    queryKey: ["permanentSurvey"],
    queryFn: () => getPermanentSurvey(),
  });

  return {
    ...query,
    error: query.error
      ? {
          title: "Failed to fetch permanent survey",
          details: (query.error as Error).message,
        }
      : undefined,
  };
};

export const useGetClientPermanentSurvey = (clientId: string) => {
  const query = useQuery<PermanentSurvey>({
    queryKey: ["clientPermanentSurvey", clientId],
    queryFn: () => getClientPermanentSurvey(clientId),
    enabled: !!clientId,
  });

  return {
    ...query,
    error: query.error
      ? {
          title: "Failed to fetch client permanent survey",
          details: (query.error as Error).message,
        }
      : undefined,
  };
};
