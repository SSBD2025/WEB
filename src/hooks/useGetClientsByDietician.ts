import { useQuery } from "@tanstack/react-query";
import { getClientsByDietician } from "@/api/client.api.ts";
import { Client } from "@/types/user";

export const CLIENTS_BY_DIETICIAN_QUERY_KEY = "clientsByDietician";

export const useGetClientsByDietician = (searchPhrase?: string) => {
  const query = useQuery<Client[]>({
    queryKey: [CLIENTS_BY_DIETICIAN_QUERY_KEY, searchPhrase],
    queryFn: () => getClientsByDietician(searchPhrase),
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
