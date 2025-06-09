import { useMutation } from "@tanstack/react-query"
import { logRoleChange } from "@/api/user.api"
import { useTranslation } from "react-i18next"

export const useLogRoleChange = () => {
  const { t } = useTranslation()

  return useMutation({
    mutationFn: (data: { previousRole: string | null; newRole: string }) => logRoleChange(data),
    onError: (error) => {
      // TODO poprawic
      console.error(t("role_change.log_error"), error) 
    },
  })
}