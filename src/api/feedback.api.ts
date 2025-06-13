import apiClient from "@/lib/apiClient";

interface AddFeedbackRequest {
  rating: number;
  description: string;
}

export const addFeedback = async ({
  id,
  data,
}: {
  id: string;
  data: AddFeedbackRequest;
}) => {
  const response = await apiClient.post(`/mod/feedbacks/pyramid/${id}`, data);
  return response.data;
};
