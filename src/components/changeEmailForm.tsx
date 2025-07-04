import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import {
  useChangeMeEmail,
  useResendEmailChangeEmail,
} from "@/hooks/useChangeMeEmail";
import { useTranslation } from "react-i18next";
import { emailSchema } from "@/schemas/admin/userForms.schema";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RequiredFormLabel } from "@/components/ui/requiredLabel";

export function ChangeEmailForm() {
  const { t } = useTranslation();
  const updateMeEmailMutation = useChangeMeEmail();
  const resendEmailMutation = useResendEmailChangeEmail();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isEmailResendOpen, setIsEmailResendOpen] = useState(false);
  const [pendingData, setPendingData] = useState<{ email?: string } | null>(
    null
  );

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const form = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof emailSchema>) {
    setPendingData(values);
    setIsEmailDialogOpen(true);
  }

  const confirmEmailChange = () => {
    if (pendingData && pendingData.email) {
      updateMeEmailMutation.mutate({ email: pendingData.email }, {});
      setIsEmailResendOpen(true);
      setIsEmailDialogOpen(false);
      setPendingData(null);
      setResendCooldown(120);
    }
  };

  const handleResendEmail = () => {
    if (resendCooldown === 0) {
      resendEmailMutation.mutate();
      setResendCooldown(120);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <RequiredFormLabel htmlFor="email">
                  {t("profile.fields.email")}
                </RequiredFormLabel>
                <FormControl>
                  <Input placeholder={t("profile.fields.email")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isEmailResendOpen && (
            <Button type="submit" className="w-full">
              {t("common.save")}
            </Button>
          )}
        </form>
      </Form>
      {isEmailResendOpen && (
        <Button
          className="w-full mt-4"
          onClick={handleResendEmail}
          disabled={resendCooldown > 0}
        >
          {resendCooldown > 0
            ? `${t("profile.fields.resend_email")} (${resendCooldown}s)`
            : t("profile.fields.resend_email")}
        </Button>
      )}
      <AlertDialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.user_account.forms.confirm_email_change_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("profile.fields.confirm_email_change_description", {
                email: pendingData?.email,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("admin.user_account.forms.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmEmailChange}>
              {t("admin.user_account.forms.change_email_button")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ChangeEmailForm;
