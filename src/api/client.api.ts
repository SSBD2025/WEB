import apiClient from "@/lib/apiClient";
import { BloodTestReport } from "@/types/blood_test_report"

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

export const getAllClientsPyramids = async () => {
  const response = await apiClient.get(`/mod/client-food-pyramids/client-pyramids`);
  return response.data;
}