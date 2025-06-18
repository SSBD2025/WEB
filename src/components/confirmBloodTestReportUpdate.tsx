import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { BloodTestReport } from "@/types/blood_test_report";

interface ConfirmBloodTestReportUpdatesProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    report: BloodTestReport | null;
    isLoading?: boolean;
}

export default function ConfirmBloodTestReportUpdates({
                                                          isOpen,
                                                          onClose,
                                                          onConfirm,
                                                          isLoading = false,
                                                      }: ConfirmBloodTestReportUpdatesProps) {
    const { t } = useTranslation();

    const handleConfirm = () => {
        onConfirm();
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{
                                duration: 0.2,
                                ease: "easeOut"
                            }}
                        >
                            <DialogHeader className="text-center">
                                <motion.div
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.1,
                                        type: "spring",
                                        stiffness: 200
                                    }}
                                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20"
                                >
                                    <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                >
                                    <DialogTitle className="text-lg font-semibold">
                                        {t("confirm_blood_test_updates.title")}
                                    </DialogTitle>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.3 }}
                                >
                                    <DialogDescription className="text-sm text-muted-foreground mt-2">
                                        {t("confirm_blood_test_updates.description"
                                        )}
                                    </DialogDescription>
                                </motion.div>
                            </DialogHeader>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                            >
                                <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={handleClose}
                                        disabled={isLoading}
                                        className="w-full sm:w-auto"
                                        asChild
                                    >
                                        <motion.button
                                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                            transition={{ duration: 0.1 }}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            {t("confirm_blood_test_updates.cancel")}
                                        </motion.button>
                                    </Button>

                                    <Button
                                        onClick={handleConfirm}
                                        disabled={isLoading}
                                        className="w-full sm:w-auto relative"
                                        asChild
                                    >
                                        <motion.button
                                            whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                            whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                            transition={{ duration: 0.1 }}
                                        >
                                            <AnimatePresence mode="wait">
                                                {isLoading ? (
                                                    <motion.div
                                                        key="loading"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="flex items-center"
                                                    >
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{
                                                                duration: 1,
                                                                repeat: Infinity,
                                                                ease: "linear"
                                                            }}
                                                            className="h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full"
                                                        />
                                                        {t("confirm_blood_test_updates.saving")}
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="confirm"
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="flex items-center"
                                                    >
                                                        <Check className="h-4 w-4 mr-2" />
                                                        {t("confirm_blood_test_updates.confirm")}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                    </Button>
                                </DialogFooter>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}