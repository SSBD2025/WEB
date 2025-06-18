import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {useTranslation} from "react-i18next";

interface NewDietPlanConfirmationModalProps {
    open: boolean
    name: string
    onConfirm: () => void
    onCancel: () => void
}

export const NewDietPlanConfirmationModal = ({
                                                 open,
                                                 name,
                                                 onConfirm,
                                                 onCancel,
                                             }: NewDietPlanConfirmationModalProps) => {
    const {t} = useTranslation()
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("create_diet_profile.confirm_modal.title")}</DialogTitle>
                    <DialogDescription>
                        {t("create_diet_profile.confirm_modal.description")}
                        <span className="font-semibold ml-1">{name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={onCancel}>
                        {t("create_diet_profile.confirm_modal.cancel")}
                    </Button>
                    <Button onClick={onConfirm}>
                        {t("create_diet_profile.confirm_modal.submit")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
