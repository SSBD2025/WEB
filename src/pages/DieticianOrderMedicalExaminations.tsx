import { useParams } from "react-router"
import { motion } from "framer-motion"
import { useNavigate } from "react-router"
import { OrderMedicalExaminationsForm } from "@/components/OrderMedicalExaminationsForm"
import { t } from "i18next"
import ROUTES from "@/constants/routes"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
}

const DieticianOrderMedicalExaminations = () => {
    const { clientId } = useParams()
    const navigate = useNavigate()

    if (!clientId) {
        return <div>Client ID is required</div>
    }

    return (
        <main className="flex-grow flex flex-col items-center justify-center p-4">
            <motion.div className="w-full max-w-3xl" initial="hidden" animate="visible" variants={containerVariants}>
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(ROUTES.DIETICIAN_DASHBOARD)}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {t("order_medical_examinations.back_to_dashboard")}
                    </Button>
                </div>

                <div className="bg-card rounded-lg border shadow-sm p-6">
                    <h1 className="text-2xl font-bold mb-6">{t("order_medical_examinations.title")}</h1>
                    <OrderMedicalExaminationsForm clientId={clientId} />
                </div>
            </motion.div>
        </main>
    )
}

export default DieticianOrderMedicalExaminations