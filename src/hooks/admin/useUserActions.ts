import { useMutation, useQueryClient } from "@tanstack/react-query"
import { blockUser, unblockUser, changeUserPassword } from "@/api/adminUser.api"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

export const useUserActions = (userId?: string, id?: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const blockMutation = useMutation({
    mutationFn: () => blockUser(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] })
      toast.success(t("admin.user_account.toasts.account_blocked"))
    },
  })

  const unblockMutation = useMutation({
    mutationFn: () => unblockUser(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] })
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
