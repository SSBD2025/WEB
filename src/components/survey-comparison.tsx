import { GetPeriodicSurvey } from "@/types/periodic_survey";
import {
  Minus,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useTranslation } from "react-i18next";

interface ComparisonResult {
  field: string;
  label: string;
  oldValue: string | number;
  newValue: string | number;
  difference: number | null;
  percentageChange: number | null;
  trend: "up" | "down" | "same";
  isImprovement: boolean | null;
}

const SurveyComparison = ({
  surveys,
  onClose,
  onClearSelection,
  timezone,
}: {
  surveys: GetPeriodicSurvey[];
  onClose: () => void;
  onClearSelection: () => void;
  timezone: string;
}) => {
  const { t } = useTranslation();

  const sortedSurveys = [...surveys].sort(
    (a, b) =>
      new Date(a.measurementDate).getTime() -
      new Date(b.measurementDate).getTime()
  );

  const [olderSurvey, newerSurvey] = sortedSurveys;

  const calculateComparison = (): ComparisonResult[] => {
    const results: ComparisonResult[] = [];

    if (olderSurvey.weight && newerSurvey.weight) {
      const oldWeight = Number.parseFloat(olderSurvey.weight.toString());
      const newWeight = Number.parseFloat(newerSurvey.weight.toString());
      const difference = newWeight - oldWeight;
      const percentageChange = (difference / oldWeight) * 100;

      results.push({
        field: "weight",
        label: t("survey-comparison.weight") + " (kg)",
        oldValue: oldWeight,
        newValue: newWeight,
        difference,
        percentageChange,
        trend: difference > 0 ? "up" : difference < 0 ? "down" : "same",
        isImprovement: difference <= 0,
      });
    }

    // Porównanie ciśnienia krwi
    if (olderSurvey.bloodPressure && newerSurvey.bloodPressure) {
      results.push({
        field: "bloodPressure",
        label: t("survey-comparison.blood_pressure"),
        oldValue: olderSurvey.bloodPressure,
        newValue: newerSurvey.bloodPressure,
        difference: null,
        percentageChange: null,
        trend: "same",
        isImprovement: null,
      });
    }

    // Porównanie poziomu cukru
    if (olderSurvey.bloodSugarLevel && newerSurvey.bloodSugarLevel) {
      const oldSugar = Number.parseFloat(
        olderSurvey.bloodSugarLevel.toString()
      );
      const newSugar = Number.parseFloat(
        newerSurvey.bloodSugarLevel.toString()
      );
      const difference = newSugar - oldSugar;
      const percentageChange = (difference / oldSugar) * 100;

      results.push({
        field: "bloodSugarLevel",
        label: t("survey-comparison.blood_sugar"),
        oldValue: oldSugar,
        newValue: newSugar,
        difference,
        percentageChange,
        trend: difference > 0 ? "up" : difference < 0 ? "down" : "same",
        isImprovement: difference <= 0,
      });
    }

    return results;
  };

  const comparisonResults = calculateComparison();

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat(localStorage.getItem("i18nextLng") || "pl-PL", {
      timeZone: timezone,
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "same") return <Minus className="h-4 w-4" />;
    if (trend === "up") return <TrendingUp className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const getTrendColor = (isImprovement: boolean | null) => {
    if (isImprovement === null) return "secondary";
    return isImprovement ? "default" : "destructive";
  };

  const handleFinishComparison = () => {
    onClearSelection();
    onClose();
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("survey-comparison.back_to_list")}
          </Button>
          <h2 className="text-2xl font-bold">{t("survey-comparison.comparison_title")}</h2>
        </div>

        <Button variant="outline" size="sm" onClick={handleFinishComparison}>
          <Trash2 className="h-4 w-4 mr-2" />
          {t("survey-comparison.end_button")}
        </Button>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">
              {t("survey-comparison.time_period")}
            </div>
            <div className="font-medium">
              {formatDate(olderSurvey.measurementDate.toString())} →{" "}
              {formatDate(newerSurvey.measurementDate.toString())}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.ceil(
                (new Date(newerSurvey.measurementDate).getTime() -
                  new Date(olderSurvey.measurementDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              {t("survey-comparison.days")}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge variant="outline">{t("survey-comparison.older")}</Badge>
              {t("survey-comparison.survey")}{" "}
              {formatDate(olderSurvey.measurementDate.toString()).split(" ")[0]}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {formatDate(olderSurvey.measurementDate.toString())}
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              {t("survey-comparison.weight")}:{" "}
              <span className="font-medium">{olderSurvey.weight} kg</span>
            </div>
            <div>
              {t("survey-comparison.blood_pressure")}:{" "}
              <span className="font-medium">{olderSurvey.bloodPressure}</span>
            </div>
            <div>
              {t("survey-comparison.blood_sugar")}:{" "}
              <span className="font-medium">
                {olderSurvey.bloodSugarLevel} mg/dl
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Badge variant="outline">{t("survey-comparison.newer")}</Badge>
              {t("survey-comparison.survey")}{" "}
              {formatDate(newerSurvey.measurementDate.toString()).split(" ")[0]}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {formatDate(newerSurvey.measurementDate.toString())}
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              {t("survey-comparison.weight")}:{" "}
              <span className="font-medium">{newerSurvey.weight} kg</span>
            </div>
            <div>
              {t("survey-comparison.blood_pressure")}:{" "}
              <span className="font-medium">{newerSurvey.bloodPressure}</span>
            </div>
            <div>
              {t("survey-comparison.blood_sugar")}:{" "}
              <span className="font-medium">
                {newerSurvey.bloodSugarLevel} mg/dl
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("survey-comparison.compare_analyze")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comparisonResults.map((result, index) => (
              <motion.div
                key={result.field}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      result.isImprovement === true
                        ? "bg-green-100 text-green-600"
                        : result.isImprovement === false
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {getTrendIcon(result.trend)}
                  </div>
                  <div>
                    <div className="font-medium">{result.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.oldValue} → {result.newValue}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {result.difference !== null && (
                    <div className="flex items-center gap-2">
                      <Badge variant={getTrendColor(result.isImprovement)}>
                        {result.difference > 0 ? "+" : ""}
                        {result.difference.toFixed(1)}
                        {result.field === "weight"
                          ? " kg"
                          : result.field === "bloodSugarLevel"
                          ? " mg/dl"
                          : ""}
                      </Badge>
                      {result.percentageChange !== null && (
                        <span className="text-sm text-muted-foreground">
                          ({result.percentageChange > 0 ? "+" : ""}{" "}
                          {result.percentageChange.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  )}
                  {result.isImprovement !== null && (
                    <div
                      className={`text-xs mt-1 ${
                        result.isImprovement ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {result.isImprovement ? t('survey-comparison.improvement') : t('survey-comparison.decline')}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SurveyComparison;
