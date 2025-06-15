import {useMutation, useQuery, UseQueryOptions} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
    getAllClientPeriodicSurvey,
    getAllDieticianPeriodicSurvey, getLatestPeriodicSurvey,
    submitPeriodicSurvey, updateLatestPeriodicSurvey
} from '@/api/periodicSurvey.api';
import { axiosErrorHandler } from '@/lib/axiosErrorHandler';
import { toast } from 'sonner';
import {AllPeriodicSurveys, GetPeriodicSurvey, PeriodicSurveyQueryParams} from "@/types/periodic_survey";
import {queryClient} from "@/lib/queryClient.ts";

export const GET_ALL_PERIODIC_SURVEYS_CLIENT = "client_periodic_surveys"
export const GET_ALL_PERIODIC_SURVEYS_DIETICIAN = "dietician_periodic_surveys"
export const GET_LATEST_PERIODIC_SURVEY_CLIENT = "client_latest_periodic_survey"

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

    const query = useQuery<AllPeriodicSurveys, Error>({
        queryKey: [GET_ALL_PERIODIC_SURVEYS_CLIENT, params],
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
        queryKey: [GET_ALL_PERIODIC_SURVEYS_DIETICIAN, clientId, params],
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

export const useEditLatestPeriodicSurvey = (params: PeriodicSurveyQueryParams) => {
    const { t } = useTranslation();

    return useMutation({
        mutationFn: updateLatestPeriodicSurvey,
        onError: (error) => {
            axiosErrorHandler(error, t("periodic_survey.error.edit"));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [GET_ALL_PERIODIC_SURVEYS_CLIENT, params],
            });
            toast.success(t("periodic_survey.client.edit.success"));
        },
    });
};

export const useGetLatestPeriodicSurvey = () => {
    const { t } = useTranslation();

    const query = useQuery<GetPeriodicSurvey>({
        queryKey: [GET_LATEST_PERIODIC_SURVEY_CLIENT],
        queryFn: () => getLatestPeriodicSurvey(),
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