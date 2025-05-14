import { useState } from "react"
import { motion } from "framer-motion"
import { Lock, Unlock, KeyRound, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { useTranslation } from "react-i18next"

interface UserActionsProps {
  isBlocked: boolean
  onBlock: () => void
  onUnblock: () => void
  onResetPassword: () => void
  isLoading: {
    block: boolean
    unblock: boolean
    resetPassword: boolean
  }
}

export default function UserActions({ isBlocked, onBlock, onUnblock, onResetPassword, isLoading }: UserActionsProps) {
  const { t } = useTranslation()
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
  const [isUnblockDialogOpen, setIsUnblockDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

  const handleBlock = () => {
    setIsBlockDialogOpen(true)
  }

  const handleUnblock = () => {
    setIsUnblockDialogOpen(true)
  }

  const confirmBlock = () => {
    onBlock()
    setIsBlockDialogOpen(false)
  }

  const confirmUnblock = () => {
    onUnblock()
    setIsUnblockDialogOpen(false)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.user_account.actions.title")}</CardTitle>
          <CardDescription>{t("admin.user_account.actions.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {isBlocked ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleUnblock}
                  variant="outline"
                  className="w-full h-auto py-6 flex flex-col items-center justify-center gap-3"
                  disabled={isLoading.unblock}
                >
                  {isLoading.unblock ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Unlock className="h-6 w-6 text-green-500" />
                  )}
                  <span className="font-medium">{t("admin.user_account.actions.unblock_account")}</span>
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Button
                  onClick={handleBlock}
                  variant="outline"
                  className="w-full h-auto py-6 flex flex-col items-center justify-center gap-3 border-destructive/20 hover:border-destructive/30 hover:bg-destructive/10"
                  disabled={isLoading.block}
                >
                  {isLoading.block ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Lock className="h-6 w-6 text-destructive" />
                  )}
                  <span className="font-medium text-destructive">{t("admin.user_account.actions.block_account")}</span>
                </Button>
              </motion.div>
            )}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:col-span-2">
              <Button
                onClick={() => setIsPasswordDialogOpen(true)}
                variant="outline"
                className="w-full h-auto py-6 flex flex-col items-center justify-center gap-3"
                disabled={isLoading.resetPassword}
              >
                {isLoading.resetPassword ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <KeyRound className="h-6 w-6 text-amber-500" />
                )}
                <span className="font-medium">{t("admin.user_account.actions.reset_password")}</span>
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Block Confirmation Dialog */}
      <AlertDialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.user_account.actions.block_confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("admin.user_account.actions.block_confirm_description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("admin.user_account.actions.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBlock}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("admin.user_account.actions.block")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unblock Confirmation Dialog */}
      <AlertDialog open={isUnblockDialogOpen} onOpenChange={setIsUnblockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.user_account.actions.unblock_confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.user_account.actions.unblock_confirm_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("admin.user_account.actions.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUnblock}>{t("admin.user_account.actions.unblock")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Reset Confirmation Dialog */}
      <AlertDialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.user_account.actions.reset_confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription>{t("admin.user_account.actions.reset_confirm_description")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("admin.user_account.actions.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onResetPassword()
                setIsPasswordDialogOpen(false)
              }}
            >
              {t("admin.user_account.actions.send_link")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
