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
import { useState } from "react";
import { DateTimeRangePicker } from "@/components/DateTimePicker.tsx";
import BackButton from "@/components/shared/BackButton.tsx";
import ROUTES from "@/constants/routes.ts";

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
  const sort = searchParams.get("sort") || "measurementDate,desc";
  const pageParam = searchParams.get("page") || "1";
  const page = Number.parseInt(pageParam, 10);
  const pageSize = 10;
  const { status, error, data } = useGetAllClientPeriodicSurvey({
    page: page - 1,
    size: pageSize,
    since,
    before,
    sort,
  });

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

  return (
    <main className="flex-grow items-center justify-center flex flex-col">
      {status === "pending" && t("periodic_survey.loading")}
      {status === "error" && t("periodic_survey.error.loading")}
      <div className="w-full max-w-6xl px-4 py-6">
      <BackButton route={ROUTES.HOME}/>
        {(data?.content?.length ?? 0) > 0 && !showComparison && (
          <div className="flex flex-row w-full justify-between">
            <h2 className="text-xl font-semibold mb-6">
              {t("periodic_survey.client.header")}
            </h2>
          </div>
        )}
        {!showComparison && (
          <DateTimeRangePicker
            onApply={handleDateFilter}
            hasResults={(data?.content?.length ?? 0) > 0}
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
            error={error}
            data={data?.content}
            empty={PERIODIC_SURVEY_EMPTY}
            render={() => (
              <PeriodicSurveyList
                showComparison={showComparison}
                setShowComparison={setShowComparison}
                surveys={data?.content}
              />
            )}
          />
        </motion.div>
      </div>
      <div className="max-w-6xl w-full mx-auto px-4">
        <div className="grid grid-cols-3 items-center py-4">
          <div />
          <div className="flex justify-center">
            {(data?.content?.length ?? 0) > 0 && !showComparison && (
              <Pagination
                page={page}
                isNext={!data?.last}
                containerClasses="p-6"
              />
            )}
          </div>
          <div className="flex justify-end">
            {(data?.content?.length ?? 0) > 0 && latest.data && !showComparison && (
              <>
                <Button onClick={() => setIsModalOpen(true)}>
                  {t("periodic_survey.client.edit.button")}
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
