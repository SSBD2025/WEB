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
import { useChangeMeData } from "@/hooks/useChangeMeData";
import { useTranslation } from "react-i18next";
import { personalDataSchema } from "@/schemas/admin/userForms.schema";
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
import { RequiredFormLabel } from "@/components/ui/requiredLabel"

type ChangeDataFormProps = {
  firstName: string;
  lastName: string;
  lockToken: string;
};

export function ChangeDataForm({
  firstName,
  lastName,
  lockToken,
}: ChangeDataFormProps) {
  const { t } = useTranslation();
  const updateMeDataMutation = useChangeMeData();
  const [isDataDialogOpen, setIsDataDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<{
    firstName?: string;
    lastName?: string;
  } | null>(null);

  const form = useForm({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      firstName,
      lastName,
    },
  });

  function onSubmit(values: z.infer<typeof personalDataSchema>) {
    setPendingData(values);
    setIsDataDialogOpen(true);
  }

  const confirmDataChange = () => {
    if (pendingData && pendingData.firstName && pendingData.lastName) {
      updateMeDataMutation.mutate(
        {
          firstName: pendingData.firstName,
          lastName: pendingData.lastName,
          lockToken: lockToken,
        },
        {}
      );
      setIsDataDialogOpen(false);
      setPendingData(null);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <RequiredFormLabel htmlFor="firstName" >{t("profile.fields.firstName")}</RequiredFormLabel>
                <FormControl>
                  <Input
                    placeholder={t("profile.fields.firstName")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <RequiredFormLabel htmlFor="lastName" >{t("profile.fields.lastName")}</RequiredFormLabel>
                <FormControl>
                  <Input
                    placeholder={t("profile.fields.lastName")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {" "}
            {t("common.save")}{" "}
          </Button>
        </form>
      </Form>
      <AlertDialog open={isDataDialogOpen} onOpenChange={setIsDataDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("admin.user_account.forms.confirm_data_change_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("profile.fields.confirm_data_change_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("admin.user_account.forms.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDataChange}>
              {t("admin.user_account.forms.save_personal_data")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ChangeDataForm;
