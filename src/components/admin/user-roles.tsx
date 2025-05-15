import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Plus, Minus, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { User } from "@/types/user"
import { useTranslation } from "react-i18next"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { useCurrentUser } from "@/hooks/useCurrentUser"

const AVAILABLE_ROLES = ["ADMIN", "CLIENT", "DIETICIAN"]

interface UserRolesProps {
  user: User
  onAddRole: (role: string) => void
  onRemoveRole: (role: string) => void
  isLoading: boolean
}

export default function UserRoles({ user, onAddRole, onRemoveRole, isLoading }: UserRolesProps) {
  const { t } = useTranslation()
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [roleToModify, setRoleToModify] = useState<string | null>(null)
  const [isAddingRole, setIsAddingRole] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { data: currentUser } = useCurrentUser()

  const isSelfEditing = currentUser?.account?.id === user.account.id

  useEffect(() => {
    const activeRoles = user.roles.filter((role) => role.active).map((role) => role.roleName)
    setSelectedRoles(activeRoles)
  }, [user.roles])

  const handleRoleAction = (role: string, isAdding: boolean) => {
    if (isLoading || isSelfEditing) return

    setRoleToModify(role)
    setIsAddingRole(isAdding)
    setIsDialogOpen(true)
  }

  const confirmRoleChange = () => {
    if (!roleToModify) return

    if (isAddingRole) {
      onAddRole(roleToModify)
      setSelectedRoles((prev) => [...prev, roleToModify])
    } else {
      onRemoveRole(roleToModify)
      setSelectedRoles((prev) => prev.filter((r) => r !== roleToModify))
    }

    setIsDialogOpen(false)
    setRoleToModify(null)
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: "bg-red-100 text-red-800 hover:bg-red-200",
      CLIENT: "bg-green-100 text-green-800 hover:bg-green-200",
      DIETICIAN: "bg-teal-100 text-teal-800 hover:bg-teal-200",
    }

    return colors[role] || "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }

  const isRoleDisabled = (role: string, hasRole: boolean) => {
    if (isLoading) return true

    if (isSelfEditing) return true

    if (!hasRole) {
      if (role === "CLIENT" && selectedRoles.includes("DIETICIAN")) {
        return true
      }
      if (role === "DIETICIAN" && selectedRoles.includes("CLIENT")) {
        return true
      }
    }

    return false
  }

  const getDisabledTooltip = (role: string) => {
    if (isSelfEditing) {
      return t("admin.user_account.roles.cannot_modify_own_roles")
    }

    if (role === "CLIENT" && selectedRoles.includes("DIETICIAN")) {
      return t("admin.user_account.roles.client_dietician_conflict")
    }
    if (role === "DIETICIAN" && selectedRoles.includes("CLIENT")) {
      return t("admin.user_account.roles.dietician_client_conflict")
    }
    return ""
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {t("admin.user_account.roles.title")}
          </CardTitle>
          <CardDescription>
            {isSelfEditing
              ? t("admin.user_account.roles.self_edit_description")
              : t("admin.user_account.roles.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">{t("admin.user_account.roles.active_roles")}</h3>
            <div className="flex flex-wrap gap-2">
              {selectedRoles.length > 0 ? (
                selectedRoles.map((role) => (
                  <Badge key={role} variant="secondary">
                    {role}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t("admin.user_account.user_data.no_roles")}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
            {AVAILABLE_ROLES.map((role) => {
              const hasRole = selectedRoles.includes(role)
              const isDisabled = isRoleDisabled(role, hasRole)
              const tooltipMessage = getDisabledTooltip(role, hasRole)

              return (
                <motion.div
                  key={role}
                  whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                  whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full">
                          <Button
                            variant="outline"
                            className={`w-full justify-between h-auto py-3 px-4 ${hasRole ? getRoleColor(role) : ""} ${
                              isDisabled && !hasRole ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            onClick={() => !isDisabled && handleRoleAction(role, !hasRole)}
                            disabled={isLoading || isDisabled}
                          >
                            <span>{role}</span>
                            <AnimatePresence mode="wait">
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : hasRole ? (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                  <Minus className="h-4 w-4" />
                                </motion.div>
                              ) : (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                  <Plus className="h-4 w-4" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Button>
                        </div>
                      </TooltipTrigger>
                      {tooltipMessage && <TooltipContent>{tooltipMessage}</TooltipContent>}
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isAddingRole
                ? t("admin.user_account.roles.add_role_confirm", { role: roleToModify })
                : t("admin.user_account.roles.remove_role_confirm", { role: roleToModify })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isAddingRole
                ? t("admin.user_account.roles.add_role_description", { role: roleToModify })
                : t("admin.user_account.roles.remove_role_description", { role: roleToModify })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("admin.user_account.forms.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRoleChange}>
              {isAddingRole ? t("admin.user_account.roles.add_role") : t("admin.user_account.roles.remove_role")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
