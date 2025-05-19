import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import {useEffect, useState} from "react";
import {useRegisterUser} from "@/hooks/useRegisterUser"
import { RequiredFormLabel } from "@/components/ui/requiredLabel"
import { Link } from "react-router"
import ROUTES from "@/constants/routes"
import {RegisterUserRequest} from "@/types/register_user";
import {useTranslation} from "react-i18next";



type UserType = "client" | "dietician" | "admin"

interface RegistrationFormProps {
    userType: UserType
}

export function RegistrationForm({ userType }: RegistrationFormProps) {
    const registerMutation = useRegisterUser(userType)
    const [browserLanguage, setBrowserLanguage] = useState("en_EN")
    const {t} = useTranslation()

    const formSchema = z
        .object({
            firstName: z.string().min(2, t("register.firstname.too_short")).max(50, t("register.firstname.too_long")),
            lastName: z.string().min(2, t("register.lastname.too_short")).max(50, t("register.lastname.too_long")),
            login: z.string().min(4, t("register.login.too_short")).max(50, t("register.login.too_long")),
            email: z.string().email(t("register.email.invalid")).max(50, t("register.email.too_long")),
            password: z.string().min(8, t("register.password.too_short")).max(60, t("register.password.too_long")),
            confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("register.password.not_match"),
            path: ["confirmPassword"],
        })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            login: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    useEffect(() => {
        if (typeof window !== "undefined") {
            const navLang = navigator.language || ""

            if (navLang.startsWith("pl")) {
                setBrowserLanguage("pl_PL")
            } else {
                setBrowserLanguage("en_EN")
            }
        }
    }, [])

    function onSubmit(values: z.infer<typeof formSchema>) {
        const account = {
            login: values.login,
            password: values.password,
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            language: browserLanguage,
        }

        const payload = {
            account,
            [userType]: {},
        }

        registerMutation.mutate(payload as RegisterUserRequest)
    }

    return (
        <Card >
            {/* Header */}
            <CardHeader className="space-y-1">
                <h2 className="text-2xl font-bold text-center">{t("register.create_account")}</h2>
                <p className="text-center">{t("register.info")}</p>
            </CardHeader>

            {/* Form */}
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* First Name and Last Name */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <RequiredFormLabel>{t("register.firstname.field")}</RequiredFormLabel>
                                        <FormControl>
                                            <Input placeholder={t("register.firstname.field")} {...field} />
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
                                        <RequiredFormLabel>{t("register.lastname.field")}</RequiredFormLabel>
                                        <FormControl>
                                            <Input placeholder={t("register.lastname.field")} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Username */}
                        <FormField
                            control={form.control}
                            name="login"
                            render={({ field }) => (
                                <FormItem>
                                    <RequiredFormLabel>{t("register.login.field")}</RequiredFormLabel>
                                    <FormControl>
                                        <Input placeholder={t("register.login.field")} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <RequiredFormLabel>{t("register.email.field")}</RequiredFormLabel>
                                    <FormControl>
                                        <Input placeholder={t("register.email.field")} type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <RequiredFormLabel>{t("register.password.field")}</RequiredFormLabel>
                                    <FormControl>
                                        <Input placeholder={t("register.password.field")} type="password" {...field} />
                                    </FormControl>
                                    <FormDescription>{t("register.password.info")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <RequiredFormLabel>{t("register.confirm_password.field")}</RequiredFormLabel>
                                    <FormControl>
                                        <Input placeholder={t("register.confirm_password.field")} type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="w-full cursor-pointer"
                        >
                            {registerMutation.isPending ? t("register.creating") : t("register.register")}
                        </Button>
                    </form>
                </Form>
            </CardContent>

            {/* Footer */}
            <CardFooter className="flex justify-center border-t p-6">
                <p className="text-sm text-gray-600">
                    {t("register.have_account")}
                    <Link to={ROUTES.LOGIN} className="text-blue-600 hover:text-blue-800 font-medium ml-1">
                        {t("login.sign_in")}
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
