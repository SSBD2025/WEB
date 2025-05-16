'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {useTranslation} from "react-i18next";
import {usePasswordResetRequest} from "@/hooks/usePasswordReset.ts";
import {AxiosError} from "axios";



export default function ForgetPasswordPreview() {
    const { t } = useTranslation();
    const passwordResetMutation = usePasswordResetRequest();

    const formSchema = z.object({
        email: z.string().email({ message: t("invalid_email") }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            passwordResetMutation.mutate(values, {
                onSuccess: async () => {
                    toast.success(t("password_reset.toasts.password_reset_email_sent"))
                },
                onError: (error) => {
                    const err = error as AxiosError;
                    const status = err.response?.status;
                    if (status === 404) {
                        form.setError("email", {
                            message: t("password_reset.requests.404_not_found")
                        })
                    } else {
                        form.setError("root", {
                            message: t('password_reset.requests.error_other', { message: error.message }),
                        })
                    }
                }
                }
            )
            console.log(values)

        } catch (error) {
            console.error(t("password_reset.password_reset_email_error", {error}), error)
            toast.error(t("password_reset.toasts.password_reset_email_error"))
        }
    }

    return (
        <div className="flex min-h-[40vh] h-1/2 w-1/2 items-center justify-center px-4">
            <Card className="w-full max-w-lg p-8">
                <CardHeader>
                    <CardTitle className="text-2xl">{t("password_reset.header")}</CardTitle>
                    <CardDescription>{t("password_reset.description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-4">
                                {/* Email Field */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="grid gap-2">
                                            <FormLabel htmlFor="email">{t("admin.user_account.user_data.email")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    placeholder="johndoe@mail.com"
                                                    type="email"
                                                    autoComplete="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">
                                    {t("password_reset.button")}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
