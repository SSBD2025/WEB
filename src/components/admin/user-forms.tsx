import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Mail, User, Loader2, Save } from "lucide-react"
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
import type { PersonalDataFormValues, EmailFormValues } from "@/schemas/admin/userForms.schema"

interface UserFormsProps {
  emailForm: UseFormReturn<EmailFormValues>
  dataForm: UseFormReturn<PersonalDataFormValues>
  onEmailSubmit: (data: EmailFormValues) => void
  onDataSubmit: (data: PersonalDataFormValues) => void
  currentEmail: string
  isLoading: {
    email: boolean
    data: boolean
  }
}

export default function UserForms({
  emailForm,
  dataForm,
  onEmailSubmit,
  onDataSubmit,
  currentEmail,
  isLoading,
}: UserFormsProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("profile")
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [pendingData, setPendingData] = useState<{ firstName?: string; lastName?: string; email?: string } | null>(null)

  const handleNameSubmit = (data: PersonalDataFormValues) => {
    setPendingData(data)
    setIsNameDialogOpen(true)
  }

  const handleEmailSubmit = (data: EmailFormValues) => {
    setPendingData(data)
    setIsEmailDialogOpen(true)
  }

  const confirmNameChange = () => {
    if (pendingData && pendingData.firstName && pendingData.lastName) {
      onDataSubmit({
        firstName: pendingData.firstName,
        lastName: pendingData.lastName,
      })
      setIsNameDialogOpen(false)
      setPendingData(null)
    }
  }

  const confirmEmailChange = () => {
    if (pendingData && pendingData.email) {
      onEmailSubmit({ email: pendingData.email })
      setIsEmailDialogOpen(false)
      setPendingData(null)
    }
  }

  return (
    <>
      <Card>
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{t("admin.user_account.forms.personal_data")}</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{t("admin.user_account.forms.email_address")}</span>
            </TabsTrigger>
          </TabsList>

          <CardContent className="pt-6">
            <TabsContent value="profile" className="mt-0">
              <Form {...dataForm}>
                <form onSubmit={dataForm.handleSubmit(handleNameSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={dataForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("admin.user_account.forms.first_name")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                placeholder={t("admin.user_account.forms.first_name")}
                                className="pl-10"
                                disabled={isLoading.data}
                              />
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={dataForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("admin.user_account.forms.last_name")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                placeholder={t("admin.user_account.forms.last_name")}
                                className="pl-10"
                                disabled={isLoading.data}
                              />
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2"
                      disabled={isLoading.data}
                    >
                      {isLoading.data ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      {t("admin.user_account.forms.save_personal_data")}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="email" className="mt-0">
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>{t("admin.user_account.forms.new_email")}</FormLabel>
                          <span className="text-xs text-muted-foreground">
                            {t("admin.user_account.forms.current")} {currentEmail}
                          </span>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="nowy@email.com"
                              className="pl-10"
                              disabled={isLoading.email}
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2"
                      disabled={isLoading.email}
                    >
                      {isLoading.email ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                      {t("admin.user_account.forms.change_email")}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <AlertDialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.user_account.forms.confirm_data_change_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.user_account.forms.confirm_data_change_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("admin.user_account.forms.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmNameChange}>
              {t("admin.user_account.forms.save_changes")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("admin.user_account.forms.confirm_email_change_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("admin.user_account.forms.confirm_email_change_description", { email: pendingData?.email })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("admin.user_account.forms.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEmailChange}>
              {t("admin.user_account.forms.change_email_button")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}