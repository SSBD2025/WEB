import { useQuery } from "@tanstack/react-query"
import { getUserById } from "@/api/adminUser.api"
import type { User } from "@/types/user"

export const useAdminUser = (id?: string) => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
  })

  return { user, isLoading, isError }
}
