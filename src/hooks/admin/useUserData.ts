import { useMutation, useQueryClient } from "@tanstack/react-query"
import { changeUserEmail, updateUserData } from "@/api/adminUser.api"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import type { UseFormReturn } from "react-hook-form"
import type { User } from "@/types/user"
import type { EmailFormValues, PersonalDataFormValues } from "@/schemas/admin/userForms.schema"
import { ADMIN_USER_QUERY_KEY } from "./useAdminUser"
import { ALL_ACCOUNTS_QUERY_KEY } from "../useAllAccounts"

export const useUserData = (
  userId?: string,
  id?: string,
  emailForm?: UseFormReturn<EmailFormValues>,
  dataForm?: UseFormReturn<PersonalDataFormValues>,
) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const emailMutation = useMutation({
    mutationFn: (data: EmailFormValues) => changeUserEmail(userId!, { email: data.email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USER_QUERY_KEY(id!) })
      queryClient.invalidateQueries({ queryKey: ALL_ACCOUNTS_QUERY_KEY})
      emailForm?.reset()
      toast.success(t("admin.user_account.toasts.email_changed"))
    },
  })

  const dataMutation = useMutation({
    mutationFn: (data: PersonalDataFormValues) =>
      updateUserData(id!, {
        firstName: data.firstName,
        lastName: data.lastName,
        lockToken: queryClient.getQueryData<User>(["user", id])?.lockToken || "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_USER_QUERY_KEY(id!) })
      queryClient.invalidateQueries({ queryKey: ALL_ACCOUNTS_QUERY_KEY})
      dataForm?.reset()
      toast.success(t("admin.user_account.toasts.data_updated"))
    },
  })

  return { emailMutation, dataMutation }
}