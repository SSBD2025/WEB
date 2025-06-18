import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  TestTube,
  ArrowDown,
  ArrowUp,
  Edit,
} from "lucide-react";
import {
  useClientBloodTestReports,
  useClientBloodTestByDieticianReports,
  useUpdateBloodTestReport
} from "@/hooks/useClientBloodTestReports";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "react-i18next";
import EditBloodReportModal from "@/components/edit-blood-report-modal.tsx";
import ConfirmBloodTestReportUpdates from "@/components/confirmBloodTestReportUpdate.tsx";
import {BloodTestReport} from "@/types/blood_test_report";
import { AxiosError } from "axios";
import ROUTES from "@/constants/routes.ts";
import BackButton from "@/components/shared/BackButton.tsx";

interface BloodTestReportsProps {
  userRole: "client" | "dietician";
}

export default function BloodTestReports({ userRole }: BloodTestReportsProps) {
  const { clientId } = useParams<{ clientId: string }>()

  const clientQuery = useClientBloodTestReports(userRole === "client");
  const dieticianQuery = useClientBloodTestByDieticianReports(
      userRole === "dietician" ? clientId : undefined
  );

  const query = userRole === "client" ? clientQuery : dieticianQuery;
  const { data: reports, isLoading, isError, refetch } = query;

  const [openReports, setOpenReports] = useState<Set<string>>(new Set());
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingReport, setEditingReport] = useState<BloodTestReport | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingUpdatedReport, setPendingUpdatedReport] = useState<BloodTestReport | null>(null);
  const { t } = useTranslation();

  const updateReportMutation = useUpdateBloodTestReport(refetch, () => {
    setIsEditModalOpen(false);
    setIsConfirmModalOpen(false);
    setEditingReport(null);
    setPendingUpdatedReport(null);
  });

  const handleEditReport = (report: BloodTestReport) => {
    setEditingReport(report);
    setIsEditModalOpen(true);
  };

  const handleSaveReport = (updatedReport: BloodTestReport) => {
    setPendingUpdatedReport(updatedReport);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSave = () => {
    if (pendingUpdatedReport) {
      updateReportMutation.mutate(pendingUpdatedReport);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingReport(null);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setPendingUpdatedReport(null);
  };

  const toggleReport = (lockToken: string) => {
    const newOpenReports = new Set(openReports);
    if (newOpenReports.has(lockToken)) {
      newOpenReports.delete(lockToken);
    } else {
      newOpenReports.add(lockToken);
    }
    setOpenReports(newOpenReports);
  };

  const formatUnit = (unit: string) => {
    const unitMap: Record<string, string> = {
      G_DL: "g/dL",
      PERCENT: "%",
      X10_12_U_L: "×10¹²/µL",
      X10_9_U_L: "×10⁹/µL",
      X10_6_U_L: "×10⁶/µL",
      X10_3_U_L: "×10³/µL",
      PG: "pg",
      FL: "fL",
    };
    return unitMap[unit] || unit;
  };

  const getResultStatus = (result: string, min: number, max: number) => {
    const value = Number.parseFloat(result);
    if (value < min) return "low";
    if (value > max) return "high";
    return "normal";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
      case "high":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "low":
        return t("blood_test_reports.below");
      case "high":
        return t("blood_test_reports.above");
      default:
        return t("blood_test_reports.normal");
    }
  };

  // Animacja dla loading
  if (isLoading) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center min-h-[200px]"
        >
          <Spinner />
        </motion.div>
    );
  }

  if (isError) {
    const axiosError = query.error as AxiosError<{ message: string }>;
    const errorMessage = axiosError?.response?.data?.message;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto p-6"
        >
          {errorMessage === "client_blood_test_report_not_found" ? (
              <p className="text-red-500">
                {t("blood_test_reports.client_blood_test_report_not_found")}
              </p>
          ) : errorMessage === "permanent_survey_not_found" ? (
              <p className="text-red-500">
                {t("blood_test_reports.permanent_survey_not_found")}
              </p>
          ) : (
              <p className="text-red-500">
                {t("blood_test_reports.error_loading_reports")}
              </p>
          )}
        </motion.div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto p-6"
        >
          <p>{t("blood_test_reports.no_reports_found")}</p>
        </motion.div>
    );
  }

  const sortedReports = [...reports].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto p-6 space-y-4"
      >
        {/* Header z animacją */}
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
        >
          {userRole === "dietician" ?
              <BackButton route={ROUTES.DIETICIAN_DASHBOARD}/> : <BackButton route={ROUTES.HOME} />
          }
        </motion.div>

        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-2">
            <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
              <TestTube className="h-6 w-6" />
            </motion.div>
            <h1 className="text-2xl font-bold">
              {t("blood_test_reports.blood_test_reports")}
            </h1>
          </div>

          <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
              className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted/50 transition-colors"
          >
            <motion.div
                animate={{ rotate: sortOrder === "desc" ? 0 : 180 }}
                transition={{ duration: 0.3 }}
            >
              {sortOrder === "desc" ? (
                  <ArrowDown className="h-4 w-4" />
              ) : (
                  <ArrowUp className="h-4 w-4" />
              )}
            </motion.div>
            {sortOrder === "desc" ?
                t("blood_test_reports.newest") :
                t("blood_test_reports.oldest")
            }
          </motion.button>
        </motion.div>

        {/* Lista raportów z animacjami */}
        <AnimatePresence mode="wait">
          <motion.div className="space-y-4">
            {sortedReports.map((report, index) => {
              const isOpen = openReports.has(report.lockToken);

              return (
                  <motion.div
                      key={report.lockToken}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                  >
                    <Card className="w-full overflow-hidden">
                      <Collapsible>
                        <CollapsibleTrigger
                            className="w-full"
                            onClick={() => toggleReport(report.lockToken)}
                        >
                          <motion.div
                              whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                              transition={{ duration: 0.2 }}
                          >
                            <CardHeader className="transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <motion.div
                                      animate={{ rotate: isOpen ? 90 : 0 }}
                                      transition={{ duration: 0.2 }}
                                  >
                                    {isOpen ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                  </motion.div>
                                  <div className="text-left">
                                    <CardTitle className="text-lg">
                                      {t("blood_test_reports.blood_test_report")}
                                    </CardTitle>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                      <Calendar className="h-4 w-4" />
                                      {new Date(report.timestamp).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                  <Badge variant="outline">
                                    {report.results.length}{" "}
                                    {report.results.length !== 1
                                        ? t("blood_test_reports.parameters")
                                        : t("blood_test_reports.parameter")}
                                  </Badge>
                                </motion.div>
                              </div>
                            </CardHeader>
                          </motion.div>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                          >
                            <CardContent className="pt-0">
                              <div className="space-y-4">
                                {report.results.map((result, resultIndex) => {
                                  const status = getResultStatus(
                                      result.result,
                                      result.bloodParameter.standardMin,
                                      result.bloodParameter.standardMax
                                  );

                                  return (
                                      <motion.div
                                          key={result.lockToken}
                                          initial={{ opacity: 0, x: -20 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{
                                            duration: 0.3,
                                            delay: resultIndex * 0.1
                                          }}
                                          whileHover={{
                                            scale: 1.01,
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                          }}
                                          className="flex items-center justify-between p-4 border rounded-lg bg-card cursor-pointer"
                                      >
                                        <div className="flex-1">
                                          <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-lg">
                                              {result.bloodParameter.name}
                                            </h3>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                  duration: 0.3,
                                                  delay: 0.2 + resultIndex * 0.1
                                                }}
                                            >
                                              <Badge variant={getStatusColor(status)}>
                                                {getStatusText(status)}
                                              </Badge>
                                            </motion.div>
                                          </div>
                                          <p className="text-muted-foreground mb-1">
                                            {result.bloodParameter.description}
                                          </p>
                                          <p className="text-sm text-muted-foreground">
                                            {t("blood_test_reports.range")}{" "}
                                            {result.bloodParameter.standardMin} -{" "}
                                            {result.bloodParameter.standardMax}{" "}
                                            {formatUnit(result.bloodParameter.unit)}
                                          </p>
                                        </div>
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{
                                              duration: 0.4,
                                              delay: 0.3 + resultIndex * 0.1
                                            }}
                                            className="text-right"
                                        >
                                          <div className="text-2xl font-bold">
                                            {result.result}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            {formatUnit(result.bloodParameter.unit)}
                                          </div>
                                        </motion.div>
                                      </motion.div>
                                  );
                                })}

                                {userRole === "dietician" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: 0.2 }}
                                        className="pt-4 border-t"
                                    >
                                      <Button
                                          onClick={() => handleEditReport(report)}
                                          variant="outline"
                                          className="w-full"
                                          asChild
                                      >
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                          <Edit className="h-4 w-4 mr-2" />
                                          {t("blood_test_reports.edit_report")}
                                        </motion.button>
                                      </Button>
                                    </motion.div>
                                )}
                              </div>
                            </CardContent>
                          </motion.div>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Modals */}
        <EditBloodReportModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            report={editingReport}
            onSave={handleSaveReport}
        />

        <ConfirmBloodTestReportUpdates
            isOpen={isConfirmModalOpen}
            onClose={handleCloseConfirmModal}
            onConfirm={handleConfirmSave}
            report={pendingUpdatedReport}
            isLoading={updateReportMutation.isPending}
        />
      </motion.div>
  );
}