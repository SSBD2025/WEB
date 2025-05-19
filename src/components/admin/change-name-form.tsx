import type { UseFormReturn } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RequiredFormLabel } from "@/components/ui/requiredLabel";

type ChangeNameFormProps = {
  form: UseFormReturn<{ firstName: string; lastName: string }>;
  onSubmit: (data: { firstName: string; lastName: string }) => void;
  isLoading: boolean;
};

export default function ChangeNameForm({
  form,
  onSubmit,
  isLoading,
}: ChangeNameFormProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin.user_account.forms.personal_data")}</CardTitle>
        <CardDescription>
          {t("admin.user_account.forms.confirm_data_change_description")}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                rules={{
                  required: t("admin.user_account.forms.first_name_required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <RequiredFormLabel htmlFor="firstName" >
                      {t("admin.user_account.forms.first_name")}
                    </RequiredFormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("admin.user_account.forms.first_name")}
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                rules={{
                  required: t("admin.user_account.forms.last_name_required"),
                }}
                render={({ field }) => (
                  <FormItem>
                    <RequiredFormLabel htmlFor="lastName" >
                      {t("admin.user_account.forms.last_name")}
                    </RequiredFormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("admin.user_account.forms.last_name")}
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <User className="h-4 w-4" />
              {t("admin.user_account.forms.save_personal_data")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
