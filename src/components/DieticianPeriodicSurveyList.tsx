import { useParams, useSearchParams } from "react-router";
import { motion, Variants } from "framer-motion";
import DataRenderer from "./shared/DataRenderer";
import { PERIODIC_SURVEY_EMPTY } from "@/constants/states.ts";
import Pagination from "@/components/shared/Pagination.tsx";
import PeriodicSurveyList from "@/components/PeriodicSurveyList.tsx";
import { useGetAllDieticianPeriodicSurvey } from "@/hooks/useSubmitPeriodicSurvey.ts";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function DieticianPeriodicSurveyList() {
  const { clientId } = useParams<{ clientId: string }>();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [showComparison, setShowComparison] = useState(false);
  const pageParam = searchParams.get("page") || "1";
  const page = Number.parseInt(pageParam, 10);
  const pageSize = 10;
  const { status, error, data } = useGetAllDieticianPeriodicSurvey(
    { page: page - 1, size: pageSize },
    clientId,
    {
      enabled: !!clientId,
    }
  );

  if (!clientId) {
    return <div>{t("periodic_survey.loading")}</div>;
  }

  return (
    <main className="flex-grow items-center justify-center flex flex-col">
      {status === "pending" && t("periodic_survey.loading")}
      {status === "error" && t("periodic_survey.error.loading")}
      <div className="w-full max-w-6xl px-4 py-6">
        {(data?.content?.length ?? 0) > 0 && (
          <h2 className="text-xl font-semibold mb-6">
            {t("periodic_survey.client.header")}
          </h2>
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
      {(data?.content?.length ?? 0) > 0 && !showComparison && (
        <Pagination page={page} isNext={!data?.last} containerClasses="p-6" />
      )}
    </main>
  );
}
