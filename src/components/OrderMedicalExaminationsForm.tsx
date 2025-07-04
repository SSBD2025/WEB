import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import { t } from "i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useOrderMedicalExaminations, useClientValidation } from "@/hooks/useOrderMedicalExaminations";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ROUTES from "@/constants/routes";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DataRenderer from "@/components/shared/DataRenderer";
import axios from "axios";
import { motion } from "framer-motion";

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
  clientId: string;
}

interface FormValues {
  description: string;
  parameters: BloodParameter[];
}

export const OrderMedicalExaminationsForm = ({
  clientId,
}: OrderMedicalExaminationsFormProps) => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useOrderMedicalExaminations();
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<FormValues | null>(
    null,
  );

  const {
    data: clientData,
    status: clientValidationStatus,
    error: clientValidationError,
  } = useClientValidation(clientId);

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
  });

  const selectedParameters = watch("parameters");

  if (!clientId) {
    return (
      <div className="flex items-center justify-center p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t("order_medical_examinations.client_id_required")}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const mappedError = (() => {
    if (!clientValidationError) return undefined;

    if (axios.isAxiosError(clientValidationError)) {
      const status = clientValidationError.response?.status;

      if (status === 404) {
        return {
          title: t("order_medical_examinations.client_not_found"),
          details: t("order_medical_examinations.client_not_found_details"),
        };
      }

      if (status === 409) {
        return {
          title: t("order_medical_examinations.client_has_no_assigned_dietician"),
          details: t("order_medical_examinations.client_has_no_assigned_dietician_details"),
        }
      }

      if (status === 403) {
        return {
          title: t("order_medical_examinations.access_denied"),
          details: t("order_medical_examinations.access_denied_details"),
        };
      }
    }

    return {
      title: t("order_medical_examinations.unknown_error"),
      details: t("states.error.default.message"),
    };
  })();

  const onSubmit = (data: FormValues) => {
    setError(null);

    if (data.parameters.length === 0) {
      return;
    }

    setFormDataToSubmit(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!formDataToSubmit) return;

    try {
      setError(null);

      await mutateAsync({
        clientId,
        description: formDataToSubmit.description,
        parameters: formDataToSubmit.parameters,
      });

      setShowConfirmDialog(false);
      setFormDataToSubmit(null);
      navigate(ROUTES.DIETICIAN_DASHBOARD);
    } catch (error) {
      console.error("Error submitting form:", error);
      setShowConfirmDialog(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmDialog(false);
    setFormDataToSubmit(null);
  };

  const bloodParameters = [
    "HGB",
    "HCT",
    "RBC",
    "MCV",
    "MCH",
    "MCHC",
    "RDW",
    "WBC",
    "EOS",
    "BASO",
    "LYMPH",
    "MONO",
    "PLT",
    "MPV",
    "PDW",
    "PCT",
    "P_LCR",
    "IRON",
    "FERRITIN",
    "B9",
    "D",
    "B12",
    "GLUCOSE",
    "INSULIN",
    "CHOL",
    "CA",
    "ZN",
    "LDL",
    "HDL",
    "OH_D",
    "B6",
  ].map((key) => ({
    value: key,
    label: t(`order_medical_examinations.parameters_list.${key}`),
  }));

  return (
    <DataRenderer
      status={clientValidationStatus}
      data={clientData ? [clientData] : null}
      error={mappedError}
      render={() => (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className={`text-base font-medium ${errors.description ? "text-destructive" : ""}`}
              >
                {t("order_medical_examinations.description")}<span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                {...register("description", {
                  required: t(
                    "order_medical_examinations.description_required",
                  ) as string,
                  minLength: {
                    value: 10,
                    message: t(
                      "order_medical_examinations.description_min_length",
                    ),
                  },
                  maxLength: {
                    value: 500,
                    message: t(
                      "order_medical_examinations.description_max_length",
                    ),
                  },
                })}
                placeholder={t(
                  "order_medical_examinations.description_placeholder",
                )}
                className="min-h-[120px] resize-none"
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label
                  className={`text-base font-medium ${errors.parameters ? "text-destructive" : ""}`}
                >
                  {t("order_medical_examinations.parameters")}<span className="text-red-500">*</span>
                </Label>
                <span className="text-sm text-muted-foreground">
                  {selectedParameters.length}/31{" "}
                  {t("order_medical_examinations.selected")}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-2 border rounded-md">
                {bloodParameters.map((param) => (
                  <div
                    key={param.value}
                    className="flex items-center space-x-2"
                  >
                    <Controller
                      name="parameters"
                      control={control}
                      rules={{
                        validate: (value) =>
                          value.length > 0 ||
                          t("order_medical_examinations.parameters_required"),
                      }}
                      render={({ field }) => (
                        <Checkbox
                          id={`param-${param.value}`}
                          checked={field.value?.includes(
                            param.value as BloodParameter,
                          )}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...field.value, param.value as BloodParameter]
                              : field.value.filter(
                                  (value) => value !== param.value,
                                );
                            field.onChange(updatedValue);
                          }}
                          disabled={
                            !field.value?.includes(
                              param.value as BloodParameter,
                            ) && selectedParameters.length >= 31
                          }
                        />
                      )}
                    />
                    <Label
                      htmlFor={`param-${param.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {param.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.parameters && (
                <p className="text-sm text-destructive mt-1">
                  {errors.parameters.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-[150px]"
              >
                {isPending
                  ? t("order_medical_examinations.submitting")
                  : t("order_medical_examinations.submit")}
              </Button>
            </div>
          </form>

          <AlertDialog
            open={showConfirmDialog}
            onOpenChange={setShowConfirmDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("order_medical_examinations.dialog_title")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("order_medical_examinations.dialog_description")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCancelSubmit}>
                  {t("order_medical_examinations.cancel")}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmSubmit}
                  disabled={isPending}
                >
                  {isPending
                    ? t("order_medical_examinations.ordering")
                    : t("order_medical_examinations.submit")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      )}
    />
  );
};
