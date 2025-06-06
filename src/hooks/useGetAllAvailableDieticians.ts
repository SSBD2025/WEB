import { useQuery } from "@tanstack/react-query";
import { getAvailableDieticians } from "@/api/dietician.api.ts";
import { Dietician } from "@/types/user";

export const AVAILABLE_DIETICIANS_QUERY_KEY = "availableDieticians";

export const useGetAllAvailableDieticians = (searchPhrase?: string) => {
  const query = useQuery<Dietician[]>({
    queryKey: [AVAILABLE_DIETICIANS_QUERY_KEY, searchPhrase],
    queryFn: () => getAvailableDieticians(searchPhrase),
  });

  return {
    ...query,
    error: query.error
      ? {
          details: (query.error as Error).message,
        }
      : undefined,
  };
};
