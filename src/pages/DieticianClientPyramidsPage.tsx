import { ClientFoodPyramidsList } from "@/components/clientFoodPyramidList"
import { useGetClientPyramidsByDietician } from "@/hooks/useGetClientPyramidsByDietician"
import { useParams } from "react-router-dom"
import { Spinner } from "@/components/ui/spinner"
import BackButton from "@/components/shared/BackButton"
import { t } from "i18next"
import ROUTES from "@/constants/routes"

const DieticianClientPyramidsPage = () => {
  const params = useParams<{ clientId: string }>()
  const clientId = params.clientId

  const { data, isLoading } = useGetClientPyramidsByDietician(clientId ?? "")

  if (isLoading) {
    return (
      <main className="flex-grow flex justify-center items-center">
        <Spinner />
      </main>
    )
  }

  return (
    <div className="flex-grow">
      <div className="container max-w-5xl mx-auto p-6">
        <div className="mb-6">
          <BackButton route={ROUTES.DIETICIAN_DASHBOARD} />
          <h1 className="text-2xl font-bold mt-4">{t("client_food_pyramid_list.title")}</h1>
        </div>
        <ClientFoodPyramidsList pyramids={data || []} mode="dietician" />
      </div>
    </div>
  )
}

export default DieticianClientPyramidsPage
