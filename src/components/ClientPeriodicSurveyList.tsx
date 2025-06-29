import { useSearchParams, useNavigate } from "react-router";
import { motion, Variants } from "framer-motion";
import DataRenderer from "./shared/DataRenderer";
import { PERIODIC_SURVEY_EMPTY } from "@/constants/states.ts";
import Pagination from "@/components/shared/Pagination.tsx";
import PeriodicSurveyList from "@/components/PeriodicSurveyList.tsx";
import {
  useGetAllClientPeriodicSurvey,
  useGetLatestPeriodicSurvey,
} from "@/hooks/useSubmitPeriodicSurvey.ts";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button.tsx";
import EditSurveyModal from "./EditSurveyModal";
import { useEffect, useState } from "react";
import { DateTimeRangePicker } from "@/components/DateTimePicker.tsx";
import BackButton from "@/components/shared/BackButton.tsx";
import ROUTES from "@/constants/routes.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePeriodicSurveySettings from "@/hooks/usePeriodicSurveyStoredSettings.ts";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function ClientPeriodicSurveyList() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const since = searchParams.get("since") || undefined;
  const before = searchParams.get("before") || undefined;
  const [showComparison, setShowComparison] = useState(false);

  const { settings, setPageSize } = usePeriodicSurveySettings();
  const pageParam = searchParams.get("page") || "1";
  const page = Number.parseInt(pageParam, 10);

  const pageSize = settings.pageSize || 5;
  const sort =
    searchParams.get("sort") ||
    `${settings.sortBy || "measurementDate"},${settings.sortOrder || "desc"}`;

  const { status, error, data } = useGetAllClientPeriodicSurvey({
    page: page - 1,
    size: pageSize,
    since,
    before,
    sort,
  });

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const getSurveysData = () => {
    if (!data) return [];
    return data._embedded?.periodicSurveyDTOList || [];
  };

  const handleDateFilter = (sinceISO?: string, beforeISO?: string) => {
    const params = new URLSearchParams(searchParams);
    if (sinceISO) params.set("since", sinceISO);
    else params.delete("since");
    if (beforeISO) params.set("before", beforeISO);
    else params.delete("before");
    navigate({ search: params.toString() });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const latest = useGetLatestPeriodicSurvey();

  const surveysData = getSurveysData();
  const paginationData = data?.page;

  const unlockTime = latest.data?.createdAt
      ? new Date(latest.data.createdAt).getTime() + 15 * 60 * 1000
      : 0;
  const remainingMs = useCountdown(unlockTime);
  const isLocked = remainingMs <= 0;


  function useCountdown(to: number) {
    const [remaining, setRemaining] = useState(to - Date.now());

    useEffect(() => {
      const tick = () => {
        const timeLeft = to - Date.now();
        setRemaining(Math.max(0, timeLeft));
      };
      tick();
      const interval = setInterval(tick, 1000);
      return () => clearInterval(interval);
    }, [to]);

    return remaining;
  }

  const minutes = Math.floor((remainingMs / 1000 / 60) % 60);
  const seconds = Math.floor((remainingMs / 1000) % 60);
  const countdownLabel = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <main className="flex-grow items-center justify-center flex flex-col">
      {status === "pending" && t("periodic_survey.loading")}
      <div className="w-full max-w-6xl px-4 py-6">
        <BackButton route={ROUTES.HOME} />
        {surveysData.length > 0 && !showComparison && (
          <div className="flex flex-row w-full justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {t("periodic_survey.client.header")}
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {t("pagination.itemsPerPage")}
                </span>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => handlePageSizeChange(Number(value))}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder={pageSize.toString()} />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 5, 10, 20, 50].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
        {!showComparison && (
          <DateTimeRangePicker
            onApply={handleDateFilter}
            hasResults={surveysData.length > 0}
          />
        )}
        <motion.div
          className="relative w-full overflow-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <DataRenderer
            status={status}
            error={
              error && {
                title: error.title,
                details: t("periodic_survey.no_results"),
              }
            }
            data={surveysData}
            empty={PERIODIC_SURVEY_EMPTY}
            render={() => (
              <PeriodicSurveyList
                surveys={surveysData}
                showComparison={showComparison}
                setShowComparison={setShowComparison}
              />
            )}
          />
        </motion.div>
      </div>
      <div className="max-w-6xl w-full mx-auto px-4">
        <div className="grid grid-cols-3 items-center py-4">
          <div />
          <div className="flex justify-center">
            {surveysData.length > 0 && !showComparison && paginationData && (
              <Pagination
                page={page}
                links={data?._links}
                pageInfo={paginationData}
                containerClasses="p-6"
              />
            )}
          </div>
          <div className="flex justify-end">
            {surveysData.length > 0 && latest.data && !showComparison && (
              <>
                <Button onClick={() => setIsModalOpen(true)} disabled={isLocked}>
                  {isLocked
                      ? t("periodic_survey.client.edit.locked")
                      : `${t("periodic_survey.client.edit.button")} (${countdownLabel})`}
                </Button>
                <EditSurveyModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  defaultValues={{
                    weight: latest.data.weight,
                    bloodPressure: latest.data.bloodPressure,
                    bloodSugarLevel: latest.data.bloodSugarLevel,
                    lockToken: latest.data.lockToken,
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
