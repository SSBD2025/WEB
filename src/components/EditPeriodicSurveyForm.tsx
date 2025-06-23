import { useForm } from "react-hook-form";
import {GET_LATEST_PERIODIC_SURVEY_CLIENT, useEditLatestPeriodicSurvey} from "@/hooks/useSubmitPeriodicSurvey.ts";
import { EditPeriodicSurvey } from "@/types/periodic_survey";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {useState} from "react";
import ConfirmSurveyChangesModal from "@/components/ConfirmSurveyChangesModal.tsx";
import {useSearchParams} from "react-router";
import {queryClient} from "@/lib/queryClient.ts";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";

type Props = {
    defaultValues: EditPeriodicSurvey;
    onSuccess?: () => void;
};

export default function EditPeriodicSurveyForm({ defaultValues, onSuccess }: Props) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EditPeriodicSurvey>({
        defaultValues,
    });
    const [searchParams] = useSearchParams()
    const pageParam = searchParams.get("page") || "1"
    const page = Number.parseInt(pageParam, 10)
    const pageSize = 10

    const { t } = useTranslation();
    const mutation = useEditLatestPeriodicSurvey({
        page: page - 1,
        size: pageSize,
    });

    const [pendingData, setPendingData] = useState<EditPeriodicSurvey | null>(null);

    const onSubmit = (data: EditPeriodicSurvey) => {
        setPendingData(data);
    };

    const confirmChanges = async () => {
        if (!pendingData) return;
        mutation.mutate(pendingData, {
            onSuccess: () => {
                onSuccess?.()
                queryClient.invalidateQueries({queryKey: [GET_LATEST_PERIODIC_SURVEY_CLIENT]})
            }
        });
        setPendingData(null);
    };


    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <Label className="text-medium p-2">
                    {t("periodic_survey.form.label.weight")}
                    <p className="text-red-600">*</p>
                </Label>
                <Input
                    type="number"
                    step="0.1"
                    {...register("weight", {
                        required: { value: true, message: t("periodic_survey.form.violations.required") },
                        min: { value: 30, message: t("periodic_survey.form.violations.weight_min") },
                        max: { value: 350, message: t("periodic_survey.form.violations.weight_max") },
                    })}
                    className="input w-full"
                />
                {errors.weight && (
                    <p className="text-red-600 text-sm p-1">{errors.weight.message as string}</p>
                )}

            </div>
`
            <div>
                <Label className="text-medium p-2">
                    {t("periodic_survey.form.label.blood_pressure")}
                    <p className="text-red-600">*</p>
                </Label>
                <Input
                    type="text"
                    {...register("bloodPressure", {
                        required: { value: true, message: t("periodic_survey.form.violations.required") },
                        pattern: {
                            value: /^[0-9]{2,3}\/[0-9]{2,3}$/,
                            message: t("periodic_survey.form.violations.blood_pressure_pattern"),
                        },
                    })}
                    className="input w-full"
                />
                {errors.bloodPressure && (
                    <p className="text-red-600 text-sm p-1">{errors.bloodPressure.message as string}</p>
                )}
            </div>

            <div>
                <Label className="text-medium p-2">
                    {t("periodic_survey.form.label.blood_sugar")}
                    <p className="text-red-600">*</p>
                </Label>
                <Input
                    type="number"
                    step="0.1"
                    {...register("bloodSugarLevel", {
                        required: { value: true, message: t("periodic_survey.form.violations.required") },
                        min: { value: 10, message: t("periodic_survey.form.violations.blood_sugar_min") },
                        max: { value: 500, message: t("periodic_survey.form.violations.blood_sugar_max") },
                    })}
                    className="input w-full"
                />
                {errors.bloodSugarLevel && (
                    <p className="text-red-600 text-sm p-1">{errors.bloodSugarLevel.message as string}</p>
                )}

            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                    {t("common.submit")}
                </Button>
            </div>
        </form>
        {pendingData && (
            <ConfirmSurveyChangesModal
                oldData={defaultValues}
                newData={pendingData}
                onConfirm={confirmChanges}
                onCancel={() => setPendingData(null)}
            />
        )}
        </>
    );
}
