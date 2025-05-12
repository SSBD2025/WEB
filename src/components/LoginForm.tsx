import { Button } from "./ui/button";
import {Input} from "./ui/input";
import {useNavigate} from "react-router";
import ROUTES from "@/constants/routes.ts";
import {useLogin} from "@/hooks/useLogin.ts";
import {LoginRequest} from "@/types/login";
import { useForm } from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {AxiosError} from "axios";
import { RequiredFormLabel } from "@/components/ui/requiredLabel"

const LoginForm = () => {
    const navigate = useNavigate();
    const loginMutation = useLogin();

    const form = useForm<LoginRequest>({
        defaultValues: {
            login: "",
            password: "",
        },
    });

    const onSubmit = (values: LoginRequest) => {
        loginMutation.mutate(values, {
            onSuccess: () => {
                navigate(ROUTES.HOME);
            },
            onError: (error) => {
                const err = error as AxiosError;
                const status = err.response?.status;
                if (status === 401) {
                    form.setError("password", {
                        message: "Incorrect password"
                    })
                } else if (status === 404) {
                    form.setError("login", {
                        message: "User does not exist"
                    })
                } else {
                    form.setError("root", {
                        message: `Login failed: ${error.message}`,
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
                        rules={{
                            required: "Login is required",
                            minLength: { value: 4, message: "Login must be at least 4 characters" },
                            maxLength: { value: 50, message: "Login must be at most 50 characters" },
                        }}
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
                        rules={{
                            required: "Password is required",
                            minLength: { value: 8, message: "Password must be at least 8 characters" },
                            maxLength: { value: 60, message: "Password must be at most 60 characters" },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <RequiredFormLabel>Password</RequiredFormLabel>
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
                            Sign In
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default LoginForm;