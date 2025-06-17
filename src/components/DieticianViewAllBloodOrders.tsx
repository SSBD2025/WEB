"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { t } from "i18next"
import { User, Clock } from "lucide-react"
import type { BloodTestOrderWithClient } from "@/types/medical_examination"

interface DieticianViewAllBloodOrdersProps {
  orders: BloodTestOrderWithClient[]
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
}

const DieticianViewAllBloodOrders = ({ orders }: DieticianViewAllBloodOrdersProps) => {

  return (
    <main className="flex-grow flex flex-col w-full items-center justify-start p-6 gap-6 max-w-4xl mx-auto">
      <div className="w-full text-center mb-4">
        <h3 className="text-xl font-bold tracking-tight">{t("blood_test_orders.page_title")}</h3>
      </div>

      <div className="w-full space-y-4">
        {orders.map((orderData, i) => {
          const { bloodTestOrderDTO: order, minimalClientDTO: client } = orderData

          return (
            <motion.div
              key={`${order.clientId}-${order.orderDate}`}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card className="w-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {client.firstName} {client.lastName}
                        </CardTitle>
                        <CardDescription className="text-md text-muted-foreground">{client.email}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <>
                          <Clock className="h-5 w-5 text-orange-600" />
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            {t("blood_test_orders.pending")}
                          </Badge>
                        </>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.orderDate && (
                      <div>
                        <Label className="text-sm text-muted-foreground">{t("blood_test_orders.order_date")}</Label>
                        <p>
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {order.description && (
                      <div>
                        <Label className="text-sm text-muted-foreground">
                          {t("blood_test_orders.description_label")}
                        </Label>
                        <p>{String(order.description)}</p>
                      </div>
                    )}
                  </div>
                  {order.parameters && (
                    <div>
                      <Label className="text-sm text-muted-foreground block mb-2">
                        {t("blood_test_orders.parameters")} ({order.parameters.length})
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {Array.isArray(order.parameters) ? (
                          order.parameters.map((param, idx) => (
                            <Badge key={idx} variant="secondary" className="text-base justify-center py-1">
                              {param}
                            </Badge>
                          ))
                        ) : (
                          <div>{String(order.parameters)}</div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </main>
  )
}

export default DieticianViewAllBloodOrders
