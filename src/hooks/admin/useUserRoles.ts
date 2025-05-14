import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addRoleToUser, removeRoleFromUser } from "@/api/adminUser.api"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

interface ApiError {
  response?: {
    status?: number
    data?: {
      message?: string
      error?: string
    }
  }
  message?: string
}

export const useUserRoles = (userId?: string, id?: string) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const addRoleMutation = useMutation({
    mutationFn: (role: string) => addRoleToUser(userId!, role),
    onSuccess: (_, role) => {
      queryClient.invalidateQueries({ queryKey: ["user", id] })
      toast.success(t("admin.user_account.toasts.role_added", { role }))
    },
    onError: (error: ApiError, role) => {
      if (error?.response?.status === 409) {
        toast.error(t("admin.user_account.toasts.user_has_role", { role }))
      } else {
        toast.error(t("admin.user_account.toasts.role_add_error", { role }))
      }
    },
  })

  const removeRoleMutation = useMutation({
    mutationFn: (role: string) => removeRoleFromUser(userId!, role),
    onSuccess: (_, role) => {
      queryClient.invalidateQueries({ queryKey: ["user", id] })
      toast.success(t("admin.user_account.toasts.role_removed", { role }))
    },
    onError: (error: ApiError, role) => {
      if (error?.response?.status === 409) {
        toast.error(t("admin.user_account.toasts.user_no_role", { role }))
      } else {
        toast.error(t("admin.user_account.toasts.role_remove_error", { role }))
      }
    },
  })

  return { addRoleMutation, removeRoleMutation }
}
