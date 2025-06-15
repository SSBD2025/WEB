import apiClient from "@/lib/apiClient";
import {
    AllPeriodicSurveys,
    EditPeriodicSurvey, GetPeriodicSurvey,
    PeriodicSurvey,
    PeriodicSurveyQueryParams
} from "@/types/periodic_survey";

export const submitPeriodicSurvey = async (surveyData: PeriodicSurvey) => {
    const response = await apiClient.post("/mod/clients/periodic-survey", surveyData);
    return response.data;
}

export const getAllClientPeriodicSurvey = async ({
        page,
        size,
        since,
        before,
        sort,
    }: PeriodicSurveyQueryParams) => {
    const response = await apiClient.get("/mod/clients/periodic-survey", {
        params: {
            ...(typeof page === "number" ? { page } : {}),
            ...(typeof size === "number" ? { size } : {}),
            ...(since ? { since } : {}),
            ...(before ? { before } : {}),
            ...(sort ? { sort } : {}),
        },
    });
    return response.data as AllPeriodicSurveys;
}

export const getAllDieticianPeriodicSurvey = async ({
        page,
        size,
        since,
        before,
        sort,
    }: PeriodicSurveyQueryParams, clientId: string) => {
    const response = await apiClient.get(`/mod/dieticians/${clientId}/periodic-surveys`, {
        params: {
            ...(typeof page === "number" ? { page } : {}),
            ...(typeof size === "number" ? { size } : {}),
            ...(since ? { since } : {}),
            ...(before ? { before } : {}),
            ...(sort ? { sort } : {}),
        },
    });
    return response.data as AllPeriodicSurveys;
}

export const getLatestPeriodicSurvey = async () => {
    const response = await apiClient.get(`/mod/clients/periodic-survey/latest`);
    return response.data as GetPeriodicSurvey;
}

export const updateLatestPeriodicSurvey = async (data: EditPeriodicSurvey) => {
    const response = await apiClient.put(`/mod/clients/periodic-survey`, data)
    return response.data as PeriodicSurvey;
}