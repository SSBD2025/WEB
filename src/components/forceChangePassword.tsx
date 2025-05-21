import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForceChangePassword } from "@/hooks/useForceChangePassword";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RequiredFormLabel } from "@/components/ui/requiredLabel";
import ROUTES from "@/constants/routes";
import {Card, CardContent, CardHeader} from "@/components/ui/card.tsx";



type ForceChangePasswordFormProps = {
    login: string;
    onSuccess?: () => void;
};

export function ForceChangePasswordForm({ login, onSuccess }: ForceChangePasswordFormProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const forceChangePasswordMutation = useForceChangePassword();
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [pendingData, setPendingData] = useState<{
        oldPassword?: string;
        newPassword?: string;
    } | null>(null);


    const passwordSchema = z
        .object({
            oldPassword: z.string().min(1, { message: t("force_change_password.old_password.too_short")} ),
            newPassword: z.string().min(8, { message: t("force_change_password.new_password.too_short") }),
            confirmPassword: z.string(),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
            message: t("force_change_password.new_password.not_match"),
            path: ["confirmPassword"],
        });

    const form = useForm({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        resolver: zodResolver(passwordSchema),
    });

    function onSubmit(values: z.infer<typeof passwordSchema>) {
        setPendingData({
            oldPassword: values.oldPassword,
            newPassword: values.newPassword
        });
        setIsPasswordDialogOpen(true);
    }

    const confirmPasswordChange = () => {
        if (pendingData && pendingData.oldPassword && pendingData.newPassword) {
            forceChangePasswordMutation.mutate(
                {
                    login: login,
                    oldPassword: pendingData.oldPassword,
                    newPassword: pendingData.newPassword,
                },
                {
                    onSuccess: () => {
                        setIsPasswordDialogOpen(false);
                        setPendingData(null);

                        if (typeof onSuccess === 'function') {
                            onSuccess();
                        } else {
                            navigate(ROUTES.HOME);
                        }
                    }
                }
            );
        }
    };
    return (
        <Card>
            <CardHeader className="space-y-1">
                <h1 className="text-2xl font-bold text-center">{t("force_change_password.header")}</h1>
                <p className="text-center">
                    {t("force_change_password.info")}
                </p>
            </CardHeader>
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="oldPassword"
                            render={({field}) => (
                                <FormItem>
                                    <RequiredFormLabel htmlFor="oldPassword">
                                        {t("profile.fields.oldPassword")}
                                    </RequiredFormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={t("profile.fields.oldPassword")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <RequiredFormLabel htmlFor="newPassword">
                                        {t("profile.fields.newPassword")}
                                    </RequiredFormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={t("profile.fields.newPassword")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <RequiredFormLabel htmlFor="confirmPassword">
                                        {t("profile.fields.confirmPassword")}
                                    </RequiredFormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder={t("profile.fields.confirmPassword")}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            {t("common.save")}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <AlertDialog
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t("profile.fields.confirm_password_change_title")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("profile.fields.confirm_password_change_description")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t("admin.user_account.forms.cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmPasswordChange}>
                            {t("profile.fields.change_password_button")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

export default ForceChangePasswordForm;
