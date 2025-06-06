import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { axiosErrorHandler } from "@/lib/axiosErrorHandler";
import { getClientReports, getClientReportsByDietician } from "@/api/client.api";

export const useClientBloodTestReports = (enabled: boolean = true) => {
    const { t } = useTranslation();

    const query = useQuery({
        queryKey: ["clientReports"],
        queryFn: getClientReports,
        staleTime: 1000 * 60 * 5,
        enabled: enabled,
    });

    useEffect(() => {
        if (query.error) {
            if (axios.isAxiosError(query.error)) {
                const status = query.error.response?.status;
                if (status === 401) {
                    toast.error(t("errors.unauthorized"));
                } else if (status === 403) {
                    toast.error(t("errors.accessDenied"));
                } else {
                    axiosErrorHandler(query.error, t("errors.generic"));
                }
            } else {
                toast.error(t("errors.unknown"));
            }
        }
    }, [query.error, t]);

    return query;
};

export const useClientBloodTestByDieticianReports = (clientId?: string) => {
    const { t } = useTranslation();

    const query = useQuery({
        queryKey: ["clientReports", "dietician", clientId],
        queryFn: () => getClientReportsByDietician(clientId!),
        staleTime: 1000 * 60 * 5,
        enabled: !!clientId,
    });

    useEffect(() => {
        if (query.error) {
            if (axios.isAxiosError(query.error)) {
                const status = query.error.response?.status;
                if (status === 401) {
                    toast.error(t("errors.unauthorized"));
                } else if (status === 403) {
                    toast.error(t("errors.accessDenied"));
                } else {
                    axiosErrorHandler(query.error, t("errors.generic"));
                }
            } else {
                toast.error(t("errors.unknown"));
            }
        }
    }, [query.error, t]);


    return query;
};