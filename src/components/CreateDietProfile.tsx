import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import { Separator } from "@radix-ui/react-select";
import {ArrowLeft, ArrowRight, Pencil, Save, Star} from "lucide-react";
import {Badge} from "@/components/ui/badge"
import {useEffect, useMemo, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useGetClientPermanentSurvey} from "@/hooks/useSubmitPermanentSurvey.ts";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useGetAllDieticianPeriodicSurvey} from "@/hooks/useSubmitPeriodicSurvey.ts";
import {useSearchParams} from "react-router";
import {useClientBloodTestByDieticianReports} from "@/hooks/useClientBloodTestReports.ts";
import {useGetAllFoodPyramids} from "@/hooks/useGetAllFoodPyramids.ts";
import {useGenerateDietProfileByAlgorithm} from "@/hooks/useGenerateDietProfileByAlgorithm.ts";
import {FoodPyramid} from "@/types/food_pyramid";
import { NameFoodPyramidModal } from "@/components/nameFoodPyramidModal"
import {NewDietPlanConfirmationModal} from "@/components/newDietPlanConfirmationModal.tsx";
import {useCreateNewDietPlan} from "@/hooks/useCreateNewDietPlan.ts";
import PeriodicSurveyModal from "@/PeriodicSurveyModal.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import { motion } from "motion/react";
import DataRenderer from "@/components/shared/DataRenderer.tsx";
import {
    CDP_CLIENT_BLOOD_EMPTY,
    CDP_CLIENT_DATA_EMPTY,
    CDP_CLIENT_PERIODIC_EMPTY,
    CDP_FOOD_PYRAMID_EMPTY,
} from "@/constants/states.ts";


export default function CreateDietProfile() {
    const { clientId } = useParams<{ clientId: string }>();
    const [timeZone, setTimezone] = useState<string>();
    const [locale, setLocale] = useState<string>();
    const { t } = useTranslation()
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingName, setPendingName] = useState("");

    const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

    const { data:clientData, error:clientDataError, status:clientDataStatus } = useGetClientPermanentSurvey(clientId!);
    const [searchParams] = useSearchParams();
    const since = searchParams.get("since") || undefined;
    const before = searchParams.get("before") || undefined;
    const pageParam = searchParams.get("page") || "1";
    const sort = searchParams.get("sort") || "measurementDate,desc";
    const page = Number.parseInt(pageParam, 10);
    const pageSize = 50;
    const {data:algorithm } = useGenerateDietProfileByAlgorithm(clientId!);
    const { data:periodicSurveyList, error:periodicSurveyError, status:periodicSurveyStatus } = useGetAllDieticianPeriodicSurvey(
        {
            page: page - 1,
            size: pageSize,
            since,
            before,
            sort,
        },
        clientId,
        {
            enabled: !!clientId,
        }
    );
    const [selectedExisting, setSelectedExisting] = useState<FoodPyramid | null>(null);
    const { data:clientBloodTestReports, error:clientBloodTestReportsError , status:clientBloodTestReportsStatus } = useClientBloodTestByDieticianReports(clientId)
    const { data:foodPyramidsDataList, error:foodPyramidsError, status:foodPyramidsStatus } = useGetAllFoodPyramids()
    const saveMutation = useCreateNewDietPlan(clientId!)


    const [workspace, setWorkspace] = useState<Record<string, string>>({});

    const nutrientRows: NutrientRow[] = useMemo(() => {
        if (!algorithm || !selectedExisting) return [];

        const result: NutrientRow[] = [];

        for (const [key, algoValue] of Object.entries(algorithm)) {
            if (typeof algoValue !== "number" || key === "averageRating") continue;

            const existingValue = selectedExisting[key as keyof FoodPyramid] ?? "-";
            const workspaceValue = workspace[key] ?? String(algoValue);

            result.push({
                name: key,
                existing: existingValue,
                algorithm: algoValue,
                workspace: workspaceValue,
            });
        }

        return result;
    }, [algorithm, selectedExisting, workspace]);


    
    useEffect(() => {
        const storedTz =
            localStorage.getItem("user-timezone") ||
            Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(storedTz);

        const storedLocale =
            localStorage.getItem("i18nextLng") || "pl-PL"
        setLocale(storedLocale);
        if (algorithm) {
            const initial = Object.fromEntries(
                Object.entries(algorithm)
                    .filter(([, v]) => typeof v === "number")
                    .map(([k, v]) => [k, String(v)])
            );
            setWorkspace(initial);
        }
    }, [algorithm])

    const confirmSubmit = () => {
        setIsSurveyModalOpen(false);
    };

    const cancelSubmit = () => {
        setIsSurveyModalOpen(false);
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

    const handleWorkspaceChange = (name: string, value: string) => {
        setWorkspace((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setIsDialogOpen(true);
    };

    const handleNameEntered = (name: string) => {
        setPendingName(name);
        setIsConfirmOpen(true);
    };


    const handleConfirmSave = () => {
        const newPyramid = Object.fromEntries(
            Object.entries(workspace).map(([key, value]) => [
                key,
                value.trim() === "" ? null : Number(value),
            ])
        );

        const fullPyramid = {
            ...newPyramid,
            name: pendingName.trim(),
        };

        saveMutation.mutate(fullPyramid as FoodPyramid)

        setIsConfirmOpen(false);
        setIsDialogOpen(false);
        setPendingName("");
    };


    const [currentIndexSurvey, setCurrentIndexSurvey] = useState(0);
    const currentSurvey = periodicSurveyList?.content?.[currentIndexSurvey];
    const totalSurveys = periodicSurveyList?.content?.length || 0;
    const goToPreviousPeriodicSurvey = () => {
        setCurrentIndexSurvey(prev =>
            prev > 0 ? prev - 1 : (periodicSurveyList?.content?.length || 1) - 1
        );
    };

    const goToNextPeriodicSurvey = () => {
        setCurrentIndexSurvey(prev =>
            prev < (periodicSurveyList?.content?.length || 1) - 1 ? prev + 1 : 0
        );
    };

    const [currentIndexBlood, setCurrentIndexBlood] = useState(0);
    const currentBlood = clientBloodTestReports?.[currentIndexBlood];
    const totalBlood = clientBloodTestReports?.length || 0;
    const goToPreviousClientBloodTestReport = () => {
        setCurrentIndexBlood(prev =>
            prev > 0 ? prev - 1 : (clientBloodTestReports?.length || 1) - 1
        );
    };

    const goToNextClientBloodTestReport = () => {
        setCurrentIndexBlood(prev =>
            prev < (clientBloodTestReports?.length || 1) - 1 ? prev + 1 : 0
        );
    };


    const formatDateTime = (dateString:Date) => {
        if (!dateString) return 'Brak daty';
        return new Date(dateString).toLocaleDateString(locale, {
            timeZone: timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const formatTime = (dateString:Date) => {
        if (!dateString) return 'Brak daty';
        return new Date(dateString).toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const copyFromExisting = () => {
        const newWorkspace = { ...workspace };
        for (const key in selectedExisting) {
            if (typeof selectedExisting[key as keyof typeof selectedExisting] === "number") {
                newWorkspace[key] = String(selectedExisting[key as keyof typeof selectedExisting]);
            }
        }
        setWorkspace(newWorkspace);
    };

    const copyFromAlgorithm = () => {
        const newWorkspace = { ...workspace };
        for (const key in algorithm) {
            if (
                typeof algorithm[key as keyof typeof algorithm] === "number" &&
                !["averageRating", "id", "name"].includes(key)
            ) {
                newWorkspace[key] = String(algorithm[key as keyof typeof algorithm]);
            }
        }
        setWorkspace(newWorkspace);
    };

    const copySingleFromExisting = (key: string) => {
        if (!selectedExisting) return;

        const value = selectedExisting[key as keyof FoodPyramid];
        if (typeof value === "number") {
            setWorkspace((prev) => ({ ...prev, [key]: String(value) }));
        }
    };

    const copySingleFromAlgorithm = (key: string) => {
        if (!algorithm) return;

        const value = algorithm[key as keyof FoodPyramid];
        if (typeof value === "number" && !["averageRating", "id", "name"].includes(key)) {
            setWorkspace((prev) => ({ ...prev, [key]: String(value) }));
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-full">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6 items-stretch">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="xl:col-span-3 h-full"
                >
                    <DataRenderer
                        className="h-full"
                        status={clientDataStatus}
                        error={clientDataError}
                        data={clientData}
                        empty={CDP_CLIENT_DATA_EMPTY}
                        render={() => (
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle className="text-lg">{t("create_diet_profile.permanent_survey.table_name")}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-5 gap-3 mb-4 text-sm">
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.name")}</div>
                                            {/*<div className="font-medium">{clientData?.firstName} {clientData.lastName}</div>*/}
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.height")}</div>
                                            <div className="font-medium">{clientData?.height} cm</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.activity_level")}</div>
                                            <div className="font-medium">{t(`permanent_survey_form.activity_level_name.${clientData?.activityLevel}`)}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.age.age")}</div>
                                            <div className="font-medium">  {clientData?.dateOfBirth
                                                ? Math.floor((Date.now() - new Date(clientData.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
                                                : t("create_diet_profile.age.no_date_of_birth")}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.smokes.smokes")}</div>
                                            <div className="font-medium">{clientData?.smokes ? t("create_diet_profile.permanent_survey.smokes.true") : t("create_diet_profile.permanent_survey.smokes.false")}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-5 gap-3 mb-4 text-sm">
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.gender.gender")}</div>
                                            <div className="font-medium">{clientData?.gender ? t("create_diet_profile.permanent_survey.gender.male") : t("create_diet_profile.permanent_survey.gender.female")}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.drinks_alcohol.drinks")}</div>
                                            <div className="font-medium">{clientData?.drinksAlcohol  ? t("create_diet_profile.permanent_survey.drinks_alcohol.true") : t("create_diet_profile.permanent_survey.drinks_alcohol.false")}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.meals_per_day")}</div>
                                            <div className="font-medium">{clientData?.mealsPerDay}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.nutrition_goal")}</div>
                                            <div className="font-medium">{t(`permanent_survey_form.${clientData?.nutritionGoal.toLowerCase()}`)}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.eating_habits")}</div>
                                            <div className="font-medium">{clientData?.eatingHabits}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-5 gap-3 mb-4 text-sm">
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.medications")}</div>
                                            <div className="font-medium text-xs">{clientData?.medications.map((medication) => <p>{medication}</p>)}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.illnesses")}</div>
                                            <div className="font-medium text-xs">{clientData?.illnesses.map((illness) => <p>{illness}</p>)}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.allergies")}</div>
                                            <div className="font-medium text-xs">{clientData?.allergies.map((allergy) => <p>{allergy}</p>)}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.diet_preferences")}</div>
                                            <div className="font-medium text-xs">{clientData?.dietPreferences.map((preference) => <p>{preference}</p>)}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">{t("create_diet_profile.permanent_survey.meal_times")}</div>
                                            <div className="font-medium text-xs">{clientData?.mealTimes.map((mealTime) => <p>{formatTime(new Date(mealTime))}</p>)}</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}>
                    </DataRenderer>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="xl:col-span-1 h-full"
                >
                    <DataRenderer
                        className="h-full"
                        status={periodicSurveyStatus}
                        error={periodicSurveyError}
                        data={currentSurvey}
                        empty={CDP_CLIENT_PERIODIC_EMPTY}
                        render={() => (
                            <Card className="h-full flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center justify-between">
                                        {t("create_diet_profile.periodic_survey.table_name")}
                                        {totalSurveys > 1 && (
                                            <>
                                                <Button
                                                    onClick={() => setIsSurveyModalOpen(true)}
                                                    variant="ghost"

                                                >
                                                    <Pencil />{t("create_diet_profile.periodic_survey.list")}
                                                </Button>
                                                <span className="text-sm font-normal text-muted-foreground">
                                                    {currentIndexSurvey + 1} {t("create_diet_profile.periodic_survey.from")} {totalSurveys}
                                                </span>
                                            </>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="h-full flex flex-col flex-1">
                                    <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">
                                                {t("create_diet_profile.periodic_survey.blood_sugar_level")}
                                            </div>
                                            <div className="font-medium">
                                                {currentSurvey?.bloodSugarLevel ?
                                                    `${currentSurvey.bloodSugarLevel} mg/dl` :
                                                    t("create_diet_profile.no_data")
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">
                                                {t("create_diet_profile.periodic_survey.weight")}
                                            </div>
                                            <div className="font-medium">
                                                {currentSurvey?.weight ?
                                                    `${currentSurvey.weight} kg` :
                                                    t("create_diet_profile.no_data")
                                                }
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-muted-foreground">
                                                {t("create_diet_profile.periodic_survey.blood_pressure")}
                                            </div>
                                            <div className="font-medium">
                                                {currentSurvey?.bloodPressure ?
                                                    `${currentSurvey.bloodPressure} mmHg` :
                                                    t("create_diet_profile.no_data")
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center justify-between mt-auto">
                                        <Button
                                            variant="ghost"
                                            onClick={goToPreviousPeriodicSurvey}
                                            disabled={totalSurveys <= 1}
                                            className={`p-2 rounded-md transition-colors ${
                                                totalSurveys <= 1
                                                    ? 'text-muted-foreground cursor-not-allowed'
                                                    : 'text-foreground hover:bg-muted cursor-pointer'
                                            }`}
                                        >
                                            <ArrowLeft size={20}/>
                                        </Button>

                                        <div className="text-center">
                                            {currentSurvey?.measurementDate && (
                                                <div className="font-medium">
                                                    {t("create_diet_profile.periodic_survey.measurement_date")} {formatDateTime(currentSurvey.measurementDate)}
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            variant="ghost"
                                            onClick={goToNextPeriodicSurvey}
                                            disabled={totalSurveys <= 1}
                                            className={`p-2 rounded-md transition-colors ${
                                                totalSurveys <= 1
                                                    ? 'text-muted-foreground cursor-not-allowed'
                                                    : 'text-foreground hover:bg-muted cursor-pointer'
                                            }`}
                                        >
                                            <ArrowRight size={20}/>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}>
                    </DataRenderer>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-8 gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                    className="xl:col-span-1"
                >
                <DataRenderer
                    className="h-full"
                    status={foodPyramidsStatus}
                    error={foodPyramidsError ? {title: "Error", details: "Details"} : undefined}
                    data={foodPyramidsDataList}
                    empty={CDP_FOOD_PYRAMID_EMPTY}
                    render={() => (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{t("create_diet_profile.existing_profiles_list.table_name")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 h-155 overflow-y-auto">
                                {foodPyramidsDataList?.map((pyramid, index) => (
                                    <div
                                        key={pyramid.id ?? index}
                                        onClick={() => setSelectedExisting(pyramid)}
                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors
                                ${selectedExisting?.id === pyramid.id ? "bg-muted" : "hover:bg-accent"}`}
                                    >
                                        <span className="text-sm font-medium">{pyramid.name}</span>
                                        <span className="flex items-center text-sm text-muted-foreground">{pyramid.averageRating?.toFixed(1) ?? "-"}<Star className="w-4 h-4 ml-2"/></span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    )}>
                </DataRenderer>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                    className="xl:col-span-5"
                >
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex flex-row justify-between items-center w-full">
                                <span>{t("create_diet_profile.algorithm_pane.table_name")}</span>
                                <Button onClick={handleSave} className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    {t("create_diet_profile.algorithm_pane.save_button")}
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 h-155 overflow-y-auto">
                                <Table className="table-fixed">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-left text-lg w-32">{t("create_diet_profile.algorithm_pane.parameter_name")}</TableHead>
                                            <TableHead className="text-center text-lg w-24">{t("create_diet_profile.algorithm_pane.existing")}</TableHead>
                                            <TableHead className="w-12">
                                                <Button
                                                    variant="ghost"
                                                    onClick={copyFromExisting}
                                                    className="h-full w-full mx-auto p-1">
                                                    <ArrowRight className="h-4 w-4 mx-auto" />
                                                </Button>
                                            </TableHead>
                                            <TableHead className="text-center text-lg w-32">{t("create_diet_profile.algorithm_pane.workspace")}</TableHead>
                                            <TableHead className="w-12">
                                                <Button
                                                    variant="ghost"
                                                    onClick={copyFromAlgorithm}
                                                    className="h-full w-full mx-auto p-1">
                                                    <ArrowLeft className="h-4 w-4 mx-auto" />
                                                </Button>
                                            </TableHead>
                                            <TableHead className="text-center text-lg w-24">{t("create_diet_profile.algorithm_pane.algorithm")}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {nutrientRows.map((row) => (
                                            <TableRow key={row.name}>
                                                <TableCell className="text-medium font-medium w-32">{row.name.toUpperCase()}</TableCell>

                                                <TableCell className="text-medium text-center w-24">{row.existing}</TableCell>

                                                <TableCell className="text-center w-12">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => copySingleFromExisting(row.name)}
                                                        className="p-1"
                                                    >
                                                        <ArrowRight className="h-3 w-3 mx-auto text-muted-foreground" />
                                                    </Button>
                                                </TableCell>

                                                <TableCell className="text-center w-24">
                                                    <Input
                                                        value={row.workspace}
                                                        onChange={(e) => handleWorkspaceChange(row.name, e.target.value)}
                                                        className="h-8 text-medium text-center w-full"
                                                    />
                                                </TableCell>

                                                <TableCell className="text-center w-12">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => copySingleFromAlgorithm(row.name)}
                                                        className="p-1"
                                                    >
                                                        <ArrowLeft className="h-3 w-3 mx-auto text-muted-foreground" />
                                                    </Button>
                                                </TableCell>

                                                <TableCell className="text-medium text-center w-24 truncate">{row.algorithm}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
                    className="xl:col-span-2 h-full"
                >
                <DataRenderer
                    className="h-full"
                    status={clientBloodTestReportsStatus}
                    error={clientBloodTestReportsError ? {title: "Error", details: "Details"} : undefined}
                    data={currentBlood}
                    empty={CDP_CLIENT_BLOOD_EMPTY}
                    render={() => (
                    <Card className="h-full flex flex-col">

                        <CardHeader>
                            <CardTitle className="text-lg flex items-center justify-between">
                                {t("create_diet_profile.blood_test_reports.table_name")}
                                {totalBlood > 1 && (
                                    <span className="text-sm font-normal text-muted-foreground">
                            {currentIndexBlood + 1} {t("create_diet_profile.blood_test_reports.from")} {totalBlood}
                        </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-full flex flex-col flex-1">
                            {clientBloodTestReportsStatus==="pending" && (
                                <Spinner/>)}
                            {clientBloodTestReportsStatus==="error" && (
                                <div>
                                    {t("create_diet_profile.blood_test_reports.error")}
                                </div>)}
                            {clientBloodTestReportsStatus === "success" && currentBlood?.results && (
                                <div className="flex flex-col h-full">
                                    <div className="grid grid-cols-4 gap-3 mb-4 text-sm border-b">
                                        <div className="text-medium font-medium">{t("create_diet_profile.blood_test_reports.parameter")}</div>
                                        <div className="text-medium font-medium">{t("create_diet_profile.blood_test_reports.result")}</div>
                                        <div className="text-medium font-medium">{t("create_diet_profile.blood_test_reports.norm")}</div>
                                        <div className="text-medium font-medium">{t("create_diet_profile.blood_test_reports.status")}</div>
                                    </div>

                                    {currentBlood.results.map((currentBloodParam) => {
                                        const status = getResultStatus(
                                            currentBloodParam.result,
                                            currentBloodParam.bloodParameter.standardMin,
                                            currentBloodParam.bloodParameter.standardMax
                                        );

                                        return (
                                            <div key={currentBloodParam.lockToken} className="grid grid-cols-4 gap-3 mb-4 text-sm">
                                                <div className="text-sm font-medium">
                                                    {currentBloodParam.bloodParameter.name}
                                                </div>
                                                <div className="text-sm font-medium">
                                                    {currentBloodParam.result}
                                                </div>
                                                <div className="text-sm font-medium">
                                                    {currentBloodParam.bloodParameter.standardMin} - {currentBloodParam.bloodParameter.standardMax} {formatUnit(currentBloodParam.bloodParameter.unit)}
                                                </div>
                                                <Badge variant={getStatusColor(status)} className='h-4 w-auto'>
                                                    {getStatusText(status)}
                                                </Badge>
                                            </div>
                                        );
                                    })}

                                    <Separator />
                                    <div className="flex flex-row items-center justify-between mt-auto">
                                        <Button
                                            variant="ghost"
                                            onClick={goToPreviousClientBloodTestReport}
                                            disabled={totalBlood <= 1}
                                            className={`p-2 rounded-md transition-colors ${
                                                totalBlood <= 1
                                                    ? 'text-muted-foreground cursor-not-allowed'
                                                    : 'text-foreground hover:bg-muted cursor-pointer'
                                            }`}
                                        >
                                            <ArrowLeft size={20} />
                                        </Button>
                                        <div className="text-center">
                                            {currentBlood?.timestamp && (
                                                <div className="font-medium">
                                                    {t("create_diet_profile.blood_test_reports.measurement_date")} {formatDateTime(new Date(currentBlood.timestamp))}
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            variant="ghost"
                                            onClick={goToNextClientBloodTestReport}
                                            disabled={totalBlood <= 1}
                                            className={`p-2 rounded-md transition-colors ${
                                                totalBlood <= 1
                                                    ? 'text-muted-foreground cursor-not-allowed'
                                                    : 'text-foreground hover:bg-muted cursor-pointer'
                                            }`}
                                        >
                                            <ArrowRight size={20} />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    )}>
                </DataRenderer>
                </motion.div>
            </div>
            <NameFoodPyramidModal
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onConfirm={handleNameEntered}
            />
            <NewDietPlanConfirmationModal
                open={isConfirmOpen}
                name={pendingName}
                onCancel={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmSave}
            />
            {isSurveyModalOpen && (
                <PeriodicSurveyModal
                    onConfirm={confirmSubmit}
                    onCancel={cancelSubmit}
                />
            )}
        </div>
    )
}