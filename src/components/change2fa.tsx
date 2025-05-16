import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Switch } from "@/components/ui/switch"
import { useDisable2FA, useEnable2FA } from "@/hooks/useChangeMeData"
interface Change2faProps {
  status: boolean
}

const Change2fa = ({ status }: Change2faProps) => {
  const { t } = useTranslation()
  const [enabled, setEnabled] = useState(status)
  const enable2FA = useEnable2FA()
  const disable2FA = useDisable2FA()

  const handleToggle = () => {
    if (enabled) {
      disable2FA.mutate(undefined, {
        onSuccess: () => setEnabled(false),
      })
    } else {
      enable2FA.mutate(undefined, {
        onSuccess: () => setEnabled(true),
      })
    }
  }

  const isLoading = enable2FA.isPending || disable2FA.isPending

  return (
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-medium">{t("profile.fields.2fastatus")}</h3>
            <p className="text-sm text-muted-foreground">
              {enabled ? t("profile.fields.2fa_enabled") : t("profile.fields.2fa_disabled")}
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={handleToggle}
            disabled={isLoading}
          />
        </div>

  )
}

export default Change2fa
