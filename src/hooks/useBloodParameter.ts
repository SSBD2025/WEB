import {useMutation, useQuery} from "@tanstack/react-query";
import {getAllBloodParameters, submitReport} from "@/api/bloodParameters.api.ts";
import {BloodParameter, SubmitBloodTestReport} from "@/types/blood_test_report";
import {axiosErrorHandler} from "@/lib/axiosErrorHandler.ts";
import { useTranslation } from "react-i18next";
import {toast} from "sonner";

export const useBloodParameter = (male: boolean) => {
    return useQuery<BloodParameter[], Error>({
        queryKey: ["bloodParameters", male],
        queryFn: () => getAllBloodParameters(male)
    });
};

export const useSubmitReport = (clientId: string) => {
    const { t } = useTranslation();

    return useMutation({
        mutationFn: (data: SubmitBloodTestReport) => submitReport({ clientId, data }),
        onError: (error) => {
            axiosErrorHandler(error, t("blood_test_reports.insert.error"));
        },
        onSuccess: () => {
            toast.success(t("blood_test_reports.insert.submitted"));
        },
    });
};