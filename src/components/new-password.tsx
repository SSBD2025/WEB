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
import { PasswordInput } from "@/components/ui/password-input";
import { useTranslation } from "react-i18next";
import { usePasswordReset } from "@/hooks/usePasswordReset.ts";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { RequiredFormLabel } from "./ui/requiredLabel";

export default function ResetPassword() {
  const { t } = useTranslation();
  const passwordResetMutation = usePasswordReset();
  const { token } = useParams<{ token: string }>();

  const formSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: t("password_reset.new.too_short") })
        .max(60, { message: t("password_reset.new.too_long") })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()]).{8,60}$/, {
          message: t("password_reset.new.regex_fail"),
        }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("password_reset.new.not_match"),
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      passwordResetMutation.mutate(
        {
          body: {
            password: values.password,
          },
          token: token!,
        },
        {
          onSuccess: async () => {
            toast.success(t("password_reset.new.toasts.reset_success"));
          },
          onError: async (error) => {
            const err = error as AxiosError;
            const status = err.response?.status;
            const errorBody = err.response?.data;
            if (status === 400) {
              if (errorBody)
                form.setError("password", {
                  message: t("password_reset.requests.404_not_found"),
                });
            } else {
              form.setError("root", {
                message: t("password_reset.requests.error_other", {
                  message: error.message,
                }),
              });
            }
            console.error(
              t("password_reset.new.reset_error", { error }),
              error
            );
            toast.error(t("password_reset.new.toasts.reset_error"));
          },
        }
      );

      toast.success(t("password_reset.new.toasts.reset_success"));
    } catch (error) {
      console.error(t("password_reset.new.reset_error", { error }), error);
      toast.error(t("password_reset.new.toasts.reset_error"));
    }
  }

  return (
    <div className="flex min-h-[50vh] h-full w-full items-center justify-center px-4">
      {/*<Card className="mx-auto max-w-sm">*/}
      <Card className="mx-auto max-w-lg w-full p-8">
        <CardHeader>
          <CardTitle className="text-2xl">
            {t("password_reset.header")}
          </CardTitle>
          <CardDescription>
            {t("password_reset.new.enter_password")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {/* New Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <RequiredFormLabel htmlFor="password">
                        {t("password_reset.new.new_password")}
                      </RequiredFormLabel>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder="********"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <RequiredFormLabel htmlFor="confirmPassword">
                        {t("password_reset.new.confirm_password")}
                      </RequiredFormLabel>
                      <FormControl>
                        <PasswordInput
                          id="confirmPassword"
                          placeholder="********"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  {t("password_reset.new.reset_password")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
