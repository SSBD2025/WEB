import { useQuery } from "@tanstack/react-query"
import { getUserById } from "@/api/adminUser.api"
import type { User } from "@/types/user"

export const ADMIN_USER_QUERY_KEY = (id: string): readonly [string, string] => ["user", id];

export const useAdminUser = (id?: string) => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<User>({
    queryKey: ADMIN_USER_QUERY_KEY(id!),
    queryFn: () => getUserById(id!),
    enabled: !!id,
  })

  return { user, isLoading, isError }
}
