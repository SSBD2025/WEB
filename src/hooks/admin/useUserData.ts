import { useMutation, useQueryClient } from "@tanstack/react-query"
import { changeUserEmail, updateUserData } from "@/api/adminUser.api"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import type { UseFormReturn } from "react-hook-form"
import type { User } from "@/types/user"
import type { EmailFormValues, PersonalDataFormValues } from "@/schemas/admin/userForms.schema"

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
      queryClient.invalidateQueries({ queryKey: ["user", id] })
      emailForm?.reset()
      toast.success(t("admin.user_account.toasts.email_changed"))
    },
    onError: (error: ApiError) => {
      if (error?.response?.status === 409) {
        toast.error(t("admin.user_account.toasts.email_in_use"))
      } else {
        toast.error(t("admin.user_account.toasts.email_change_error"))
      }
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
      queryClient.invalidateQueries({ queryKey: ["user", id] })
      dataForm?.reset()
      toast.success(t("admin.user_account.toasts.data_updated"))
    },
  })

  return { emailMutation, dataMutation }
}