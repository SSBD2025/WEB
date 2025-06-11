import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer, ChartTooltip,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Activity, Heart, Droplets } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useGetSurveys } from "@/hooks/useGetSyrveys";
import { useTranslation } from "react-i18next";

type RawSurvey = {
    id: string;
    version: number;
    clientId: string;
    weight?: number;
    bloodPressure?: string;
    bloodSugarLevel?: number;
    measurementDate: string;
};

const xAxis = (
    <XAxis
        dataKey="timestamp"
        type="number"
        domain={["dataMin", "dataMax"]}
        tickFormatter={(value) =>
            new Date(value).toLocaleDateString("pl-PL", {
                month: "short",
                day: "numeric",
            })
        }
        tickLine={false}
        axisLine={false}
        tickMargin={8}
    />
);

export default function MedicalCharts() {
    const { clientId } = useParams<{ clientId: string }>();
    const [chartType, setChartType] = useState<ChartType>("weight");
    const { t } = useTranslation();

    const chartButtons = [
        { type: "weight", label: t("charts.weight") },
        { type: "blood_pressure", label: t("charts.blood_pressure") },
        { type: "blood_sugar", label: t("charts.blood_sugar") },
    ] as const;

    type ChartType = (typeof chartButtons)[number]["type"];

    const chartConfigs = {
        weight: {
            title: t("charts.weight"),
            icon: Activity,
            color: "#4f46e5",
            dataKey: "weight",
            unit: "kg",
            config: {
                weight: {
                    label: t("charts.weight"),
                    color: "#4f46e5",
                },
            },
        },
        blood_pressure: {
            title: t("charts.blood_pressure"),
            icon: Heart,
            dataKey: ["systolic", "diastolic"],
            unit: "mmHg",
            color: "#dc2626",
            config: {
                systolic: {
                    label: t("charts.systolic"),
                    color: "#dc2626",
                },
                diastolic: {
                    label: t("charts.diastolic"),
                    color: "#16a34a",
                },
            },
        },
        blood_sugar: {
            title: t("charts.blood_sugar"),
            icon: Droplets,
            color: "#0ea5e9",
            dataKey: "bloodSugar",
            unit: "mg/dL",
            config: {
                bloodSugar: {
                    label: t("charts.blood_sugar"),
                    color: "#0ea5e9",
                },
            },
        },
    } as const;

    const { data, isLoading } = useGetSurveys(clientId);
    const surveysRaw = data?.content ?? [];

    const chartData = useMemo(() => {
        if (!surveysRaw || surveysRaw.length === 0) return [];

        const sorted = [...surveysRaw].sort(
            (a, b) => new Date(a.measurementDate).getTime() - new Date(b.measurementDate).getTime()
        );

        return sorted.map((item: RawSurvey) => {
            const [systolic, diastolic] = item.bloodPressure
                ? item.bloodPressure.split(/[-/]/).map((v) => Number(v.trim()))
                : [undefined, undefined];

            const dateObj = new Date(item.measurementDate);
            return {
                timestamp: dateObj.getTime(),
                date: dateObj.toLocaleDateString("pl-PL", {
                    month: "short",
                    day: "numeric",
                }),
                weight: item.weight,
                systolic,
                diastolic,
                bloodSugar: item.bloodSugarLevel,
            };
        });
    }, [surveysRaw]);

    const currentConfig = chartConfigs[chartType];
    const Icon = currentConfig.icon;

    const renderChart = () => {
        if (chartType === "blood_pressure") {
            const bpConfig = currentConfig.config as typeof chartConfigs.blood_pressure.config;

            return (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        {xAxis}
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={["dataMin - 10", "dataMax + 10"]} />
                        <Line
                            type="monotone"
                            dataKey="systolic"
                            stroke={bpConfig.systolic.color}
                            strokeWidth={2}
                            dot={{ fill: bpConfig.systolic.color, strokeWidth: 2, r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="diastolic"
                            stroke={bpConfig.diastolic.color}
                            strokeWidth={2}
                            dot={{ fill: bpConfig.diastolic.color, strokeWidth: 2, r: 4 }}
                        />
                        <ChartTooltip
                            content={({ payload }) => {
                                if (!payload?.length) return null;
                                const data = payload[0].payload;
                                return (
                                    <div className="p-3 border border-gray-200 rounded shadow-md">
                                        <p className="font-medium mb-1">{`${t("charts.date")}: ${data.date}`}</p>
                                        {payload.map((entry, index) => (
                                            <p key={index} style={{ color: entry.color }}>
                                                {entry.dataKey === 'systolic' ? t("charts.systolic") : t("charts.diastolic")}: {entry.value} mmHg
                                            </p>
                                        ))}
                                    </div>
                                );
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            );
        }

        const otherConfig = currentConfig.config as Record<string, { color: string }>;
        const dataKey = Array.isArray(currentConfig.dataKey)
            ? currentConfig.dataKey[0]
            : currentConfig.dataKey;
        const lineColor = otherConfig[dataKey]?.color ?? "#000";

        return (
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    {xAxis}
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={["dataMin - 5", "dataMax + 5"]} />
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke={lineColor}
                        strokeWidth={2}
                        dot={{ fill: lineColor, strokeWidth: 2, r: 4 }}
                    />
                    <ChartTooltip
                        content={({ payload }) => {
                            if (!payload?.length) return null;
                            const data = payload[0].payload;
                            const value = payload[0].value;
                            const unit = currentConfig.unit;

                            return (
                                <div className="p-3 border border-gray-200 rounded shadow-md">
                                    <p className="font-medium mb-1">{`${t("charts.date")}: ${data.date}`}</p>
                                    <p style={{ color: payload[0].color }}>
                                        {currentConfig.title}: {value} {unit}
                                    </p>
                                </div>
                            );
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        );
    };

    if (isLoading) return <Spinner />;

    if (!chartData.length) {
        return (
            <div className="p-6 flex flex-col items-center gap-6">
                <Card className="p-6 flex justify-center items-center min-h-[400px] max-w-[800px] w-full">
                    <p className="text-muted-foreground">{t("charts.no_data")}</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 flex flex-col items-center gap-6">
            <Card className="p-4 flex justify-center max-w-[800px] w-full overflow-x-auto">
                <div className="flex gap-2 justify-center w-full max-w-full">
                    {chartButtons.map((btn) => (
                        <Button
                            key={btn.type}
                            variant={btn.type === chartType ? "default" : "outline"}
                            onClick={() => setChartType(btn.type)}
                        >
                            {btn.label}
                        </Button>
                    ))}
                </div>
            </Card>

            <Card className="max-w-[800px] w-full">
                <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                    <Icon className="h-5 w-5" />
                    <CardTitle className="text-lg">{currentConfig.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={currentConfig.config} className="min-h-[400px] w-full">
                        {renderChart()}
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}