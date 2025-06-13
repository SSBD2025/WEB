import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { useNavigate } from "react-router"
import { t } from "i18next"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useOrderMedicalExaminations } from "@/hooks/useOrderMedicalExaminations"

import { Checkbox } from "@/components/ui/checkbox"
import ROUTES from "@/constants/routes"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

enum BloodParameter {
    HGB = "HGB",
    HCT = "HCT",
    RBC = "RBC",
    MCV = "MCV",
    MCH = "MCH",
    MCHC = "MCHC",
    RDW = "RDW",
    WBC = "WBC",
    EOS = "EOS",
    BASO = "BASO",
    LYMPH = "LYMPH",
    MONO = "MONO",
    PLT = "PLT",
    MPV = "MPV",
    PDW = "PDW",
    PCT = "PCT",
    P_LCR = "P_LCR",
    IRON = "IRON",
    FERRITIN = "FERRITIN",
    B9 = "B9",
    D = "D",
    B12 = "B12",
    GLUCOSE = "GLUCOSE",
    INSULIN = "INSULIN",
    CHOL = "CHOL",
    CA = "CA",
    ZN = "ZN",
    LDL = "LDL",
    HDL = "HDL",
    OH_D = "OH_D",
    B6 = "B6",
}

interface OrderMedicalExaminationsFormProps {
    clientId: string
}

interface FormValues {
    description: string
    parameters: BloodParameter[]
}

export const OrderMedicalExaminationsForm = ({ clientId }: OrderMedicalExaminationsFormProps) => {
    const navigate = useNavigate()
    const { mutateAsync, isPending } = useOrderMedicalExaminations()
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        watch,
    } = useForm<FormValues>({
        defaultValues: {
            description: "",
            parameters: [],
        },
    })

    const selectedParameters = watch("parameters")

    const onSubmit = async (data: FormValues) => {
        try {
            setError(null)

            if (data.parameters.length === 0) {
                setError(t("order_medical_examinations.error_no_parameters"))
                return
            }

            await mutateAsync({
                clientId,
                description: data.description,
                parameters: data.parameters,
            })

            navigate(ROUTES.DIETICIAN_DASHBOARD)
        } catch (error) {
            console.error("Error submitting form:", error)
        }
    }

    const bloodParameters = [
        "HGB", "HCT", "RBC", "MCV", "MCH", "MCHC", "RDW", "WBC", "EOS", "BASO",
        "LYMPH", "MONO", "PLT", "MPV", "PDW", "PCT", "P_LCR", "IRON", "FERRITIN",
        "B9", "D", "B12", "GLUCOSE", "INSULIN", "CHOL", "CA", "ZN", "LDL", "HDL",
        "OH_D", "B6"
    ].map((key) => ({
        value: key,
        label: t(`order_medical_examinations.parameters_list.${key}`)
    }))

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium">
                    {t("order_medical_examinations.description")}
                </Label>
                <Textarea
                    id="description"
                    {...register("description", {
                        required: t("order_medical_examinations.description_required") as string,
                        minLength: {
                            value: 10,
                            message: t("order_medical_examinations.description_min_length"),
                        },
                        maxLength: {
                            value: 500,
                            message: t("order_medical_examinations.description_max_length"),
                        },
                    })}
                    placeholder={t("order_medical_examinations.description_placeholder")}
                    className="min-h-[120px] resize-none"
                />
                {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">{t("order_medical_examinations.parameters")}</Label>
                    <span className="text-sm text-muted-foreground">
            {selectedParameters.length}/31 {t("order_medical_examinations.selected")}
          </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-2 border rounded-md">
                    {bloodParameters.map((param) => (
                        <div key={param.value} className="flex items-center space-x-2">
                            <Controller
                                name="parameters"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id={`param-${param.value}`}
                                        checked={field.value?.includes(param.value as BloodParameter)}
                                        onCheckedChange={(checked) => {
                                            const updatedValue = checked
                                                ? [...field.value, param.value as BloodParameter]
                                                : field.value.filter((value) => value !== param.value)
                                            field.onChange(updatedValue)
                                        }}
                                        disabled={!field.value?.includes(param.value as BloodParameter) && selectedParameters.length >= 31}
                                    />
                                )}
                            />
                            <Label htmlFor={`param-${param.value}`} className="text-sm cursor-pointer">
                                {param.label}
                            </Label>
                        </div>
                    ))}
                </div>
                {errors.parameters && <p className="text-sm text-destructive mt-1">{errors.parameters.message}</p>}
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isPending} className="min-w-[150px]">
                    {isPending ? t("order_medical_examinations.submitting") : t("order_medical_examinations.submit")}
                </Button>
            </div>
        </form>
    )
}
