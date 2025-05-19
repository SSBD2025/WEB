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
import { useChangeMePassword } from "@/hooks/useChangeMePassword";
import { useTranslation } from "react-i18next";
import { useState } from "react";
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
import { passwordSchema } from "@/schemas/admin/userForms.schema";
import { RequiredFormLabel } from "@/components/ui/requiredLabel";

export function ChangePasswordForm() {
  const { t } = useTranslation();
  const updateMePasswordMutation = useChangeMePassword();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<{
    oldPassword?: string;
    newPassword?: string;
  } | null>(null);

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof passwordSchema>) {
    setPendingData(values);
    setIsPasswordDialogOpen(true);
  }

  const confirmPasswordChange = () => {
    if (pendingData && pendingData.oldPassword && pendingData.newPassword) {
      updateMePasswordMutation.mutate(
        {
          oldPassword: pendingData.oldPassword,
          newPassword: pendingData.newPassword,
        },
        {}
      );
      setIsPasswordDialogOpen(false);
      setPendingData(null);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <RequiredFormLabel>
                  {t("profile.fields.oldPassword")}
                </RequiredFormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("profile.fields.oldPassword")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <RequiredFormLabel>
                  {t("profile.fields.newPassword")}
                </RequiredFormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("profile.fields.newPassword")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <RequiredFormLabel>
                  {t("profile.fields.confirmPassword")}
                </RequiredFormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("profile.fields.confirmPassword")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {t("common.save")}
          </Button>
        </form>
      </Form>
      <AlertDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("profile.fields.confirm_password_change_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("profile.fields.confirm_password_change_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("admin.user_account.forms.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmPasswordChange}>
              {t("profile.fields.change_password_button")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
export default ChangePasswordForm;
