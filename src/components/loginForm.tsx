import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin, use2faLogin } from "@/hooks/useLogin";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { RequiredFormLabel } from "@/components/ui/requiredLabel";
import { AxiosError } from "axios";
import ROUTES from "@/constants/routes";
import { t } from "i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, twoFactorSchema } from "@/schemas/loginForm.schema";
import { z } from "zod";

type FormSchema = z.infer<typeof loginSchema> & Partial<Pick<z.infer<typeof twoFactorSchema>, "code">>;

const LoginForm = () => {
    const navigate = useNavigate();
    const loginMutation = useLogin();
    const twoFactorMutation = use2faLogin();
    const isSubmitting = loginMutation.isPending || twoFactorMutation.isPending;

    const [is2faRequired, setIs2faRequired] = useState(false);
    const [access2FAToken, setAccess2FAToken] = useState("");
    const [schema, setSchema] = useState(loginSchema);

    const form = useForm<FormSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            login: "",
            password: "",
            code: "",
        },
    });

    useEffect(() => {
        if (is2faRequired) {
            form.resetField("code");
            setSchema(twoFactorSchema);
        } else {
            setSchema(loginSchema);
        }
    }, [is2faRequired, form]);

    const onSubmit = (values: FormSchema) => {
        if (is2faRequired) {
            if (!access2FAToken) {
                form.setError("root", {
                });
                return;
            }

            twoFactorMutation.mutate(
                { code: values.code || "", access2FAToken },
                {
                    onSuccess: () => {
                        setIs2faRequired(false);
                        setAccess2FAToken("");
                        navigate(ROUTES.HOME);
                    },
                    onError: () => {
                        form.setError("code", {
                            message: t("2fa.error.code_invalid"),
                        });
                    },
                }
            );
        } else {
            loginMutation.mutate(
                { login: values.login, password: values.password },
                {
                    onSuccess: (data) => {
                        if (data?.value) {
                            const payload = JSON.parse(atob(data.value.split('.')[1]));
                            if (payload.typ === "access2fa") {
                                setAccess2FAToken(data.value);
                                setIs2faRequired(true);
                            } else {
                                navigate(ROUTES.HOME);
                            }
                        }
                    },
                    onError: (error) => {
                        const err = error as AxiosError;
                        const status = err.response?.status;

                        if (status === 401) {
                            form.setError("password", {
                                message: t("login.error.password_error"),
                            });
                        } else if (status === 404) {
                            form.setError("login", {
                                message: t("login.error.login_error"),
                            });
                        } else {
                            form.setError("root", {
                                message: t("login.error.login_failed", { message: error.message }),
                            });
                        }
                    },
                }
            );
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="login"
                        render={({ field }) => (
                            <FormItem>
                                <RequiredFormLabel>Login</RequiredFormLabel>
                                <FormControl>
                                    <Input type="text" {...field} disabled={is2faRequired} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <RequiredFormLabel>{t("login.password")}</RequiredFormLabel>
                                <FormControl>
                                    <Input type="password" {...field} disabled={is2faRequired} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {is2faRequired && (
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <RequiredFormLabel>{t("2fa.label")}</RequiredFormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {form.formState.errors.root && (
                        <p className="text-red-600 text-center text-sm">{form.formState.errors.root.message}</p>
                    )}

                    <div className="flex justify-center">
                        <Button type="submit" className="w-1/2" disabled={isSubmitting}>
                            {isSubmitting
                                ? t("login.loading")
                                : is2faRequired
                                    ? t("2fa.submit")
                                    : t("login.sign_in")}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default LoginForm;