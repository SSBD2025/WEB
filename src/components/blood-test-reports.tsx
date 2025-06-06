import { useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {ChevronDown, ChevronRight, Calendar, TestTube, ArrowDown, ArrowUp, Edit} from "lucide-react"
import { useClientBloodTestReports, useClientBloodTestByDieticianReports } from "@/hooks/useClientBloodTestReports"
import { Spinner } from "@/components/ui/spinner"
import {useTranslation} from "react-i18next"
import EditBloodReportModal from "@/components/edit-blood-report-modal.tsx"
import { toast } from "sonner"
import { updateBloodTestReport } from "@/api/client.api"

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

interface BloodTestReportsProps {
    userRole: 'client' | 'dietician'
}

export default function BloodTestReports({ userRole }: BloodTestReportsProps) {
    const { clientId } = useParams<{ clientId: string }>()

    const clientQuery = useClientBloodTestReports(userRole === 'client')
    const dieticianQuery = useClientBloodTestByDieticianReports(
        userRole === 'dietician' ? clientId : undefined
    )

    const query = userRole === 'client' ? clientQuery : dieticianQuery
    const { data: reports, isLoading, isError, refetch } = query

    const [openReports, setOpenReports] = useState<Set<string>>(new Set())
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const [editingReport, setEditingReport] = useState<BloodTestReport | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const { t } = useTranslation();

    const toggleReport = (lockToken: string) => {
        const newOpenReports = new Set(openReports)
        if (newOpenReports.has(lockToken)) {
            newOpenReports.delete(lockToken)
        } else {
            newOpenReports.add(lockToken)
        }
        setOpenReports(newOpenReports)
    }

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
        if (value < min) return "low"
        if (value > max) return "high"
        return "normal"
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "low":
            case "high":
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
            default:
                return t("blood_test_reports.normal")
        }
    }

    const handleEditReport = (report: BloodTestReport) => {
        setEditingReport(report)
        setIsEditModalOpen(true)
    }

    const handleSaveReport = async (updatedReport: BloodTestReport) => {
        try {
            await updateBloodTestReport(updatedReport)

            await refetch()

            toast.success(t("blood_test_reports.report_updated"))
            setIsEditModalOpen(false)
            setEditingReport(null)
        } catch (error) {
            console.error('Error updating report:', error)
            toast.error(t("blood_test_reports.update_error"))
        }
    }

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false)
        setEditingReport(null)
    }

    if (isLoading) return <Spinner />
    if (isError) return <p className="text-red-500">{t("blood_test_reports.error_loading_reports")}</p>
    if (!reports || reports.length === 0) return <p>{t("blood_test_reports.no_reports_found")}</p>

    const typedReports = reports as BloodTestReport[]

    const sortedReports = [...typedReports].sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime()
        const dateB = new Date(b.timestamp).getTime()
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <TestTube className="h-6 w-6" />
                    <h1 className="text-2xl font-bold">
                        {userRole === 'dietician'
                            ? t("blood_test_reports.client_blood_test_reports")
                            : t("blood_test_reports.blood_test_reports")
                        }
                    </h1>
                </div>
                <button
                    onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                    className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted/50 transition-colors"
                >
                    {sortOrder === "desc" ? (
                        <>
                            <ArrowDown className="h-4 w-4" />
                            {t("blood_test_reports.newest")}
                        </>
                    ) : (
                        <>
                            <ArrowUp className="h-4 w-4" />
                            {t("blood_test_reports.oldest")}
                        </>
                    )}
                </button>
            </div>

            {sortedReports.map((report) => {
                const isOpen = openReports.has(report.lockToken)

                return (
                    <Card key={report.lockToken} className="w-full">
                        <Collapsible>
                            <CollapsibleTrigger className="w-full" onClick={() => toggleReport(report.lockToken)}>
                                <CardHeader className="hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                            <div className="text-left">
                                                <CardTitle className="text-lg">{t("blood_test_reports.blood_test_report")}</CardTitle>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {new Date(
                                                        report.timestamp
                                                    ).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <Badge variant="outline">
                                            {report.results.length} {report.results.length !== 1 ? t("blood_test_reports.parameters") : t("blood_test_reports.parameter")}
                                        </Badge>
                                    </div>
                                </CardHeader>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                                <CardContent className="pt-0">
                                    <div className="space-y-4">
                                        {report.results.map((result) => {
                                            const status = getResultStatus(
                                                result.result,
                                                result.bloodParameter.standardMin,
                                                result.bloodParameter.standardMax,
                                            )

                                            return (
                                                <div
                                                    key={result.lockToken}
                                                    className="flex items-center justify-between p-4 border rounded-lg bg-card"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-semibold text-lg">{result.bloodParameter.name}</h3>
                                                            <Badge variant={getStatusColor(status)}>{getStatusText(status)}</Badge>
                                                        </div>
                                                        <p className="text-muted-foreground mb-1">{result.bloodParameter.description}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {t("blood_test_reports.range")} {result.bloodParameter.standardMin} - {result.bloodParameter.standardMax}{" "}
                                                            {formatUnit(result.bloodParameter.unit)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold">{result.result}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {formatUnit(result.bloodParameter.unit)}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        {/* Edit button for dietician */}
                                        {userRole === 'dietician' && (
                                            <div className="pt-4 border-t">
                                                <Button
                                                    onClick={() => handleEditReport(report)}
                                                    variant="outline"
                                                    className="w-full"
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    {t("blood_test_reports.edit_report")}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </CollapsibleContent>
                        </Collapsible>
                    </Card>
                )
            })}

            {/* Edit Modal */}
            <EditBloodReportModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                report={editingReport}
                onSave={handleSaveReport}
            />
        </div>
    )
}