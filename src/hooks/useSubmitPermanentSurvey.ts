import {useMutation} from "@tanstack/react-query";
import {submitPermanentSurvey} from "@/api/client.api.ts";
import {axiosErrorHandler} from "@/lib/axiosErrorHandler.ts";
import {t} from "i18next";
import {toast} from "sonner";

export const useSubmitPermanentSurvey = () => {
    return useMutation({
        mutationFn: submitPermanentSurvey,
        onError: (error) => axiosErrorHandler(error, t("submit_permanent_survey.error")),
        onSuccess: () => {
            toast.success(t("submit_permanent_survey.success"));
        }
    })
}