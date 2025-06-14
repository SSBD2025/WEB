import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditPeriodicSurveyForm from "./EditPeriodicSurveyForm";
import { EditPeriodicSurvey } from "@/types/periodic_survey";
import { useTranslation } from "react-i18next";
import { Pencil } from "lucide-react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    defaultValues: EditPeriodicSurvey;
};

export default function EditSurveyModal({ isOpen, onClose, defaultValues }: Props) {
    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Pencil className="w-5 h-5" />
                        {t("periodic_survey.client.edit.title")}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <EditPeriodicSurveyForm defaultValues={defaultValues} onSuccess={onClose} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
