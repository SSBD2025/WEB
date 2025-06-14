import { GetPeriodicSurvey } from "@/types/periodic_survey";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import SurveyComparison from "./survey-comparison";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
};

const PeriodicSurveyList = ({
  surveys,
  showComparison,
  setShowComparison,
}: {
  surveys?: GetPeriodicSurvey[];
  showComparison: boolean;
  setShowComparison: (show: boolean) => void;
}) => {
  const [timezone, setTimezone] = useState<string>();
  const [selectedSurveys, setSelectedSurveys] = useState<GetPeriodicSurvey[]>(
    []
  );

  const STORAGE_KEY = "selected-surveys-for-comparison";

  const handleSurveySelect = (survey: GetPeriodicSurvey, checked: boolean) => {
    if (checked) {
      if (selectedSurveys.length < 2) {
        setSelectedSurveys([...selectedSurveys, survey]);
      }
    } else {
      setSelectedSurveys(selectedSurveys.filter((s) => s !== survey));
    }
  };

  useEffect(() => {
    const storedTz =
      localStorage.getItem("user-timezone") ||
      Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(storedTz);

    const storedSelected = localStorage.getItem(STORAGE_KEY);
    if (storedSelected) {
      try {
        const parsed = JSON.parse(storedSelected);
        setSelectedSurveys(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedSurveys.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedSurveys));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedSurveys]);

  const handleCompare = () => {
    if (selectedSurveys.length === 2) {
      setShowComparison(true);
    }
  };

  const handleCloseComparison = () => {
    setShowComparison(false);
    setSelectedSurveys([]);
  };

  if (showComparison && selectedSurveys.length === 2 && timezone) {
    return (
      <SurveyComparison
        surveys={selectedSurveys}
        onClose={handleCloseComparison}
        onClearSelection={() => setSelectedSurveys([])}
        timezone={timezone}
      />
    );
  }

  const formatDateShort = (date: string) => {
    return new Intl.DateTimeFormat("pl-PL", {
      timeZone: timezone,
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-4">
      {selectedSurveys.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">
                Wybrane ankiety do porównania ({selectedSurveys.length}/2)
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSurveys([])}
                >
                  Wyczyść wszystkie
                </Button>
                <Button
                  size="sm"
                  onClick={handleCompare}
                  disabled={selectedSurveys.length !== 2}
                >
                  Porównaj ankiety
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {selectedSurveys.map((survey, index) => (
                <motion.div
                  key={survey.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">Ankieta {index + 1}</Badge>
                      <span className="text-sm font-medium">
                        {formatDateShort(survey.measurementDate.toString())}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Waga: {survey.weight} kg</div>
                      <div>Ciśnienie: {survey.bloodPressure}</div>
                      <div>Cukier: {survey.bloodSugarLevel} mg/dl</div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setSelectedSurveys(
                        selectedSurveys.filter((s) => s.id !== survey.id)
                      )
                    }
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}

              {/* Placeholder dla drugiej ankiety */}
              {selectedSurveys.length === 1 && (
                <div className="flex items-center justify-center p-3 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <div className="text-sm">Wybierz drugą ankietę</div>
                    <div className="text-xs">z dowolnej strony</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Wybierz</TableHead>
            <TableHead>
              {t("periodic_survey.list.table.head.measurement_date")}
            </TableHead>
            <TableHead>{t("periodic_survey.list.table.head.weight")}</TableHead>
            <TableHead>
              {t("periodic_survey.list.table.head.blood_pressure")}
            </TableHead>
            <TableHead>
              {t("periodic_survey.list.table.head.blood_sugar_level")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {surveys?.map((survey: GetPeriodicSurvey, i) => {
            const isSelected = selectedSurveys.includes(survey);
            const isDisabled = !isSelected && selectedSurveys.length >= 2;

            return (
              <motion.tr
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                className={isSelected ? "bg-muted/50" : ""}
                onClick={() => {
                  if (!isDisabled) {
                    handleSurveySelect(survey, !isSelected);
                  }
                }}
                style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    disabled={isDisabled}
                    onCheckedChange={(checked) =>
                      handleSurveySelect(survey, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {new Intl.DateTimeFormat("pl-PL", {
                      timeZone: timezone,
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    }).format(new Date(survey.measurementDate))}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="font-medium">{survey.weight}</div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="font-medium">{survey.bloodPressure}</div>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="font-medium">{survey.bloodSugarLevel}</div>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default PeriodicSurveyList;
