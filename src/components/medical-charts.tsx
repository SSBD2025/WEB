import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  Activity,
  Heart,
  Droplets,
  Target,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Award,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useGetSurveys, useGetSurveysByDietician } from "@/hooks/useGetSurveys";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { GetPeriodicSurvey } from "@/types/periodic_survey";
import { Badge } from "./ui/badge";
import { useGetCurrentPyramidClient } from "@/hooks/useGetCurrentPyramidClient";
import { useGetCurrentPyramidByDietician } from "@/hooks/useGetCurrentPyramidByDietician";
import BackButton from "./shared/BackButton";
import ROUTES from "@/constants/routes";

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

interface MedicalChartsProps {
  userRole: "client" | "dietician";
}

interface ProgressMetric {
  label: string;
  field: keyof GetPeriodicSurvey;
  unit: string;
  startValue: number;
  currentValue: number;
  isLowerBetter: boolean;
  color: string;
}

export default function MedicalCharts({ userRole }: MedicalChartsProps) {
  const { clientId } = useParams<{ clientId: string }>();
  const [chartType, setChartType] = useState<ChartType>("weight");
  const { t } = useTranslation();
  const [timezone, setTimezone] = useState<string>();

  useEffect(() => {
    const storedTz =
      localStorage.getItem("user-timezone") ||
      Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(storedTz);
  }, []);

  const clientQuery = useGetSurveys(userRole === "client");
  const dieticianQuery = useGetSurveysByDietician(
    userRole === "dietician" ? clientId : undefined
  );
  const query = userRole === "client" ? clientQuery : dieticianQuery;
  const { data, isLoading } = query;
  const surveysRaw = useMemo(() => {
    return data?.content ?? [];
  }, [data]);

  const clientPyramidQuery = useGetCurrentPyramidClient(userRole === "client");
  const dieticianPyramidQuery = useGetCurrentPyramidByDietician(
    clientId,
    userRole === "dietician"
  );

  const query2 =
    userRole === "client" ? clientPyramidQuery : dieticianPyramidQuery;
  const { data: pyramidData, isLoading: isPyramidLoading } = query2;

  let baselineSurvey = null;
  let latestSurvey = null;

  for (const survey of surveysRaw) {
    const date = new Date(survey.measurementDate).getTime();

    if (
      !baselineSurvey ||
      date < new Date(baselineSurvey.measurementDate).getTime()
    ) {
      baselineSurvey = survey;
    }

    if (
      !latestSurvey ||
      date > new Date(latestSurvey.measurementDate).getTime()
    ) {
      latestSurvey = survey;
    }
  }

  const calculateMetrics = (): ProgressMetric[] => {
    const metrics: ProgressMetric[] = [];

    if (baselineSurvey.weight && latestSurvey.weight) {
      metrics.push({
        label: t("charts.weight"),
        field: "weight",
        unit: "kg",
        startValue: Number(baselineSurvey.weight),
        currentValue: Number(latestSurvey.weight),
        isLowerBetter: true,
        color: "#10b981",
      });
    }

    if (baselineSurvey.bloodSugarLevel && latestSurvey.bloodSugarLevel) {
      metrics.push({
        label: t("charts.blood_sugar"),
        field: "bloodSugarLevel",
        unit: "mg/dl",
        startValue: Number(baselineSurvey.bloodSugarLevel),
        currentValue: Number(latestSurvey.bloodSugarLevel),
        isLowerBetter: true,
        color: "#3b82f6",
      });
    }

    return metrics;
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat(
      localStorage.getItem("i18nextLng") || "pl-PL",
      {
        timeZone: timezone,
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    ).format(new Date(date));
  };

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

  const chartData = useMemo(() => {
    if (!surveysRaw || surveysRaw.length === 0) return [];

    const sorted = [...surveysRaw].sort(
      (a, b) =>
        new Date(a.measurementDate).getTime() -
        new Date(b.measurementDate).getTime()
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
      const bpConfig =
        currentConfig.config as typeof chartConfigs.blood_pressure.config;

      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            {xAxis}
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={["dataMin - 10", "dataMax + 10"]}
            />
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
                    <p className="font-medium mb-1">{`${t("charts.date")}: ${
                      data.date
                    }`}</p>
                    {payload.map((entry, index) => (
                      <p key={index} style={{ color: entry.color }}>
                        {entry.dataKey === "systolic"
                          ? t("charts.systolic")
                          : t("charts.diastolic")}
                        : {entry.value} mmHg
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

    const otherConfig = currentConfig.config as Record<
      string,
      { color: string }
    >;
    const dataKey = Array.isArray(currentConfig.dataKey)
      ? currentConfig.dataKey[0]
      : currentConfig.dataKey;
    const lineColor = otherConfig[dataKey]?.color ?? "#000";

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          {xAxis}
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={["dataMin - 5", "dataMax + 5"]}
          />
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
                  <p className="font-medium mb-1">{`${t("charts.date")}: ${
                    data.date
                  }`}</p>
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

  if (isLoading || isPyramidLoading) return <Spinner />;

  if (!baselineSurvey || !latestSurvey || !pyramidData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">
            {t("charts.no_data_to_analyze")}
          </h3>
          <p className="text-muted-foreground">
            {t("charts.no_data_to_analyze_description")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const metrics = calculateMetrics();

  if (!chartData.length) {
    return (
      <div className="p-6 flex flex-col items-center gap-6">
        <Card className="p-6 flex justify-center items-center min-h-[400px] max-w-[800px] w-full">
          <p className="text-muted-foreground">{t("charts.no_data")}</p>
        </Card>
      </div>
    );
  }

  const pyramidDate = new Date(pyramidData.timestamp);

  const daysSincePyramid = Math.floor(
    (new Date().getTime() - pyramidDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-7xl mx-auto p-4"
    >
      <BackButton
        route={
          userRole === "dietician"
            ? ROUTES.DIETICIAN_DASHBOARD
            : ROUTES.CLIENT_DASHBOARD
        }
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("charts.header")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("charts.description", { days: daysSincePyramid })}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t("charts.food_pyramid")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">
                {t("charts.name_of_pyramid")}
              </div>
              <div className="font-medium">{pyramidData.foodPyramid.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                {t("charts.assign_date")}
              </div>
              <div className="font-medium">
                {formatDate(pyramidData.timestamp)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                {t("charts.time_period")}
              </div>
              <div className="font-medium">
                {daysSincePyramid} {t("charts.days")}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metryki postępu */}
      <div className="grid md:grid-cols-2 gap-6">
        {metrics.map((metric, index) => {
          const change = metric.currentValue - metric.startValue;
          const isImprovement = metric.isLowerBetter ? change < 0 : change > 0;

          return (
            <motion.div
              key={metric.field}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{metric.label}</span>
                    <Badge variant={isImprovement ? "default" : "destructive"}>
                      {isImprovement ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {isImprovement
                        ? t("charts.improvement")
                        : t("charts.decline")}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {t("charts.start_value")}
                      </div>
                      <div className="text-2xl font-bold">
                        {metric.startValue} {metric.unit}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(baselineSurvey.measurementDate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {t("charts.current_value")}
                      </div>
                      <div className="text-2xl font-bold">
                        {metric.currentValue} {metric.unit}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(latestSurvey.measurementDate)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/** WYKRESY */}
      <div className="py-6 flex flex-col items-center gap-6">
        <Card className="py-4 flex justify-center w-full overflow-x-auto">
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

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <Icon className="h-5 w-5" />
            <CardTitle className="text-lg">{currentConfig.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={currentConfig.config}
              className="min-h-[400px] w-full"
            >
              {renderChart()}
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Podsumowanie postępów */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            {t("charts.summary")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">{t("charts.achievements")}</h4>
              <div className="space-y-2">
                {metrics.map((metric) => {
                  const change = metric.currentValue - metric.startValue;
                  const isImprovement = metric.isLowerBetter
                    ? change < 0
                    : change > 0;

                  if (isImprovement) {
                    return (
                      <div
                        key={metric.field}
                        className="flex items-center gap-2 text-green-600"
                      >
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm">
                          {metric.label}: {Math.abs(change).toFixed(1)}{" "}
                          {metric.unit}{" "}
                          {metric.isLowerBetter
                            ? t("charts.less")
                            : t("charts.more")}
                        </span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">
                {t("charts.fields_to_improve")}
              </h4>
              <div className="space-y-2">
                {metrics.map((metric) => {
                  const change = metric.currentValue - metric.startValue;
                  const isImprovement = metric.isLowerBetter
                    ? change < 0
                    : change > 0;

                  if (!isImprovement) {
                    return (
                      <div
                        className="flex items-center gap-2 text-red-600"
                        key={metric.field}
                      >
                        <TrendingDown className="h-4 w-4" />
                        <span className="text-sm">
                          {metric.label}: {Math.abs(change).toFixed(1)}{" "}
                          {metric.unit}{" "}
                          {metric.isLowerBetter
                            ? t("charts.less")
                            : t("charts.more")}
                        </span>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
