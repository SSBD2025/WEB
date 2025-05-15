import { useParams } from "react-router"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import DataRenderer from "@/components/shared/DataRenderer"
import UserProfile from "@/components/admin/user-profile"
import UserActions from "@/components/admin/user-actions"
import UserRoles from "@/components/admin/user-roles"
import UserForms from "@/components/admin/user-forms"
import { useAdminUser } from "@/hooks/admin/useAdminUser"
import { useUserActions } from "@/hooks/admin/useUserActions"
import { useUserRoles } from "@/hooks/admin/useUserRoles"
import { useUserData } from "@/hooks/admin/useUserData"
import { personalDataSchema, emailSchema } from "@/schemas/admin/userForms.schema"

export default function AdminUserAccount() {
  const { t } = useTranslation()
  const params = useParams<{ id: string }>()
  const id = params.id

  const { user, isLoading, isError } = useAdminUser(id)
  const userId = user?.account?.id

  const { blockMutation, unblockMutation, passwordMutation } = useUserActions(userId, id)

  const { addRoleMutation, removeRoleMutation } = useUserRoles(userId, id)

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  const dataForm = useForm({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  })

  const { emailMutation, dataMutation } = useUserData(userId, id, emailForm, dataForm)

  useEffect(() => {
    if (user) {
      console.log("Setting form values with user data:", user)
      emailForm.setValue("email", user.account.email)
      dataForm.setValue("firstName", user.account.firstName)
      dataForm.setValue("lastName", user.account.lastName)
    }
  }, [user, emailForm, dataForm])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex-grow justify-center items-center flex">
      <DataRenderer
        status={isLoading ? "loading" : isError ? "error" : "success"}
        data={user ? [user] : []}
        render={([user]) => {
          console.log("User data:", user)
          return (
            <motion.div className="max-w-7xl mx-auto" variants={container} initial="hidden" animate="show">
              <motion.div variants={item} className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{t("admin.user_account.title")}</h1>
                <p className="text-muted-foreground mt-2">{t("admin.user_account.subtitle")}</p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div variants={item} className="lg:col-span-1">
                  <UserProfile user={user} />
                </motion.div>

                <div className="lg:col-span-2 space-y-6">
                  <motion.div variants={item}>
                    <UserActions
                      isBlocked={!user.account.active}
                      onBlock={() => blockMutation.mutate()}
                      onUnblock={() => unblockMutation.mutate()}
                      onResetPassword={() => passwordMutation.mutate()}
                      isLoading={{
                        block: blockMutation.isPending,
                        unblock: unblockMutation.isPending,
                        resetPassword: passwordMutation.isPending,
                      }}
                      userId={user.account.id}
                    />
                  </motion.div>

                  <motion.div variants={item}>
                    <UserRoles
                      user={user}
                      onAddRole={(role) => addRoleMutation.mutate(role)}
                      onRemoveRole={(role) => removeRoleMutation.mutate(role)}
                      isLoading={addRoleMutation.isPending || removeRoleMutation.isPending}
                    />
                  </motion.div>

                  <motion.div variants={item}>
                    <UserForms
                      emailForm={emailForm}
                      dataForm={dataForm}
                      onEmailSubmit={(data) => emailMutation.mutate(data)}
                      onDataSubmit={(data) => dataMutation.mutate(data)}
                      currentEmail={user.account.email}
                      isLoading={{
                        email: emailMutation.isPending,
                        data: dataMutation.isPending,
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )
        }}
      />
    </div>
  )
}