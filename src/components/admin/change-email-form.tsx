import type { UseFormReturn } from "react-hook-form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Mail } from "lucide-react"
import { useTranslation } from "react-i18next"

type ChangeEmailFormProps = {
  form: UseFormReturn<{ email: string }>
  onSubmit: (data: { email: string }) => void
  currentEmail: string
  isLoading: boolean
}

export default function ChangeEmailForm({ form, onSubmit, currentEmail, isLoading }: ChangeEmailFormProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin.user_account.forms.change_email")}</CardTitle>
        <CardDescription>
          {t("admin.user_account.forms.current")} <span className="font-medium">{currentEmail}</span>
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: t("admin.user_account.forms.email_required"),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t("admin.user_account.forms.email_invalid"),
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("admin.user_account.forms.new_email")}</FormLabel>
                  <FormControl>
                    <Input placeholder="nowy@email.com" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Mail className="h-4 w-4" />
              {t("admin.user_account.forms.change_email")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
