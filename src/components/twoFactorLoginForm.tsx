import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { use2faLogin } from "@/hooks/useLogin";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useEffect } from "react";
import ROUTES from "@/constants/routes.ts";
import {t} from "i18next";

interface TwoFactorFormValues {
    code: string;
}

const TwoFactorLoginForm = () => {
    const navigate = useNavigate();
    const twoFactorMutation = use2faLogin();

    const form = useForm<TwoFactorFormValues>({
        defaultValues: {
            code: "",
        },
    });

    const onSubmit = (values: TwoFactorFormValues) => {
        const login = localStorage.getItem("2fa-login");

        if (!login) {
            return;
        }

        twoFactorMutation.mutate(
            { login, code: values.code },
            {
                onSuccess: () => {
                    localStorage.removeItem("2fa-login");
                    navigate(ROUTES.HOME);
                }
            }
        );
    };

    useEffect(() => {
        if (!localStorage.getItem("2fa-login")) {
            navigate(ROUTES.LOGIN);
        }
    }, [navigate]);

    return (
        <div className="max-w-md mx-auto mt-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="code"
                        rules={{
                            required: t("2fa.error.code_required"),
                            minLength: { value: 8, message: t("2fa.error.code_length") },
                            maxLength: { value: 8, message: t("2fa.error.code_length") },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-center">
                        <Button type="submit" className="w-1/2">
                            {t("2fa.submit")}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default TwoFactorLoginForm;
