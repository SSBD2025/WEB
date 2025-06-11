import apiClient from "@/lib/apiClient";
import {AllPeriodicSurveys, PeriodicSurvey, PeriodicSurveyQueryParams} from "@/types/periodic_survey";

export const submitPeriodicSurvey = async (surveyData: PeriodicSurvey) => {
    const response = await apiClient.post("/mod/clients/periodic-survey", surveyData);
    return response.data;
}

export const getAllClientPeriodicSurvey = async ({
        page,
        size,
     }: PeriodicSurveyQueryParams) => {
    const response = await apiClient.get("/mod/clients/periodic-survey", {
        params: {
            ...(typeof page === "number" ? { page } : {}),
            ...(typeof size === "number" ? { size } : {}),
        },
    });
    return response.data as AllPeriodicSurveys;
}

export const getAllDieticianPeriodicSurvey = async ({
                                                     page,
                                                     size,
                                                 }: PeriodicSurveyQueryParams, clientId: string) => {
    const response = await apiClient.get(`/mod/clients/dietician/${clientId}/periodic-survey`, {
        params: {
            ...(typeof page === "number" ? { page } : {}),
            ...(typeof size === "number" ? { size } : {}),
        },
    });
    return response.data as AllPeriodicSurveys;
}