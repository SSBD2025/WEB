import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SavePyramidDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (name: string) => void;
}

export const NameFoodPyramidModal = ({
                                         open,
                                         onOpenChange,
                                         onConfirm
                                     }: SavePyramidDialogProps) => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const { t } = useTranslation();

    const handleConfirm = () => {
        const trimmed = name.trim();
        if (trimmed.length < 2 || trimmed.length > 20) {
            setError(t("create_diet_profile.name_pyramid_modal.length_error"));
            return;
        }
        onConfirm(trimmed);
        setName("");
        setError("");
        onOpenChange(false);
    };

    const handleClose = () => {
        setName("");
        setError("");
        onOpenChange(false);
    };

    const isValid = name.trim().length >= 2 && name.trim().length <= 20;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("create_diet_profile.name_pyramid_modal.title")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("create_diet_profile.name_pyramid_modal.description")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-1">
                    <Input
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (error) setError("");
                        }}
                        placeholder={t("create_diet_profile.name_pyramid_modal.placeholder")}
                    />
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        {t("create_diet_profile.name_pyramid_modal.cancel")}
                    </Button>
                    <Button onClick={handleConfirm} disabled={!isValid}>
                        {t("create_diet_profile.name_pyramid_modal.submit")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
