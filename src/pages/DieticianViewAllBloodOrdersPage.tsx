import { useGetMedicalExaminations } from "@/hooks/useGetMedicalExaminations"
import DieticianViewAllBloodOrders from "@/components/DieticianViewAllBloodOrders"
import { t } from "i18next"

export default function DieticianViewAllBloodOrdersPage() {
  const { data: orders, isLoading } = useGetMedicalExaminations()

  if (isLoading) {
    return <main className="flex-grow flex items-center justify-center">{t("common.loading")}</main>
  }


  if (!orders || orders.length === 0) {
    return (
      <main className="flex-grow flex items-center justify-center text-center p-4">
        <div className="max-w-md space-y-2">
          <p className="text-lg font-semibold">{t("blood_test_orders.no_orders")}</p>
        </div>
      </main>
    )
  }

  return <DieticianViewAllBloodOrders orders={orders} />
}
