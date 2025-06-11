import {useTranslation} from "react-i18next";
import {useQuery} from "@tanstack/react-query";
import {getClientSurveys} from "@/api/client.api.ts";
import {useEffect} from "react";
import axios from "axios";
import {toast} from "sonner";
import {axiosErrorHandler} from "@/lib/axiosErrorHandler.ts";

export const useGetSurveys = (clientId?: string, enabled: boolean = true) => {
    const { t } = useTranslation();

    const query = useQuery({
        queryKey: ["clientSurveys", clientId],
        queryFn: () => getClientSurveys(clientId!),
        staleTime: 1000 * 60 * 5,
        enabled: enabled && !!clientId,
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