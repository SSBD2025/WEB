import {useMutation, useQuery} from "@tanstack/react-query";
import {getAllBloodParameters, submitReport} from "@/api/bloodParameters.api.ts";
import {BloodParameter, SubmitBloodTestReport} from "@/types/blood_test_report";
import {axiosErrorHandler} from "@/lib/axiosErrorHandler.ts";
import { t } from "i18next";
import {toast} from "sonner";
import {useEffect} from "react";
import axios from "axios";
import {queryClient} from "@/lib/queryClient.ts";
import {CLIENT_BLOOD_TEST_REPORTS, DIETICIAN_BLOOD_TEST_REPORTS} from "@/hooks/useClientBloodTestReports.ts";

export const BLOOD_PARAMS_QUERY = "bloodParameters";

export const useBloodParameter = (clientId: string) => {
    const query = useQuery<BloodParameter[], Error>({
        queryKey: [BLOOD_PARAMS_QUERY, clientId],
        queryFn: () => getAllBloodParameters(clientId),
    });
    useEffect(() => {
        if (query.error) {
            if (axios.isAxiosError(query.error)) {
                const status = query.error.response?.status;
                if (status === 401) {
                    toast.error(t("exceptions.unauthorized"));
                } else if (status === 403) {
                    toast.error(t("exceptions.access_denied"));
                } else {
                    axiosErrorHandler(query.error, t("errors.generic"));
                }
            } else {
                toast.error(t("exceptions.unexpected"));
            }
        }
    }, [query.error]);
    return query;
};

export const useSubmitReport = (clientId: string) => {
    return useMutation({
        mutationFn: (data: SubmitBloodTestReport) => submitReport({ clientId, data }),
        onError: (error) => {
            axiosErrorHandler(error, t("blood_test_reports.insert.error"));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [CLIENT_BLOOD_TEST_REPORTS]})
            queryClient.invalidateQueries({queryKey: [CLIENT_BLOOD_TEST_REPORTS, DIETICIAN_BLOOD_TEST_REPORTS, clientId]})
            toast.success(t("blood_test_reports.insert.submitted"));
        },
    });
};