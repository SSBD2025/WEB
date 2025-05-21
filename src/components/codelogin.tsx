import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";
import { RequiredFormLabel } from "./ui/requiredLabel";
import { useCodelogin } from "@/hooks/useCodelogin.ts";
import ROUTES from "@/constants/routes.ts";
import { useNavigate } from "react-router";
import { queryClient } from "@/lib/queryClient.ts";
import { CURRENT_USER_QUERY_KEY } from "@/hooks/useCurrentUser.ts";

export default function Codelogin() {
  const { t } = useTranslation();
  const codeloginMutation = useCodelogin();
  const navigate = useNavigate();

  const formSchema = z.object({
    value: z.string().length(10, t("code.validation")),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      codeloginMutation.mutate(values, {
        onSuccess: async (data) => {
          localStorage.setItem("token", data.value);
          toast.success(t("login.login_successful"));
          queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
          navigate(ROUTES.HOME);
        },
        onError: (error) => {
          const err = error as AxiosError;
          const status = err.response?.status;
          if (status === 401) {
            form.setError("value", {
              message: t("code.error.code_invalid"),
            });
          } else {
            form.setError("root", {
              message: t("code.error.other", {
                message: error.message,
              }),
            });
          }
        },
      });
    } catch (error) {
      console.error(
        t("password_reset.password_reset_email_error", { error }),
        error
      );
      toast.error(t("password_reset.toasts.password_reset_email_error"));
    }
  }

  return (
    <div className="flex min-h-[40vh] h-1/2 w-1/2 items-center justify-center px-4">
      <Card className="w-full max-w-lg p-8">
        <CardHeader>
          <CardTitle className="text-2xl">{t("code.title")}</CardTitle>
          <CardDescription>{t("code.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <RequiredFormLabel>
                        {t("admin.user_account.user_data.email")}
                      </RequiredFormLabel>
                      {/*internacjonalizacja tego calego*/}
                      <FormControl>
                        <Input
                          id="value"
                          placeholder={t("code.placeholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {t("code.button")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
