import { useQuery } from "@tanstack/react-query";
import { getClientPyramidsByDietician } from "@/api/dietician.api.ts";

export const CLIENT_PYRAMIDS_BY_DIETICIAN = "clientPyramidsByDietician";

export const useGetClientPyramidsByDietician = (clientId: string) => {
    return useQuery({
        queryKey: [CLIENT_PYRAMIDS_BY_DIETICIAN, clientId],
        queryFn: () => getClientPyramidsByDietician(clientId),
    });
};
