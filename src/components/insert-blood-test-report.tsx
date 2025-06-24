import {useBloodParameter, useSubmitReport} from "@/hooks/useBloodParameter.ts";
import { t } from "i18next";
import {Card, CardContent} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {X, Info} from "lucide-react";
import {useEffect, useState, useRef } from "react";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import DataRenderer from "@/components/shared/DataRenderer.tsx";
import {PERMANENT_SURVEY_EMPTY_DIETICIAN} from "@/constants/states.ts";
import { ParameterWithResult, BloodParameter } from "@/types/blood_test_report";
import ROUTES from "@/constants/routes.ts";
import BackButton from "@/components/shared/BackButton.tsx";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {useGetLastBloodTestOrder} from "@/hooks/useOrderMedicalExaminations.ts";

const bloodTestEntrySchema = z.object({
    parameterName: z.string().min(1, t("blood_test_reports.insert.error.empty_parameter")),
    result: z.string()
        .min(1, t("blood_test_reports.insert.error.empty_result"))
        .refine(
            (val) => /^(\d+\.?\d*|\.\d+)$/.test(val.trim()),
            "blood_test_reports.insert.error.invalid_result"
        ),
});

const bloodTestFormSchema = z.object({
    entries: z.array(bloodTestEntrySchema)
        .min(1, "At least one entry is required")
        .refine(
            (entries) => {
                const paramNames = entries.map(e => e.parameterName);
                return paramNames.length === new Set(paramNames).size;
            },
            "blood_test_reports.insert.error.duplicate"
        ),
});

type BloodTestFormData = z.infer<typeof bloodTestFormSchema>;

function mapEntriesToParameters(
    entries: { parameterName: string; result: string }[],
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
    const { data: allBloodParameters, status: bloodStatus, error: bloodError } = useBloodParameter(id!);
    const { data: lastOrder} = useGetLastBloodTestOrder(id!);
    const STORAGE_KEY = "blood_test_entries";
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const isInitializing = useRef(true);

    const form = useForm<BloodTestFormData>({
        resolver: zodResolver(bloodTestFormSchema),
        mode: "onChange",
        defaultValues: {
            entries: [{ parameterName: "", result: "" }],
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control: form.control,
        name: "entries",
    });

    const watchedEntries = form.watch("entries");

    useEffect(() => {
        if (!allBloodParameters) return;

        isInitializing.current = true;

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const hasMeaningfulData = parsed.some(entry =>
                        entry.parameterName && entry.parameterName.trim() !== ""
                    );

                    if (hasMeaningfulData) {
                        replace(parsed);
                        setTimeout(() => {
                            isInitializing.current = false;
                        }, 100);
                        return;
                    }
                }
            } catch (e) {
                console.error("Failed to parse saved entries", e);
            }
        }

        if (lastOrder?.parameters && lastOrder.parameters.length > 0) {
            const validParameterNames = lastOrder.parameters.filter(paramName =>
                allBloodParameters.some(param => param.name === paramName)
            );

            if (validParameterNames.length > 0) {
                const preloadedEntries = validParameterNames.map(paramName => ({
                    parameterName: paramName,
                    result: "",
                }));
                replace(preloadedEntries);
                setTimeout(() => {
                    isInitializing.current = false;
                }, 100);
                return;
            }
        }

        replace([{ parameterName: "", result: "" }]);
        setTimeout(() => {
            isInitializing.current = false;
        }, 100);
    }, [allBloodParameters, lastOrder, replace]);

    useEffect(() => {
        if (isInitializing.current) {
            return;
        }

        const hasAnyData = watchedEntries.some(entry =>
            (entry.parameterName && entry.parameterName.trim() !== "") ||
            (entry.result && entry.result.trim() !== "")
        );

        if (hasAnyData) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(watchedEntries));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [watchedEntries]);

    const handleAddParameter = async () => {
        const isValid = await form.trigger("entries");
        if (!isValid) {
            return;
        }
        append({ parameterName: "", result: "" });
    };

    const handleClearAll = () => {
        replace([{ parameterName: "", result: "" }]);
        form.clearErrors();
        localStorage.removeItem(STORAGE_KEY);
    };

    const handleRemoveEntry = (index: number) => {
        if (fields.length === 1) {
            form.setValue(`entries.${index}.parameterName`, "");
            form.setValue(`entries.${index}.result`, "");
            form.clearErrors();
        } else {
            remove(index);
        }
    };

    const handleSubmit = () => {
        setShowConfirmModal(true);
    };

    const confirmSubmit = () => {
        const data = form.getValues();
        const payload = {
            results: data.entries
                .filter((entry) => entry.parameterName && entry.result)
                .map((entry) => ({
                    result: parseFloat(entry.result),
                    bloodParameter: {
                        name: entry.parameterName,
                    },
                })),
        };
        submitReportMutation.mutate(payload);
        setShowConfirmModal(false);
        localStorage.removeItem(STORAGE_KEY);
    };

    const cancelSubmit = () => {
        setShowConfirmModal(false);
    };

    const mappedError = (() => {
        if (!bloodError) return undefined;

        if (axios.isAxiosError(bloodError)) {
            const backendMessage = bloodError.response?.data?.message;
            return {
                title: backendMessage
                    ? t("exceptions." + backendMessage)
                    : t("errors.generic"),
                details: backendMessage==="permanent_survey_not_found" ? PERMANENT_SURVEY_EMPTY_DIETICIAN.message : ""
            };
        }

        return {
            title: t("exceptions.unexpected_error"),
            details: bloodError.message ?? t("errors.generic"),
        };
    })();

    if (!id) {
        return <div>{t("periodic_survey.loading")}</div>;
    }

    return (
        <main className="flex-grow items-center justify-center flex flex-col">
            <div className="w-full items-center justify-center flex-col max-w-4xl px-4 py-6">
                <BackButton route={ROUTES.DIETICIAN_DASHBOARD}/>
                <DataRenderer
                    status={bloodStatus}
                    data={allBloodParameters}
                    error={mappedError}
                    empty={PERMANENT_SURVEY_EMPTY_DIETICIAN}
                    render={(bloodParams) => {
                        const filteredParameters = (search: string, currentParam?: string) =>
                            bloodParams?.filter(
                                (param) =>
                                    param.name.toLowerCase().includes(search.toLowerCase()) &&
                                    (param.name === currentParam || !watchedEntries.some((entry) => entry.parameterName === param.name))
                            ) || [];

                        const getParameterDetails = (name: string): BloodParameter | undefined =>
                            bloodParams?.find((param) => param.name === name);

                        const paramsWithResults = mapEntriesToParameters(
                            watchedEntries,
                            bloodParams
                        );

                        return (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
                                    <div className="flex justify-between">
                                        <h2 className="text-2xl font-semibold mb-4">
                                            {t("blood_test_reports.insert.insert_title")}
                                        </h2>
                                        <Button
                                            type="button"
                                            onClick={handleClearAll}
                                            variant="destructive"
                                            className="ml-auto"
                                        >
                                            {t("blood_test_reports.insert.clear_all")}
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        <AnimatePresence>
                                            {fields.map((field, index) => {
                                                const currentEntry = watchedEntries[index];
                                                const paramDetails = getParameterDetails(currentEntry?.parameterName || "");
                                                const step = paramDetails ? (paramDetails.standardMax + paramDetails.standardMin) / 100 : 0.1;
                                                return (
                                                    <motion.div
                                                        key={field.id}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -20, transition: { duration: 0.2, delay: index*0.05 } }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <Card className="mb-3">
                                                            <CardContent>
                                                                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                                                                    <div className="flex-1">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`entries.${index}.parameterName`}
                                                                            render={({ field: formField }) => (
                                                                                <FormItem>
                                                                                    <div className="relative w-full">
                                                                                        <FormControl>
                                                                                            <Select
                                                                                                value={formField.value}
                                                                                                onValueChange={formField.onChange}
                                                                                            >
                                                                                                <SelectTrigger className="w-full peer">
                                                                                                    <SelectValue placeholder=" " />
                                                                                                </SelectTrigger>
                                                                                                <SelectContent>
                                                                                                    <SelectGroup>
                                                                                                        <SelectLabel>{t("blood_test_reports.insert.parameters")}</SelectLabel>
                                                                                                        {formField.value && !filteredParameters("", formField.value).some(p => p.name === formField.value) && (
                                                                                                            <SelectItem value={formField.value}>
                                                                                                                {formField.value}
                                                                                                            </SelectItem>
                                                                                                        )}
                                                                                                        {filteredParameters("", formField.value).map((param) => (
                                                                                                            <SelectItem key={param.name} value={param.name}>
                                                                                                                {param.name}
                                                                                                            </SelectItem>
                                                                                                        ))}
                                                                                                    </SelectGroup>
                                                                                                </SelectContent>
                                                                                            </Select>
                                                                                        </FormControl>
                                                                                        <FormLabel
                                                                                            htmlFor={`param-${index}`}
                                                                                            className={`absolute text-sm text-gray-500 duration-300 transform top-2 z-10 origin-[0] left-3 ${
                                                                                                formField.value
                                                                                                    ? "-translate-y-3 scale-75"
                                                                                                    : "translate-y-0 scale-100 peer-focus:-translate-y-3 peer-focus:scale-80"
                                                                                            }`}>
                                                                                            {t("blood_test_reports.insert.parameter_name")}<span className="text-red-600 ml-1">*</span>
                                                                                        </FormLabel>
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
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <FormField
                                                                            control={form.control}
                                                                            name={`entries.${index}.result`}
                                                                            render={({ field: formField }) => (
                                                                                <FormItem>
                                                                                    <div className="relative w-full">
                                                                                        <FormControl>
                                                                                            <Input
                                                                                                type="number"
                                                                                                step={step}
                                                                                                placeholder=" "
                                                                                                className="peer w-full"
                                                                                                {...formField}
                                                                                            />
                                                                                        </FormControl>
                                                                                        <FormLabel className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-2 z-10 origin-[0] left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
                                                                                            {t("blood_test_reports.insert.result")}<span className="text-red-600 ml-1">*</span>
                                                                                        </FormLabel>
                                                                                    </div>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                    </div>
                                                                    <div className="flex flex-col min-w-[120px] self-center text-sm text-muted-foreground mt-4 md:mt-0">
                                                                        {paramDetails && (
                                                                            <span>
                                                                                {paramDetails.standardMin} - {paramDetails.standardMax}{" " + formatUnit(paramDetails.unit)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex flex-col mt-4 md:mt-0">
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => handleRemoveEntry(index)}
                                                                            aria-label="Remove entry"
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                                {paramDetails && currentEntry?.result && !isNaN(Number(currentEntry.result)) && (
                                                                    <div className="relative mt-4 w-full">
                                                                        <div className="h-3 w-full rounded-full bg-gradient-to-r from-red-500 via-green-400 to-red-500" />
                                                                        <motion.div
                                                                            className="absolute top-[-14px] text-xl"
                                                                            animate={{
                                                                                left: `${Math.min(100, Math.max(0,
                                                                                    ((Number(currentEntry.result) - paramDetails.standardMin) /
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
                                                                            <span className="absolute left-1/2 -translate-x-1/2">{Math.round(((paramDetails.standardMax + paramDetails.standardMin) / 2) * 1000) / 1000}</span>
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
                                    </div>
                                    <div className="flex justify-between mb-6 mt-4">
                                        <Button type="button" onClick={handleAddParameter}>
                                            {t("blood_test_reports.insert.add_parameter")}
                                        </Button>
                                        <Button type="submit" className="ml-auto">
                                            {t("blood_test_reports.insert.submit")}
                                        </Button>
                                    </div>
                                    {showConfirmModal && (
                                        <ConfirmEntriesModal
                                            entries={paramsWithResults}
                                            onConfirm={confirmSubmit}
                                            onCancel={cancelSubmit}
                                        />
                                    )}
                                </form>
                            </Form>
                        );
                    }}
                />
            </div>
        </main>
    );
}