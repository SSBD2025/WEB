import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EditPeriodicSurvey } from "@/types/periodic_survey";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
    oldData: EditPeriodicSurvey;
    newData: EditPeriodicSurvey;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmSurveyChangesModal({
                                                      oldData,
                                                      newData,
                                                      onConfirm,
                                                      onCancel,
                                                  }: Props) {
    const { t } = useTranslation();
    const keyMap: Record<keyof EditPeriodicSurvey, string> = {
        weight: "weight",
        bloodPressure: "blood_pressure",
        bloodSugarLevel: "blood_sugar",
        lockToken: "", //leave this in otherwise ts is screaming
    };

    const changes = Object.entries(newData)
        .filter(([key, newVal]) => {
            const oldVal = oldData[key as keyof EditPeriodicSurvey];
            const normalizedNewVal =
                typeof oldVal === "number" && typeof newVal === "string"
                    ? parseFloat(newVal)
                    : newVal;
            return normalizedNewVal !== oldVal;
        })
        .map(([key, newVal]) => {
            const oldVal = oldData[key as keyof EditPeriodicSurvey];
            const shortKey = keyMap[key as keyof EditPeriodicSurvey];
            return {
                label: shortKey ? t(`periodic_survey.form.label.${shortKey}`) : key,
                oldVal,
                newVal,
            };
        });

    return (
        <Dialog open onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("common.confirm_changes")}</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    {changes.length === 0 && (
                        <div>
                            Nothing changed!
                        </div>
                    )}
                    {changes.map((change, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <span className="font-medium">{change.label}:</span>
                            <span>{change.oldVal}</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold">{change.newVal}</span>
                        </div>
                    ))}
                </div>

                <DialogFooter className="pt-4">
                    <Button variant="outline" onClick={onCancel}>
                        {t("common.cancel")}
                    </Button>
                    {changes.length !== 0 && (
                        <Button onClick={onConfirm}>{t("common.confirm")}</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
