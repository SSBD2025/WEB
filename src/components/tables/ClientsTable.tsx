import { motion, AnimatePresence, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { t } from "i18next"
import type { Client } from "@/types/user"
import { Link } from "react-router"
import ROUTES from "@/constants/routes.ts"
import { useState } from "react"
import {ChevronDown, ChevronRight, User} from "lucide-react"

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
}

const expandVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
    },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
}

const ClientsTable = ({ clients }: { clients: Client[] }) => {
  const [expandedClient, setExpandedClient] = useState<string | null>(null)

  const toggleClient = (clientId: string) => {
    setExpandedClient(expandedClient === clientId ? null : clientId)
  }

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">{t("clients_table.title")}</h2>
      <div className="space-y-2">
        {clients.map((client, i) => {
          const { firstName, lastName, email} = client.account
          const {id} = client.client
          const isExpanded = expandedClient === id
          return (
            <motion.div
              key={id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={rowVariants}
              className="border rounded-lg overflow-hidden bg-card"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleClient(id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {firstName} {lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">{email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-sm">
                    {isExpanded ? t("clients_table.hide_actions") : t("clients_table.select_client")}
                  </Button>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial="hidden" animate="visible" exit="hidden" variants={expandVariants}>
                    <div className="border-t bg-muted/20 p-4">
                      <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                        {t("clients_table.available_actions")}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Link className="cursor-pointer" to={ROUTES.dieticianInsertBloodTestReport(id)}>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            {t("clients_table.insert_blood_test_report")}
                          </Button>
                        </Link>

                        <Link className="cursor-pointer" to={ROUTES.DIETICIAN_BLOOD_REPORT.replace(":clientId", id)}>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            {t("clients_table.view_blood_reports")}
                          </Button>
                        </Link>

                        <Link className="cursor-pointer" to={ROUTES.DIETICIAN_CLIENT_PYRAMIDS.replace(":clientId", id)}>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            {t("clients_table.view_client_pyramids")}
                          </Button>
                        </Link>

                        <Link
                            className="cursor-pointer"
                            to={ROUTES.DIETICIAN_MEDICAL_CHARTS.replace(':clientId', id)}
                        >
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            {t("clients_table.view_client_charts")}
                          </Button>
                        </Link>
                        <Link className="cursor-pointer" to={ROUTES.getDieticianPeriodicSurveyList(id)}>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            {t("clients_table.view_periodic_survey_list")}
                          </Button>
                        </Link>
                        <Link className="cursor-pointer" to={ROUTES.dieticianOrderMedicalExaminations(id)}>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            {t("clients_table.order_medical_examinations")}
                          </Button>
                        </Link>
                        <Link className="cursor-pointer" to={ROUTES.dieticianPermanentSurvey(id)}>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          {t("clients_table.view_permanent_survey")}
                        </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </>
  )
}

export default ClientsTable
