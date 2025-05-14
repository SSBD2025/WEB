import type { User } from "@/types/user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"

type UserDetailsProps = {
  user: User
}

export default function UserDetails({ user }: UserDetailsProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t("admin.user_account.user_data.title")}</CardTitle>
        <CardDescription>{t("admin.user_account.user_data.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("admin.user_account.user_data.id")}</h3>
            <p className="text-sm font-mono">{user.account.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {t("admin.user_account.user_data.email")}
            </h3>
            <p className="text-sm">{user.account.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {t("admin.user_account.user_data.first_name")}
            </h3>
            <p className="text-sm">{user.account.firstName || "—"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {t("admin.user_account.user_data.last_name")}
            </h3>
            <p className="text-sm">{user.account.lastName || "—"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {t("admin.user_account.user_data.status")}
            </h3>
            <Badge variant={!user.account.active ? "destructive" : "default"}>
              {!user.account.active
                ? t("admin.user_account.user_data.blocked")
                : t("admin.user_account.user_data.active")}
            </Badge>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("admin.user_account.user_data.roles")}</h3>
          <div className="flex flex-wrap gap-2">
            {user.roles.length > 0 ? (
              user.roles.map((role, index) => (
                <Badge key={`${role.roleName}-${index}`} variant="outline">
                  {role.roleName}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">{t("admin.user_account.user_data.no_roles")}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
