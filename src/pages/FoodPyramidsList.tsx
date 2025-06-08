import { useGetAllFoodPyramids } from "@/hooks/useGetAllFoodPyramids"
import { motion } from "framer-motion"
import DataRenderer from "@/components/shared/DataRenderer"
import FoodPyramidsTable from "@/components/tables/FoodPyramidsTable"
import { t } from "i18next"

const containerVariants = {
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
