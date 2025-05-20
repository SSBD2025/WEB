import { useMutation, useQueryClient } from "@tanstack/react-query"
import { blockUser, unblockUser, changeUserPassword } from "@/api/adminUser.api"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { ADMIN_USER_QUERY_KEY } from "./useAdminUser"
import { ALL_ACCOUNTS_QUERY_KEY } from "../useAllAccounts"

export const useUserActions = (userId?: string, id?: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const blockMutation = useMutation({
    mutationFn: () => blockUser(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USER_QUERY_KEY(id!) })
      queryClient.invalidateQueries({ queryKey: [ALL_ACCOUNTS_QUERY_KEY]})
      toast.success(t("admin.user_account.toasts.account_blocked"))
    },
  })

  const unblockMutation = useMutation({
    mutationFn: () => unblockUser(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USER_QUERY_KEY(id!) })
      queryClient.invalidateQueries({ queryKey: [ALL_ACCOUNTS_QUERY_KEY]})
      toast.success(t("admin.user_account.toasts.account_unblocked"))
    },
  })

  const passwordMutation = useMutation({
    mutationFn: () => changeUserPassword(userId!),
    onSuccess: () => {
      toast.success(t("admin.user_account.toasts.password_reset_link"))
    },
  })

  return { blockMutation, unblockMutation, passwordMutation }
}
