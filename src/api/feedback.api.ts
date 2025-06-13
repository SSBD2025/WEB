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

export const deleteFeedback = async (id: string) => {
  const response = await apiClient.delete(`/mod/feedbacks/${id}`);
  return response.data;
};
