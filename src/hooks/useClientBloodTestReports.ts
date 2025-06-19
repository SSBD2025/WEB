import {useMutation, useQuery} from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler";
import {BloodTestReport} from "@/types/blood_test_report";
import {getBloodTestOrder, getClientReports, getClientReportsByDietician, updateBloodTestReport} from "@/api/client.api";
import {BloodTestOrder} from "@/types/medical_examination";

export const CLIENT_VIEW_BLOOD_ORDER = "client_view_blood_order"
export const CLIENT_BLOOD_TEST_REPORTS = "clientReports"
export const DIETICIAN_BLOOD_TEST_REPORTS = "dietician"

export const useClientBloodTestReports = (enabled: boolean = true) => {
    const { t } = useTranslation();

    const query = useQuery<BloodTestReport[]>({
        queryKey: [CLIENT_BLOOD_TEST_REPORTS],
        queryFn: getClientReports,
        staleTime: 1000 * 60 * 5,
        enabled: enabled,
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
    }, [query.error, t]);

    return query;
};

export const useClientBloodTestByDieticianReports = (clientId?: string) => {
    const { t } = useTranslation();

    const query = useQuery<BloodTestReport[]>({
        queryKey: [CLIENT_BLOOD_TEST_REPORTS, DIETICIAN_BLOOD_TEST_REPORTS, clientId],
        queryFn: () => getClientReportsByDietician(clientId!),
        staleTime: 1000 * 60 * 5,
        enabled: !!clientId,
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
    }, [query.error, t]);


    return query;
};

export const useClientViewBloodTestOrder = () => {
    const { t } = useTranslation();

    const query = useQuery<BloodTestOrder, Error>({
        queryKey: [CLIENT_VIEW_BLOOD_ORDER],
        queryFn: () => getBloodTestOrder(),
    })

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
    }, [query.error, t]);
    return query;
};

export const useUpdateBloodTestReport = (
    refetch: () => Promise<unknown>,
    onSuccess?: () => void,
    onSettled?: () => void
) => {
    const { t } = useTranslation();

    const mutation = useMutation({
        mutationFn: (updatedReport: BloodTestReport) => updateBloodTestReport(updatedReport),
        onSuccess: async () => {
            await refetch();
            toast.success(t("blood_test_reports.report_updated"));
            onSuccess?.();
        },
        onError: (error) => {
            console.error("Error updating report:", error);

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) {
                    toast.error(t("exceptions.unauthorized"));
                } else if (status === 403) {
                    toast.error(t("exceptions.access_denied"));
                } else {
                    toast.error(t("blood_test_reports.update_error"));
                }
            } else {
                toast.error(t("exceptions.unexpected"));
            }
        },
        onSettled,
    });

    return mutation;
};