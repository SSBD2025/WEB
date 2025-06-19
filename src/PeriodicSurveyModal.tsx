import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import { t } from "i18next";
import DieticianPeriodicSurveyList from "@/components/DieticianPeriodicSurveyList.tsx";
import { GetPeriodicSurvey } from "@/types/periodic_survey";

type Props = {
    onCancel: () => void;
    onSurveySelect: (survey: GetPeriodicSurvey) => void;
};

export default function PeriodicSurveyModal({onCancel, onSurveySelect}: Props) {
    return (
        <Dialog open onOpenChange={onCancel}>
            <DialogContent className="w-full min-w-[1400px] max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>{t("create_diet_profile.periodic_survey.list")}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-auto">
                    <DieticianPeriodicSurveyList
                        onSurveySelect={onSurveySelect}
                        isModal={true}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}