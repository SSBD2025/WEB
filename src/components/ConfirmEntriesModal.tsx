import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {ParameterWithResult} from "@/types/blood_test_report";
import {Fragment} from "react";

type Props = {
    entries: ParameterWithResult[];
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmEntriesModal({ entries, onConfirm, onCancel }: Props) {
    const { t } = useTranslation();

    function formatUnit(unit: string): string {
        const unitMap: Record<string, string> = {
            G_DL: "g/dL",
            PERCENT: "%",
            X10_12_U_L: "×10¹²/µL",
            X10_9_U_L: "×10⁹/µL",
            X10_6_U_L: "×10⁶/µL",
            X10_3_U_L: "×10³/µL",
            PG: "pg",
            FL: "fL",
        };
        return unitMap[unit] || unit;
    }

    return (
        <Dialog open onOpenChange={onCancel}>
            <DialogContent className="max-w-xl w-full">
                <DialogHeader>
                    <DialogTitle>{t("common.confirm_changes")}</DialogTitle>
                </DialogHeader>

                <div className="space-y-2 max-h-60 overflow-auto">
                    {entries.length === 0 ? (
                        <div>{t("common.no_entries")}</div>
                    ) : (
                        <div className="grid grid-cols-[1fr_1fr_1fr] gap-x-4 border-b pb-1 font-medium">
                            <div className="p-2 border-b font-semibold">{t("blood_test_reports.insert.parameter_name")}</div>
                            <div className="p-2 border-b font-semibold">{t("blood_test_reports.insert.result")}</div>
                            <div className="p-2 border-b font-semibold">{t("blood_test_reports.insert.normal_range")}</div>
                            {entries.map((entry, idx) => (
                                <Fragment key={idx}>
                                    <div className="p-2 border-b">{entry.parameter.name}</div>
                                    <div className="p-2 border-b">{entry.result}</div>
                                    <div className="p-2 border-b">
                                        {entry.parameter.standardMin}-{entry.parameter.standardMax} {formatUnit(entry.parameter.unit)}
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="pt-4">
                    <Button variant="outline" onClick={onCancel}>
                        {t("common.cancel")}
                    </Button>
                    {entries.length !== 0 && (
                        <Button onClick={onConfirm}>{t("common.confirm")}</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
