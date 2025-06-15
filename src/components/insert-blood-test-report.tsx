import {useBloodParameter, useSubmitReport} from "@/hooks/useBloodParameter.ts";
import { t } from "i18next";
import {Card, CardContent} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {X} from "lucide-react";
import {useEffect, useState } from "react";
import { BloodParameter } from "@/types/blood_test_report";
import { Info } from "lucide-react";
import ConfirmEntriesModal from "@/components/ConfirmEntriesModal";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import {useParams} from "react-router";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import DataRenderer from "@/components/shared/DataRenderer.tsx";
import {PERMANENT_SURVEY_EMPTY_DIETICIAN} from "@/constants/states.ts";
import { BloodTestEntry, ParameterWithResult } from "@/types/blood_test_report";
import {Label} from "@/components/ui/label.tsx";
import ROUTES from "@/constants/routes.ts";
import BackButton from "@/components/shared/BackButton.tsx";

function mapEntriesToParameters(
    entries: BloodTestEntry[],
    bloodParams: BloodParameter[]
): ParameterWithResult[] {
    return entries
        .map((entry) => {
            const param = bloodParams.find((p) => p.name === entry.parameterName);
            if (!param) return null;
            return {
                parameter: param,
                result: entry.result,
            };
        })
        .filter(Boolean) as ParameterWithResult[];
}

function formatUnit(unit: string): string {
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
}

export default function InsertBloodTestReport() {
    const { id } = useParams<{ id?: string }>();
    const submitReportMutation = useSubmitReport(id!);
    const { data: allBloodParameters, status, error } = useBloodParameter(id!);
    const STORAGE_KEY = "blood_test_entries";
    const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [entries, setEntries] = useState<BloodTestEntry[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        return parsed;
                    }
                } catch (e) {
                    console.error("Failed to parse saved entries", e);
                }
            }
            return [{ parameterName: "", result: "" }];
        });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }, [entries]);

    const handleAddParameter = () => {
        const { newEntries } = validateEntries(entries);
        setEntries(newEntries);
        if (hasIncompleteEntry()) {
            setShowIncompleteWarning(true);
            return;
        }
        setEntries((prev) => [...prev, { parameterName: "", result: "" }]);
    };

    const handleUpdateEntry = (
        index: number,
        field: "parameterName" | "result",
        value: string
    ) => {
        const updatedEntries = [...entries];
        updatedEntries[index][field] = value;
        setEntries(updatedEntries);
    };

    const isValidResult = (value: string): boolean => {
        return /^(\d+\.?\d*|\.\d+)$/.test(value.trim());
    };

    const mappedError = (() => {
        if (!error) return undefined;

        if (axios.isAxiosError(error)) {
            const backendMessage = error.response?.data?.message;
            return {
                title: backendMessage
                    ? t("exceptions." + backendMessage)
                    : t("errors.generic"),
                details: backendMessage==="permanent_survey_not_found" ? PERMANENT_SURVEY_EMPTY_DIETICIAN.message : ""
            };
        }

        return {
            title: t("errors.unknown_error"),
            details: error.message ?? t("errors.generic"),
        };
    })();

    const isDuplicate = (name: string) =>
        entries.filter((entry) => entry.parameterName === name).length > 1;

    const hasIncompleteEntry = () =>
        entries.some(
            (entry) => entry.parameterName.trim() === "" || entry.result.trim() === ""
        );

    const formatEntriesForRequest = () => {
        return {
            results: entries
                .filter((entry) => entry.parameterName && entry.result)
                .map((entry) => ({
                    result: parseFloat(entry.result),
                    bloodParameter: {
                        name: entry.parameterName,
                    },
                })),
        };
    };

    const validateEntries = (entries: BloodTestEntry[]) => {
        let hasError = false;
        const newEntries = entries.map((entry) => {
            const errors: { parameterName?: string; result?: string } = {};
            if (!entry.parameterName.trim()) {
                errors.parameterName = t("blood_test_reports.insert.error.empty_parameter");
                hasError = true;
            }
            if (!entry.result.trim()) {
                errors.result = t("blood_test_reports.insert.error.empty_result");
                hasError = true;
            } else if (!isValidResult(entry.result)) {
                errors.result = t("blood_test_reports.insert.error.invalid_result");
                hasError = true;
            }
            return { ...entry, errors };
        });
        return { newEntries, hasError };
    };

    const handleSubmit = () => {
        const { newEntries, hasError } = validateEntries(entries);
        setEntries(newEntries);

        if (hasIncompleteEntry()) {
            setShowIncompleteWarning(true);
            return;
        }
        if (hasError) {
            setShowIncompleteWarning(false);
            return;
        }
        setShowIncompleteWarning(false);
        setShowConfirmModal(true);
    };

    const confirmSubmit = () => {
        const payload = formatEntriesForRequest();
        submitReportMutation.mutate(payload);
        setShowConfirmModal(false);
    };

    const cancelSubmit = () => {
        setShowConfirmModal(false);
    };

    if (!id) {
        return <div>{t("periodic_survey.loading")}</div>;
    }

    return (
        <main className="flex-grow items-center justify-center flex flex-col">
            <div className="w-full items-center justify-center flex-col max-w-4xl px-4 py-6">
                <BackButton route={ROUTES.DIETICIAN_DASHBOARD}/>
                <DataRenderer
                    status={status}
                    data={allBloodParameters}
                    error={mappedError}
                    empty={PERMANENT_SURVEY_EMPTY_DIETICIAN}
                    render={(bloodParams) => {
                        const filteredParameters = (search: string) =>
                            bloodParams?.filter(
                                (param) =>
                                    param.name.toLowerCase().includes(search.toLowerCase()) &&
                                    !entries.some((entry) => entry.parameterName === param.name)
                            ) || [];
                        const paramsWithResults = mapEntriesToParameters(entries, bloodParams);

                        const getParameterDetails = (name: string): BloodParameter | undefined =>
                            bloodParams?.find((param) => param.name === name);
                    return(
                    <>
                    <div className="flex justify-between mb-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            {t("blood_test_reports.insert.insert_title")}
                        </h2>
                        <Button onClick={() => setEntries([{ parameterName: "", result: "" }])}
                                variant="destructive"
                                className="ml-auto"
                        >
                            {t("blood_test_reports.insert.clear_all")}
                        </Button>
                    </div>
                    {status === "pending" && t("blood_test_reports.insert.loading")}
                    {status === "error" && t("blood_test_reports.insert.error.unexpected")}
                    {status === "success" && (
                    <AnimatePresence initial={false}>
                        {entries.map((entry, index) => {
                            const paramDetails = getParameterDetails(entry.parameterName);
                            const step = paramDetails ? (paramDetails.standardMax + paramDetails.standardMin) / 100 : 0.1;
                            // const matchingOptions = filteredParameters(entry.parameterName);
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card key={index} className="mb-3">
                                        <CardContent>
                                            <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                                <div className="flex-1">
                                                    <div className="relative w-full">
                                                        <div className="relative w-full">
                                                            <Select
                                                                value={entry.parameterName}
                                                                onValueChange={(value) => handleUpdateEntry(index, "parameterName", value)}
                                                            >
                                                                <SelectTrigger className={`w-full ${entry.errors?.result ? "border-red-500" : ""}`}>
                                                                    <SelectValue placeholder={t("blood_test_reports.insert.select_placeholder")} />
                                                                </SelectTrigger>
                                                                <SelectContent className={entry.errors?.parameterName ? "border-red-500" : ""}>
                                                                    <SelectGroup>
                                                                        <SelectLabel>{t("blood_test_reports.insert.parameters")}</SelectLabel>
                                                                        {entry.parameterName && !filteredParameters("").some(p => p.name === entry.parameterName) && (
                                                                            <SelectItem value={entry.parameterName}>
                                                                                {entry.parameterName}
                                                                            </SelectItem>
                                                                        )}
                                                                        {filteredParameters("").map((param) => (
                                                                            <SelectItem key={param.name} value={param.name}>
                                                                                {param.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                            <Label
                                                                htmlFor={`param-${index}`}
                                                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-60 top-2 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-80 peer-focus:-translate-y-7"
                                                            >
                                                                {t("blood_test_reports.insert.parameter_name")}<p className="text-red-600">*</p>
                                                            </Label>
                                                            {paramDetails?.description && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground">
                                                                            <Info className="w-5 h-5 rounded-full p-0.5" />
                                                                        </div>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="right" className="max-w-xs text-sm leading-snug">
                                                                        {paramDetails.description}
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="relative w-full">
                                                        <Input
                                                            id={`param-${index}-result`}
                                                            placeholder=" "
                                                            type="number"
                                                            step={step}
                                                            value={entry.result}
                                                            onChange={(e) => handleUpdateEntry(index, "result", e.target.value)}
                                                            className={`peer ${entry.errors?.result ? "border-red-500" : ""}`}
                                                        />
                                                        <Label
                                                            htmlFor={`param-${index}-result`}
                                                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-60 top-2 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-80 peer-focus:-translate-y-7"
                                                        >
                                                            {t("blood_test_reports.insert.result")}<p className="text-red-600">*</p>
                                                        </Label>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col min-w-[120px] text-sm text-muted-foreground mt-4 md:mt-0">
                                                    {paramDetails && (
                                                        <span>
                                                            {paramDetails.standardMin} - {paramDetails.standardMax}{" " + formatUnit(paramDetails.unit)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-col mt-4 md:mt-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            if (entries.length === 1) {
                                                                setEntries([{ parameterName: "", result: "" }]);
                                                            } else {
                                                                setEntries(entries.filter((_, i) => i !== index));
                                                            }
                                                        }}
                                                        className="mt-4 md:mt-0"
                                                        aria-label="Remove entry"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {isDuplicate(entry.parameterName) && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {t("blood_test_reports.insert.error.duplicate")}
                                                </p>
                                            )}
                                            {entry.result && !isValidResult(entry.result) && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {t("blood_test_reports.insert.error.invalid_result")}
                                                </p>
                                            )}
                                            {paramDetails && entry.result && !isNaN(Number(entry.result)) && (
                                                <div className="relative mt-4 w-full">
                                                    <div className="h-3 w-full rounded-full bg-gradient-to-r from-red-500 via-green-400 to-red-500" />
                                                    <motion.div
                                                        className="absolute top-[-14px] text-xl"
                                                        animate={{
                                                            left: `${Math.min(100, Math.max(0,
                                                                ((Number(entry.result) - paramDetails.standardMin) /
                                                                    (paramDetails.standardMax - paramDetails.standardMin)) * 100)
                                                            )}%`,
                                                        }}
                                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                                        style={{ transform: "translate(-50%, 10%)" }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                            className="w-5 h-5"
                                                        >
                                                            <path d="M12 0v18M5 11l7 7 7-7" />
                                                        </svg>
                                                    </motion.div>

                                                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                                                        <span>{paramDetails.standardMin}</span>
                                                        <span className="absolute left-1/2 -translate-x-1/2">{(paramDetails.standardMax+paramDetails.standardMin)/2}</span>
                                                        <span>{paramDetails.standardMax}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                    )}
                    <div className="flex justify-between mb-6">
                        <Button onClick={handleAddParameter}>
                            {t("blood_test_reports.insert.add_parameter")}
                        </Button>
                        <Button onClick={handleSubmit} className="ml-auto">
                            {t("blood_test_reports.insert.submit")}
                        </Button>
                    </div>
                    {showIncompleteWarning && (
                        <p className="text-red-500 text-sm mt-2 mb-4">
                            {t("blood_test_reports.insert.error.incomplete_entry")}
                        </p>
                    )}
                    {showConfirmModal && (
                        <ConfirmEntriesModal
                            entries={paramsWithResults}
                            onConfirm={confirmSubmit}
                            onCancel={cancelSubmit}
                        />
                    )}
                    </>
                    )}}
                />
            </div>
        </main>
    );
}