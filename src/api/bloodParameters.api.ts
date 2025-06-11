import apiClient from "@/lib/apiClient";
import {SubmitBloodTestReport} from "@/types/blood_test_report";

export const getAllBloodParameters = async (male: boolean) => {
    const response = await apiClient.get(`/mod/blood-parameters/${male}`);
    return response.data;
};

export const submitReport = async ({clientId, data}: { clientId: string; data: SubmitBloodTestReport; }) => {
    const response = await apiClient.post(`/mod/blood-test-reports/client/${clientId}`, data);
    return response.data;
};