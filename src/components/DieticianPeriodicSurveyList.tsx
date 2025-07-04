import { useParams, useSearchParams, useNavigate } from "react-router";
import { motion, Variants } from "framer-motion";
import DataRenderer from "./shared/DataRenderer";
import { PERIODIC_SURVEY_EMPTY } from "@/constants/states.ts";
import Pagination from "@/components/shared/Pagination.tsx";
import PeriodicSurveyList from "@/components/PeriodicSurveyList.tsx";
import { useGetAllDieticianPeriodicSurvey } from "@/hooks/useSubmitPeriodicSurvey.ts";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { DateTimeRangePicker } from "@/components/DateTimePicker.tsx";
import ROUTES from "@/constants/routes.ts";
import BackButton from "./shared/BackButton";
import { GetPeriodicSurvey } from "@/types/periodic_survey";
import usePeriodicSurveySettings from "@/hooks/usePeriodicSurveyStoredSettings.ts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

type Props = {
    onSurveySelect?: (survey: GetPeriodicSurvey) => void;
    isModal?: boolean;
};

export default function DieticianPeriodicSurveyList({
                                                        onSurveySelect,
                                                        isModal = false,
                                                    }: Props) {
    const { clientId } = useParams<{ clientId: string }>();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [showComparison, setShowComparison] = useState(false);
    const navigate = useNavigate();

    const { settings, setPageSize } = usePeriodicSurveySettings();

    const since = searchParams.get("since") || undefined;
    const before = searchParams.get("before") || undefined;
    const pageParam = searchParams.get("page") || "1";
    const page = Number.parseInt(pageParam, 10);

    const sort =
        searchParams.get("sort") ||
        `${settings.sortBy || "measurementDate"},${settings.sortOrder || "desc"}`;
    const pageSize = settings.pageSize || 5;

    const { status, error, data } = useGetAllDieticianPeriodicSurvey(
        {
            page: page - 1,
            size: pageSize,
            sort,
            since,
            before,
        },
        clientId,
        {
            enabled: !!clientId,
        }
    );

    const handleDateFilter = (sinceISO?: string, beforeISO?: string) => {
        const params = new URLSearchParams(searchParams);
        if (sinceISO) params.set("since", sinceISO);
        else params.delete("since");
        if (beforeISO) params.set("before", beforeISO);
        else params.delete("before");
        navigate({ search: params.toString() });
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
    };

    if (!clientId) return <div>{t("periodic_survey.loading")}</div>;

    return (
        <main
            className={`flex-grow items-center justify-center flex flex-col ${
                isModal ? "h-full" : ""
            }`}
        >
            {status === "pending" && t("periodic_survey.loading")}

            <div className={`w-full px-4 py-6 ${isModal ? "max-w-full" : "max-w-6xl"}`}>
                {!isModal && <BackButton route={ROUTES.DIETICIAN_DASHBOARD} />}

                {(data?._embedded?.periodicSurveyDTOList?.length ?? 0) > 0 && !showComparison && (
                    <div className="flex flex-row w-full justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                            {isModal
                                ? t("create_diet_profile.periodic_survey.select_survey")
                                : t("periodic_survey.client.header")}
                        </h2>

                        {!isModal && (
                            <div className="flex gap-4 items-center">
                                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {t("pagination.itemsPerPage")}
                  </span>
                                    <Select
                                        value={pageSize.toString()}
                                        onValueChange={(val) => handlePageSizeChange(Number(val))}
                                    >
                                        <SelectTrigger className="w-[80px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[3,5, 10, 20, 50].map((size) => (
                                                <SelectItem key={size} value={size.toString()}>
                                                    {size}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!showComparison && (
                    <DateTimeRangePicker
                        onApply={handleDateFilter}
                        hasResults={(data?._embedded?.periodicSurveyDTOList?.length ?? 0) > 0}
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
                        data={data?._embedded?.periodicSurveyDTOList}
                        empty={PERIODIC_SURVEY_EMPTY}
                        render={() => (
                            <PeriodicSurveyList
                                showComparison={showComparison}
                                setShowComparison={setShowComparison}
                                surveys={data?._embedded?.periodicSurveyDTOList}
                                onSurveySelect={onSurveySelect}
                                isModal={isModal}
                            />
                        )}
                    />
                </motion.div>
            </div>

            {!isModal && (
                <div className="max-w-6xl w-full mx-auto px-4">
                    <div className="grid grid-cols-3 items-center py-4">
                        <div />
                        <div className="flex justify-center">
                            {(data?._embedded?.periodicSurveyDTOList?.length ?? 0) > 0 &&
                                !showComparison && (
                                    <Pagination
                                        page={page}
                                        links={data?._links}
                                        pageInfo={data?.page}
                                        containerClasses="p-6"
                                    />
                                )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
