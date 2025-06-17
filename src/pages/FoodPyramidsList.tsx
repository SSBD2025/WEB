import { useGetAllFoodPyramids } from "@/hooks/useGetAllFoodPyramids"
import { motion, Variants } from "framer-motion"
import DataRenderer from "@/components/shared/DataRenderer"
import FoodPyramidsTable from "@/components/tables/FoodPyramidsTable"
import { t } from "i18next"
import BackButton from "@/components/shared/BackButton"
import ROUTES from "@/constants/routes"

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
}

const FOOD_PYRAMIDS_EMPTY = {
  title: t("food_pyramids.empty.title", "No Food Pyramids Found"),
  message: t("food_pyramids.empty.description", "There are no food pyramids available at the moment."),
}

const FoodPyramidsList = () => {
  const { data, status } = useGetAllFoodPyramids()

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      <motion.div className="w-full" initial="hidden" animate="visible" variants={containerVariants}>
        <div className="mb-6">
          <BackButton route={ROUTES.DIETICIAN_DASHBOARD} />
        </div>
        <DataRenderer
          status={status}
          data={data}
          empty={FOOD_PYRAMIDS_EMPTY}
          render={(foodPyramids) => <FoodPyramidsTable foodPyramids={foodPyramids} />}
        />
      </motion.div>
    </main>
  )
}

export default FoodPyramidsList
