import { useQuery } from "@tanstack/react-query";
import { getAllClientsPyramids, getMyFeedbackForPyramid } from "@/api/client.api.ts";
import { useCurrentUser } from "./useCurrentUser";

export const CLIENT_PYRAMIDS = "clientPyramids";

export const useClientPyramids = () => {
  return useQuery({
    queryKey: [CLIENT_PYRAMIDS],
    queryFn: () => getAllClientsPyramids(),
  });
};

export const useClientFeedbackForPyramid = (pyramidId: string) => {
  const { data: currentUser } = useCurrentUser()

  return useQuery({
    queryKey: [CLIENT_PYRAMIDS, "feedback", pyramidId],
    queryFn: () => getMyFeedbackForPyramid(pyramidId),
    enabled: !!currentUser && !!pyramidId
  })
}
