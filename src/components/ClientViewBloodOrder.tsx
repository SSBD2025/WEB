import { useClientViewBloodTestOrder } from "@/hooks/useClientBloodTestReports.ts";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import axios from "axios";

export default function ClientViewBloodOrder() {
    const { data: order, status, error } = useClientViewBloodTestOrder();
    const [csvUrl, setCsvUrl] = useState<{ url: string; fileName: string } | null>(null);
    const [timezone, setTimezone] = useState<string>();

    useEffect(() => {
        const storedTz =
            localStorage.getItem("user-timezone") ||
            Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(storedTz);
        if (order?.parameters && order?.orderDate) {
            const parameters = Array.isArray(order.parameters)
                ? order.parameters.join("; ")
                : JSON.stringify(order.parameters);
            const csvHeader = "orderDate,description,parameters";
            const csvRow = `"${order.orderDate}",${order.description},"${parameters}"`;
            const csvContent = `${csvHeader}\n${csvRow}`;
            const blob = new Blob([csvContent], { type: "text/csv" });
            const date = new Date(order.orderDate);
            const fileNameDate = date.toISOString().replace(/[:.]/g, "-");
            const fileName = `blood_test_order_${fileNameDate}.csv`;
            const url = URL.createObjectURL(blob);
            setCsvUrl({ url, fileName });
            return () => URL.revokeObjectURL(url);
        }
    }, [order]);
    if (status === "pending") {
        return (
            <main className="flex-grow flex items-center justify-center">
                {t("common.loading")}
            </main>
        );
    }
    if (error) {
        if (axios.isAxiosError(error)) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "common.unexpected_error";
            if(message === "blood_test_order_not_found") {
                return (
                    <main className="flex-grow flex items-center justify-center text-center p-4">
                        <div className="max-w-md space-y-2">
                            <p className="text-lg font-semibold">{t(message)}</p>
                            <p className="text-sm text-muted-foreground">
                                {t("view_blood_order.nothing_to_do")}
                            </p>
                        </div>
                    </main>
                );
            }
            return (
                <main className="flex-grow flex items-center justify-center text-red-500 text-center p-4">
                    <div className="max-w-md space-y-2">
                        <p className="text-lg font-semibold">{t(message)}</p>
                    </div>
                </main>
            );
        }
    }
    if (!order || (!order.parameters && !order.orderDate)) {
        return (
            <main className="flex-grow flex items-center justify-center">
                {t("view_blood_order.noData")}
            </main>
        );
    }
    return (
        <main className="flex-grow flex flex-col items-center justify-start p-6 gap-6 max-w-4xl mx-auto">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        {t("view_blood_order.title")}
                    </CardTitle>
                    <CardDescription className="text-md text-muted-foreground">
                        {t("view_blood_order.information")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {order.orderDate && (
                            <div>
                                <Label className="text-sm text-muted-foreground">
                                    {t("view_blood_order.orderDate")}
                                </Label>
                                <p>{new Intl.DateTimeFormat("pl-PL", {
                                    timeZone: timezone,
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }).format(new Date(order?.orderDate.toString()))}</p>
                            </div>
                        )}
                        {order.description && (
                            <div>
                                <Label className="text-sm text-muted-foreground">
                                    {t("view_blood_order.description")}
                                </Label>
                                <p>{String(order.description)}</p>
                            </div>
                        )}
                    </div>
                    {order.parameters && (
                        <div>
                            <Label className="text-sm text-muted-foreground block mb-2">
                                {t("view_blood_order.parameters")}
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {Array.isArray(order.parameters)
                                    ? order.parameters.map((param, idx) => (
                                        <div key={idx} className="text-base">
                                            {param}
                                        </div>
                                    ))
                                    : <div>{String(order.parameters)}</div>}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            {csvUrl && (
                <a href={csvUrl.url} download={csvUrl.fileName}>
                    <Button>{t("common.exportCSV")}</Button>
                </a>
            )}
        </main>
    );
}
