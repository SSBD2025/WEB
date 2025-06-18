import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {useTranslation} from "react-i18next";

interface SavePyramidDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (name: string) => void
}

export const NameFoodPyramidModal = ({ open, onOpenChange, onConfirm }: SavePyramidDialogProps) => {
    const [name, setName] = useState("")
    const { t } = useTranslation()

    const handleConfirm = () => {
        onConfirm(name.trim())
        setName("")
        onOpenChange(false)
    }

    const handleClose = () => {
        setName("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("create_diet_profile.name_pyramid_modal.title")}</DialogTitle>
                    <DialogDescription>
                        {t("create_diet_profile.name_pyramid_modal.description")}
                    </DialogDescription>
                </DialogHeader>

                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("create_diet_profile.name_pyramid_modal.placeholder")}
                />

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        {t("create_diet_profile.name_pyramid_modal.cancel")}
                    </Button>
                    <Button onClick={handleConfirm} disabled={!name.trim()}>
                        {t("create_diet_profile.name_pyramid_modal.submit")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
