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
import { X, Eye } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowDown, ArrowUp } from "lucide-react";

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

const SORT_FIELDS = [
  "measurementDate",
  "weight",
  "bloodPressure",
  "bloodSugarLevel",
] as const;

type Props = {
  surveys?: GetPeriodicSurvey[];
  showComparison: boolean;
  setShowComparison: (show: boolean) => void;
  onSurveySelect?: (survey: GetPeriodicSurvey) => void;
  isModal?: boolean;
};

const PeriodicSurveyList = ({
                              surveys,
                              showComparison,
                              setShowComparison,
                              onSurveySelect,
                              isModal = false,
                            }: Props) => {
  const [timezone, setTimezone] = useState<string>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedSurveys, setSelectedSurveys] = useState<GetPeriodicSurvey[]>([]);

  const STORAGE_KEY = "selected-surveys-for-comparison";

  const handleSurveySelect = (survey: GetPeriodicSurvey, checked: boolean) => {
    if (checked) {
      if (selectedSurveys.length < 2) {
        setSelectedSurveys(prev => [...prev, survey]);
      }
    } else {
      setSelectedSurveys(prev => prev.filter((s) => s.id !== survey.id));
    }
  };

  const handleSurveyView = (survey: GetPeriodicSurvey) => {
    if (onSurveySelect) {
      onSurveySelect(survey);
    }
  };

  type SortField = (typeof SORT_FIELDS)[number];
  type SortDirection = "asc" | "desc";

  function getSortParams(sortString: string): {
    field: SortField;
    direction: SortDirection;
  } {
    const [field, direction] = sortString.split(",");
    if (
        SORT_FIELDS.includes(field as SortField) &&
        (direction === "asc" || direction === "desc")
    ) {
      return {
        field: field as SortField,
        direction: direction as SortDirection,
      };
    }
    return { field: "measurementDate", direction: "desc" };
  }

  function SortableHeader({
                            field,
                            label,
                            currentSort,
                            onSortChange,
                          }: {
    field: SortField;
    label: string;
    currentSort: { field: SortField; direction: SortDirection };
    onSortChange: (sort: string) => void;
  }) {
    const isActive = currentSort.field === field;

    const toggleDirection = () => {
      let newDirection: SortDirection = "asc";
      if (isActive) {
        newDirection = currentSort.direction === "asc" ? "desc" : "asc";
      }
      onSortChange(`${field},${newDirection}`);
    };

    return (
        <TableHead
            className="cursor-pointer select-none"
            onClick={toggleDirection}
            aria-sort={
              isActive
                  ? currentSort.direction === "asc"
                      ? "ascending"
                      : "descending"
                  : "none"
            }
        >
          <div className="flex items-center gap-1">
            {label}
            {isActive && (
                <span className="text-sm">
              {currentSort.direction === "asc" ? (
                  <ArrowUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
              )}
            </span>
            )}
          </div>
        </TableHead>
    );
  }

  useEffect(() => {
    const storedTz =
        localStorage.getItem("user-timezone") ||
        Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(storedTz);

    if (!isModal) {
      const storedSelected = localStorage.getItem(STORAGE_KEY);
      if (storedSelected) {
        try {
          const parsed = JSON.parse(storedSelected);
          // Ensure we have valid survey objects and they still exist in current surveys
          if (Array.isArray(parsed) && surveys) {
            const validSelected = parsed.filter(stored =>
                surveys.some(survey => survey.id === stored.id)
            );
            setSelectedSurveys(validSelected);
          }
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    }
  }, [isModal, surveys]);

  const sortParam = searchParams.get("sort") || "measurementDate,desc";
  const currentSort = getSortParams(sortParam);

  const handleSortChange = (newSort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", newSort);
    navigate(`?${newParams.toString()}`);
  };

  useEffect(() => {
    if (!isModal && selectedSurveys.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedSurveys));
    } else if (!isModal && selectedSurveys.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedSurveys, isModal]);

  const handleCompare = () => {
    if (selectedSurveys.length === 2) {
      setShowComparison(true);
    }
  };

  const handleCloseComparison = () => {
    setShowComparison(false);
    setSelectedSurveys([]);
  };

  const clearSelectedSurveys = () => {
    setSelectedSurveys([]);
  };

  if (showComparison && selectedSurveys.length === 2 && timezone) {
    return (
        <SurveyComparison
            surveys={selectedSurveys}
            onClose={handleCloseComparison}
            onClearSelection={clearSelectedSurveys}
            timezone={timezone}
        />
    );
  }

  const formatDateShort = (date: string) => {
    return new Intl.DateTimeFormat(
        localStorage.getItem("i18nextLng") || "pl-PL",
        {
          timeZone: timezone,
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
    ).format(new Date(date));
  };

  return (
      <div className="space-y-4">
        {selectedSurveys.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">
                    {t("survey-comparison.choose_to_compare")} (
                    {selectedSurveys.length}/2)
                  </h3>
                  <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearSelectedSurveys}
                    >
                      {t("survey-comparison.clear_all")}
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleCompare}
                        disabled={selectedSurveys.length !== 2}
                    >
                      {t("survey-comparison.compare")}
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
                            <Badge variant="secondary">
                              {t("survey-comparison.survey_default")} {index + 1}
                            </Badge>
                            <span className="text-sm font-medium">
                        {formatDateShort(survey.measurementDate.toString())}
                      </span>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>
                              {t("survey-comparison.weight")}: {survey.weight} kg
                            </div>
                            <div>
                              {t("survey-comparison.blood_pressure")}:{" "}
                              {survey.bloodPressure}
                            </div>
                            <div>
                              {t("survey-comparison.blood_sugar")}:{" "}
                              {survey.bloodSugarLevel} mg/dl
                            </div>
                          </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                                setSelectedSurveys(prev =>
                                    prev.filter((s) => s.id !== survey.id)
                                )
                            }
                            className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                  ))}

                  {selectedSurveys.length === 1 && (
                      <div className="flex items-center justify-center p-3 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                        <div className="text-center text-muted-foreground">
                          <div className="text-sm">
                            {t("survey-comparison.choose_second")}
                          </div>
                          <div className="text-xs">
                            {t("survey-comparison.with_pagination")}
                          </div>
                        </div>
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>
        )}

        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">
                {t("survey-comparison.choose")}
              </TableHead>
              {isModal && (
                  <TableHead className="w-16">
                    {t("common.select")}
                  </TableHead>
              )}
              <SortableHeader
                  field="measurementDate"
                  label={t("periodic_survey.list.table.head.measurement_date")}
                  currentSort={currentSort}
                  onSortChange={handleSortChange}
              />
              <SortableHeader
                  field="weight"
                  label={t("periodic_survey.list.table.head.weight")}
                  currentSort={currentSort}
                  onSortChange={handleSortChange}
              />
              <SortableHeader
                  field="bloodPressure"
                  label={t("periodic_survey.list.table.head.blood_pressure")}
                  currentSort={currentSort}
                  onSortChange={handleSortChange}
              />
              <SortableHeader
                  field="bloodSugarLevel"
                  label={t("periodic_survey.list.table.head.blood_sugar_level")}
                  currentSort={currentSort}
                  onSortChange={handleSortChange}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {surveys?.map((survey: GetPeriodicSurvey, i) => {
              const isSelected = selectedSurveys.some(s => s.id === survey.id);
              const isDisabled = !isSelected && selectedSurveys.length >= 2;

              return (
                  <motion.tr
                      key={survey.id}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={rowVariants}
                      className={`${isSelected ? "bg-muted/50" : ""} ${isModal ? "hover:bg-muted/30" : ""}`}
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
                    {isModal && (
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSurveyView(survey)}
                              className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                    )}
                    <TableCell
                        className={isModal ? "cursor-pointer" : ""}
                        onClick={isModal ? () => handleSurveyView(survey) : undefined}
                    >
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
                    <TableCell
                        className={`font-medium ${isModal ? "cursor-pointer" : ""}`}
                        onClick={isModal ? () => handleSurveyView(survey) : undefined}
                    >
                      <div className="font-medium">{survey.weight}</div>
                    </TableCell>
                    <TableCell
                        className={`font-medium ${isModal ? "cursor-pointer" : ""}`}
                        onClick={isModal ? () => handleSurveyView(survey) : undefined}
                    >
                      <div className="font-medium">{survey.bloodPressure}</div>
                    </TableCell>
                    <TableCell
                        className={`font-medium ${isModal ? "cursor-pointer" : ""}`}
                        onClick={isModal ? () => handleSurveyView(survey) : undefined}
                    >
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