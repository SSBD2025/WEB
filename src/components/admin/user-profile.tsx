import { motion } from "framer-motion"
import { UserIcon, Calendar, Mail, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Apple } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { User } from "@/types/user"
import { useTranslation } from "react-i18next"

interface UserProfileProps {
  user: User
}

export default function UserProfile({ user }: UserProfileProps) {
  const { t } = useTranslation()

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t("admin.user_account.profile.no_data")
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-8">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarFallback className="bg-primary">
                <Apple className="h-12 w-12 text-primary-foreground" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mt-4 text-center"
          >
            <h2 className="text-xl font-bold">
              {user.account.firstName || t("admin.user_account.profile.no_name")}{" "}
              {user.account.lastName || t("admin.user_account.profile.no_last_name")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">{user.account.login || user.account.email}</p>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ul className="space-y-4">
          <li className="flex items-center gap-3">
            <Badge variant={!user.account.active ? "destructive" : "default"} className="h-8 w-8 rounded-full p-1.5">
              {!user.account.active ? (
                <ShieldAlert className="h-full w-full" />
              ) : (
                <ShieldCheck className="h-full w-full" />
              )}
            </Badge>
            <div>
              <p className="text-sm font-medium">{t("admin.user_account.profile.status")}</p>
              <p className="text-sm text-muted-foreground">
                {!user.account.active
                  ? t("admin.user_account.user_data.blocked")
                  : t("admin.user_account.user_data.active")}
              </p>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <Badge variant={user.account.verified ? "default" : "secondary"} className="h-8 w-8 rounded-full p-1.5">
              {user.account.verified ? (
                <CheckCircle2 className="h-full w-full" />
              ) : (
                <XCircle className="h-full w-full" />
              )}
            </Badge>
            <div>
              <p className="text-sm font-medium">{t("admin.user_account.profile.verification")}</p>
              <p className="text-sm text-muted-foreground">
                {user.account.verified
                  ? t("admin.user_account.profile.verified")
                  : t("admin.user_account.profile.not_verified")}
              </p>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <Badge variant="outline" className="h-8 w-8 rounded-full p-1.5">
              <Mail className="h-full w-full" />
            </Badge>
            <div>
              <p className="text-sm font-medium">{t("admin.user_account.profile.email")}</p>
              <p className="text-sm text-muted-foreground">{user.account.email}</p>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <Badge variant="outline" className="h-8 w-8 rounded-full p-1.5">
              <UserIcon className="h-full w-full" />
            </Badge>
            <div>
              <p className="text-sm font-medium">{t("admin.user_account.profile.user_id")}</p>
              <p className="text-sm text-muted-foreground font-mono">
                {user.account.id || t("admin.user_account.profile.no_id")}
              </p>
            </div>
          </li>
          {user.account.lastSuccessfulLogin && (
            <li className="flex items-center gap-3">
              <Badge variant="outline" className="h-8 w-8 rounded-full p-1.5">
                <Calendar className="h-full w-full" />
              </Badge>
              <div>
                <p className="text-sm font-medium">{t("admin.user_account.profile.last_login")}</p>
                <p className="text-sm text-muted-foreground">{formatDate(user.account.lastSuccessfulLogin)}</p>
              </div>
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  )
}
