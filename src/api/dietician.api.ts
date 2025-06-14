import apiClient from "@/lib/apiClient";
import {BloodTestOrder} from "@/types/medical_examination";

export const getAvailableDieticians = async (searchPhrase?: string) => {
  const params = searchPhrase ? { searchPhrase } : {};
  const response = await apiClient.get(
    "/mod/clients/get-available-dieticians",
    { params },
  );
  return response.data;
};

export const getClientPyramidsByDietician = async (clientId: string) => {
  const response = await apiClient.get(`/mod/client-food-pyramids/dietician/${clientId}`);
  return response.data;
}

export const orderMedicalExaminations = async (body: BloodTestOrder) => {
  const response = await apiClient.post(`/mod/dieticians/order-medical-examinations`, body);
  return response.data;
}

export const getClientPermanentSurvey = async (clientId: string) => {
  const response = await apiClient.get(`/mod/dieticians/${clientId}/permanent-survey`);
  return response.data;
}