import { Button } from "./ui/button";
import {Input} from "./ui/input";
import {useNavigate} from "react-router";
import ROUTES from "@/constants/routes.ts";
import {useLogin} from "@/hooks/useLogin.ts";
import { useForm } from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {AxiosError} from "axios";
import { RequiredFormLabel } from "@/components/ui/requiredLabel"
import {t} from "i18next"
import {loginSchema, LoginSchema} from "@/schemas/loginForm.schema";
import {zodResolver} from "@hookform/resolvers/zod";

const LoginForm = () => {
    const navigate = useNavigate();
    const loginMutation = useLogin();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            login: "",
            password: "",
        },
    });

    const onSubmit = (values: LoginSchema) => {
        loginMutation.mutate(values, {
            onSuccess: (data) => {
                if (data.is2fa) {
                    localStorage.setItem("2fa-login", values.login);
                    navigate(ROUTES.TWO_FACTOR);
                } else {
                    navigate(ROUTES.HOME);
                }
            },
            onError: (error) => {
                const err = error as AxiosError;
                const status = err.response?.status;
                if (status === 401) {
                    form.setError("password", {
                        message: t("login.error.password_error")
                    })
                } else if (status === 404) {
                    form.setError("login", {
                        message: t("login.error.login_error")
                    })
                } else {
                    form.setError("root", {
                        message: t('login.error.login_failed', { message: error.message }),
                    })
                }
            },
        });
    };

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="login"
                        render={({ field }) => (
                            <FormItem>
                                <RequiredFormLabel>Login</RequiredFormLabel>
                                <FormControl>
                                    <Input type="text" {...field} />
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
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {form.formState.errors.root && (
                        <p className="text-red-600 text-center text-sm">{form.formState.errors.root.message}</p>
                    )}

                    <div className="flex justify-center">
                        <Button type="submit" className="w-1/2">
                            {t("login.sign_in")}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default LoginForm;