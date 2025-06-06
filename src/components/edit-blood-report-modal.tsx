import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"
import { Save, X, TestTube } from "lucide-react"

interface BloodParameter {
    name: string
    description: string
    unit: string
    standardMin: number
    standardMax: number
}

interface BloodTestResult {
    lockToken: string
    result: string
    bloodParameter: BloodParameter
}

interface BloodTestReport {
    lockToken: string
    timestamp: string
    results: BloodTestResult[]
}

interface EditBloodReportModalProps {
    isOpen: boolean
    onClose: () => void
    report: BloodTestReport | null
    onSave: (updatedReport: any) => void
}

export default function EditBloodReportModal({ isOpen, onClose, report, onSave }: EditBloodReportModalProps) {
    const { t } = useTranslation()
    const [editedResults, setEditedResults] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Initialize edited results when report changes
    useEffect(() => {
        if (report) {
            const initialResults: Record<string, string> = {}
            report.results.forEach(result => {
                initialResults[result.lockToken] = result.result
            })
            setEditedResults(initialResults)
        }
    }, [report])

    const formatUnit = (unit: string) => {
        const unitMap: Record<string, string> = {
            'G_DL': 'g/dL',
            'PERCENT': '%',
            'X10_6_U_L': 'x10⁶/µl',
            'X10_3_U_L': 'x10³/µl',
            'PG': 'pg',
            'FL': 'fl'
        }
        return unitMap[unit] || unit
    }

    const getResultStatus = (result: string, min: number, max: number) => {
        const value = Number.parseFloat(result)
        if (isNaN(value)) return "invalid"
        if (value < min) return "low"
        if (value > max) return "high"
        return "normal"
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "low":
            case "high":
                return "destructive"
            case "invalid":
                return "destructive"
            default:
                return "secondary"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "low":
                return t("blood_test_reports.below")
            case "high":
                return t("blood_test_reports.above")
            case "invalid":
                return t("blood_test_reports.invalid")
            default:
                return t("blood_test_reports.normal")
        }
    }

    const handleResultChange = (lockToken: string, value: string) => {
        setEditedResults(prev => ({
            ...prev,
            [lockToken]: value
        }))
    }

    const handleSave = async () => {
        if (!report) return

        setIsSubmitting(true)

        try {
            // Prepare the payload according to your API structure
            const updatedPayload = {
                lockToken: report.lockToken,
                client: null,
                timestamp: null,
                results: report.results.map(result => ({
                    lockToken: result.lockToken,
                    result: editedResults[result.lockToken] || result.result,
                    bloodParameter: result.bloodParameter
                }))
            }

            await onSave(updatedPayload)
            onClose()
        } catch (error) {
            console.error('Error saving blood report:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const isFormValid = () => {
        if (!report) return false

        return report.results.every(result => {
            const value = editedResults[result.lockToken]
            return value && !isNaN(Number.parseFloat(value))
        })
    }

    if (!report) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <TestTube className="h-5 w-5" />
                        {t("blood_test_reports.edit_report")}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        {new Date(report.timestamp).toLocaleString()}
                    </p>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {report.results.map((result) => {
                        const currentValue = editedResults[result.lockToken] || result.result
                        const status = getResultStatus(
                            currentValue,
                            result.bloodParameter.standardMin,
                            result.bloodParameter.standardMax
                        )

                        return (
                            <div
                                key={result.lockToken}
                                className="flex items-center justify-between p-4 border rounded-lg bg-card space-y-2"
                            >
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-lg">{result.bloodParameter.name}</h3>
                                        <Badge variant={getStatusColor(status)}>
                                            {getStatusText(status)}
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground text-sm">
                                        {result.bloodParameter.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t("blood_test_reports.range")} {result.bloodParameter.standardMin} - {result.bloodParameter.standardMax}{" "}
                                        {formatUnit(result.bloodParameter.unit)}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end space-y-2">
                                    <Label htmlFor={`result-${result.lockToken}`} className="text-sm">
                                        {t("blood_test_reports.value")}
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id={`result-${result.lockToken}`}
                                            type="number"
                                            step="0.1"
                                            value={currentValue}
                                            onChange={(e) => handleResultChange(result.lockToken, e.target.value)}
                                            className="w-24 text-center"
                                            placeholder="0.0"
                                        />
                                        <span className="text-sm text-muted-foreground min-w-fit">
                                            {formatUnit(result.bloodParameter.unit)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        <X className="h-4 w-4 mr-2" />
                        {t("common.cancel")}
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!isFormValid() || isSubmitting}
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {isSubmitting ? t("common.saving") : t("common.save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}