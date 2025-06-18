import {Dialog, DialogContent, DialogFooter} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button";
import { t } from "i18next";
import DieticianPeriodicSurveyList from "@/components/DieticianPeriodicSurveyList.tsx";

type Props = {
    onConfirm: () => void;
    onCancel: () => void;
};

export default function PeriodicSurveyModal({onConfirm, onCancel}: Props) {
    return (
        <Dialog open onOpenChange={onCancel}>
            <DialogContent className="w-full max-w-[50vw] overflow-x-auto">
                <DieticianPeriodicSurveyList />
            </DialogContent>
            <DialogFooter className="pt-4">
                <Button variant="outline" onClick={onCancel}>
                    {t("common.cancel")}
                </Button>
                <Button variant="outline" onClick={onConfirm}>
                    {t("common.confirm")}
                </Button>
            </DialogFooter>
        </Dialog>
    )
}