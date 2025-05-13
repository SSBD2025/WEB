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

const formSchema = z
    .object({
        firstName: z.string().min(2, "First name must be at least 2 characters").max(50, "First name must be at most 50 characters"),
        lastName: z.string().min(2, "Last name must be at least 2 characters").max(50, "Last name must be at most 50 characters"),
        login: z.string().min(4, "Username must be at least 4 characters").max(50, "Username must be at most 50 characters"),
        email: z.string().email("Please enter a valid email address").max(50, "Email must be at most 50 characters"),
        password: z.string().min(8, "Password must be at least 8 characters").max(60, "Password must be at most 60 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

type UserType = "client" | "dietician"

interface RegistrationFormProps {
    userType: UserType
}

export function RegistrationForm({ userType }: RegistrationFormProps) {
    const registerMutation = useRegisterUser(userType)
    const [browserLanguage, setBrowserLanguage] = useState("en_EN")

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
                <h2 className="text-2xl font-bold text-center">Create an account</h2>
                <p className="text-center">Enter your information to get started</p>
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
                                        <RequiredFormLabel>First Name</RequiredFormLabel>
                                        <FormControl>
                                            <Input placeholder="First name" {...field} />
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
                                        <RequiredFormLabel>Last Name</RequiredFormLabel>
                                        <FormControl>
                                            <Input placeholder="Last name" {...field} />
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
                                    <RequiredFormLabel>Username</RequiredFormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} />
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
                                    <RequiredFormLabel>Email</RequiredFormLabel>
                                    <FormControl>
                                        <Input placeholder="Email address" type="email" {...field} />
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
                                    <RequiredFormLabel>Password</RequiredFormLabel>
                                    <FormControl>
                                        <Input placeholder="Password" type="password" {...field} />
                                    </FormControl>
                                    <FormDescription>At least 8 characters</FormDescription>
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
                                    <RequiredFormLabel>Confirm Password</RequiredFormLabel>
                                    <FormControl>
                                        <Input placeholder="Confirm Password" type="password" {...field} />
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
                            {registerMutation.isPending ? "Creating account..." : "Register"}
                        </Button>
                    </form>
                </Form>
            </CardContent>

            {/* Footer */}
            <CardFooter className="flex justify-center border-t p-6">
                <p className="text-sm text-gray-600">
                    Already have an account?
                    <Link to={ROUTES.LOGIN} className="text-blue-600 hover:text-blue-800 font-medium ml-1">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}
