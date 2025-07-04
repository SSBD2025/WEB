import apiClient from "@/lib/apiClient";
import { BloodTestReport } from "@/types/blood_test_report"
import {PermanentSurvey} from "@/types/permanent_survey";

export const getClientsByDietician = async (searchPhrase?: string) => {
  const params = searchPhrase ? { searchPhrase } : {};
  const response = await apiClient.get(
    "/mod/dieticians/get-clients-by-dietician",
    { params },
  );
  return response.data;
};

export const getClientReports = async () => {
  const response = await apiClient.get("/mod/blood-test-reports/client");
  return response.data;
};

export const getClientReportsByDietician = async (clientId: string) => {
  const response = await apiClient.get(`/mod/blood-test-reports/client/${clientId}`);
  return response.data;
};

export const updateBloodTestReport = async (reportData: BloodTestReport) => {
  const response = await apiClient.put(`/mod/blood-test-reports`, reportData);
  return response.data;
};

export const getClientSurveysByDietician = async (clientId: string) => {
  const response = await apiClient.get(`/mod/dieticians/${clientId}/periodic-surveys`);
  return response.data;
};

export const getClientSurveys = async () => {
  const response = await apiClient.get(`/mod/clients/periodic-survey`);
  return response.data;
};


export const getAllClientsPyramids = async () => {
  const response = await apiClient.get(`/mod/client-food-pyramids/client-pyramids`);
  return response.data;
}

export const assignDietician = async (dieticianId: string) => {
    const response = await apiClient.post(`/mod/clients/assign-dietician/${dieticianId}`);
    return response.data;
}

export const getClientStatus = async () => {
  const response = await apiClient.get(`/mod/clients/status`);
  return response.data;
}

export const getMyFeedbackForPyramid = async (pyramidId: string) => {
    const response = await apiClient.get(`/mod/feedbacks/my-pyramid/${pyramidId}`)
    return response.data
}

export const submitPermanentSurvey = async (body: PermanentSurvey) => {
  const response = await apiClient.post(`/mod/clients/permanent-survey`, body);
  return response.data;
}

export const updatePermanentSurvey = async (body: PermanentSurvey) => {
  const response = await apiClient.put(`/mod/clients/permanent-survey`, body)
  return response.data
}

export const getPermanentSurvey = async () => {
  const response = await apiClient.get(`/mod/clients/permanent-survey`);
  return response.data;
}

export const assignFoodPyramidToClient = async (clientId: string, foodPyramidId: string) => {
  const response = await apiClient.post(`/mod/client-food-pyramids`, {
    clientId,
    foodPyramidId,
  })
  return response.data
}

export const getBloodTestOrder = async () => {
  const response = await apiClient.get(`/mod/clients/blood-test-order`);
  return response.data;
}