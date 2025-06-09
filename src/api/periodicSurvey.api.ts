import apiClient from "@/lib/apiClient";
import { PeriodicSurvey } from "@/types/periodic_survey";

export const submitPeriodicSurvey = async (surveyData: PeriodicSurvey) => {
    const response = await apiClient.post("/mod/clients/periodic-survey", surveyData);
    return response.data;
}