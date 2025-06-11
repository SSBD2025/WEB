import {useMutation, useQuery, UseQueryOptions} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
    getAllClientPeriodicSurvey,
    getAllDieticianPeriodicSurvey,
    submitPeriodicSurvey
} from '@/api/periodicSurvey.api';
import { axiosErrorHandler } from '@/lib/axiosErrorHandler';
import { toast } from 'sonner';
import {AllPeriodicSurveys, PeriodicSurveyQueryParams} from "@/types/periodic_survey";

export const useSubmitPeriodicSurvey = () => {
    const { t } = useTranslation();

    return useMutation({
        mutationFn: submitPeriodicSurvey,
        onError: (error) => {
            axiosErrorHandler(error, t("periodic_survey.submit_error"));
        },
        onSuccess: () => {
            toast.success(t("periodic_survey.submit_success"));
        },
    });
};

export const useGetAllClientPeriodicSurvey = (params: PeriodicSurveyQueryParams) => {
    const { t } = useTranslation();

    const query = useQuery<AllPeriodicSurveys>({
        queryKey: ["client_periodic_surveys", params],
        queryFn: () => getAllClientPeriodicSurvey(params),
    });

    return {
        ...query,
        error: query.error
            ? {
                title: t("periodic_survey.error.fetch"),
                details: (query.error as Error).message,
            }
            : undefined,
    };
}

export const useGetAllDieticianPeriodicSurvey = (
    params: PeriodicSurveyQueryParams,
    clientId: string | undefined,
    options?: Partial<UseQueryOptions<AllPeriodicSurveys, Error, AllPeriodicSurveys, [string, string | undefined, PeriodicSurveyQueryParams]>>
) => {
    const { t } = useTranslation();

    const query = useQuery<AllPeriodicSurveys, Error, AllPeriodicSurveys, [string, string | undefined, PeriodicSurveyQueryParams]>({
        queryKey: ["dietician_periodic_surveys", clientId, params],
        queryFn: () => getAllDieticianPeriodicSurvey(params, clientId!),
        enabled: !!clientId,
        ...options,
    });

    return {
        ...query,
        error: query.error
            ? {
                title: t("periodic_survey.error.fetch"),
                details: (query.error as Error).message,
            }
            : undefined,
    };
};