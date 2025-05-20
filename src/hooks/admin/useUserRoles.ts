import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addRoleToUser, removeRoleFromUser } from "@/api/adminUser.api"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { ADMIN_USER_QUERY_KEY } from "./useAdminUser"
import { ALL_ACCOUNTS_QUERY_KEY } from "../useAllAccounts"

export const useUserRoles = (userId?: string, id?: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const addRoleMutation = useMutation({
    mutationFn: (role: string) => addRoleToUser(userId!, role),
    onSuccess: (_, role) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USER_QUERY_KEY(id!) })
      queryClient.invalidateQueries({ queryKey: ALL_ACCOUNTS_QUERY_KEY})
      toast.success(t("admin.user_account.toasts.role_added", { role }))
    },
  })

  const removeRoleMutation = useMutation({
    mutationFn: (role: string) => removeRoleFromUser(userId!, role),
    onSuccess: (_, role) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USER_QUERY_KEY(id!) })
      toast.success(t("admin.user_account.toasts.role_removed", { role }))
    },
  })

  return { addRoleMutation, removeRoleMutation }
}
