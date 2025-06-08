import { useQuery } from "@tanstack/react-query";
import { getAllClientsPyramids } from "@/api/client.api.ts";

export const CLIENT_PYRAMIDS = "clientPyramids";

export const useClientPyramids = () => {
  return useQuery({
    queryKey: [CLIENT_PYRAMIDS],
    queryFn: () => getAllClientsPyramids(),
  });
};
