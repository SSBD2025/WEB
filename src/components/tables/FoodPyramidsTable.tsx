import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { t } from "i18next"
import type { FoodPyramid } from "@/types/food_pyramid"
import { Link } from "react-router"
import { Star, Pill, Zap } from "lucide-react"

const rowVariants = {
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

const NutrientBadge = ({
  label,
  value,
  unit = "",
  color = "default",
}: {
  label: string
  value: number
  unit?: string
  color?: "default" | "secondary" | "destructive" | "outline"
}) => (
  <Badge variant={color} className="text-xs">
    {label}: {value.toFixed(value < 1 ? 3 : 1)}
    {unit}
  </Badge>
)

const FoodPyramidsTable = ({ foodPyramids }: { foodPyramids: FoodPyramid[] }) => {
  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold">{t("food_pyramids_table.title", "Food Pyramids")}</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[200px]">{t("food_pyramids_table.id", "ID")}</TableHead> */}
              <TableHead className="w-[120px]">{t("food_pyramids_table.rating", "Rating")}</TableHead>
              <TableHead className="min-w-[400px]">{t("food_pyramids_table.vitamins", "Vitamins")}</TableHead>
              <TableHead className="min-w-[500px]">{t("food_pyramids_table.minerals", "Minerals")}</TableHead>
              <TableHead className="w-[150px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {foodPyramids.map((pyramid, i) => {
              return (
                <motion.tr
                  key={pyramid.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  {/* <TableCell className="font-mono text-sm">{pyramid.id}</TableCell> */}
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {pyramid.averageRating?.toFixed(1) || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <div className="flex items-center gap-1 mb-2">
                        <Pill className="h-3 w-3 text-orange-500" />
                        <span className="text-xs font-medium text-muted-foreground">{t("food_pyramids_table.vitamins")}:</span>
                      </div>
                      <div className="flex flex-wrap gap-1 w-full">
                        <NutrientBadge label="A" value={pyramid.a} unit="mg" color="secondary" />
                        <NutrientBadge label="D" value={pyramid.d} unit="mg" color="secondary" />
                        <NutrientBadge label="E" value={pyramid.e} unit="mg" color="secondary" />
                        <NutrientBadge label="K" value={pyramid.k} unit="mg" color="secondary" />
                        <NutrientBadge label="C" value={pyramid.c} unit="mg" color="secondary" />
                        <NutrientBadge label="B1" value={pyramid.b1} unit="mg" color="outline" />
                        <NutrientBadge label="B2" value={pyramid.b2} unit="mg" color="outline" />
                        <NutrientBadge label="B3" value={pyramid.b3} unit="mg" color="outline" />
                        <NutrientBadge label="B5" value={pyramid.b5} unit="mg" color="outline" />
                        <NutrientBadge label="B6" value={pyramid.b6} unit="mg" color="outline" />
                        <NutrientBadge label="B7" value={pyramid.b7} unit="mg" color="outline" />
                        <NutrientBadge label="B9" value={pyramid.b9} unit="mg" color="outline" />
                        <NutrientBadge label="B12" value={pyramid.b12} unit="mg" color="outline" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <div className="flex items-center gap-1 mb-2">
                        <Zap className="h-3 w-3 text-blue-500" />
                        <span className="text-xs font-medium text-muted-foreground">{t("food_pyramids_table.minerals")}:</span>
                      </div>
                      <div className="flex flex-wrap gap-1 w-full">
                        <NutrientBadge label="K" value={pyramid.potassium} unit="mg" color="default" />
                        <NutrientBadge label="Ca" value={pyramid.calcium} unit="mg" color="default" />
                        <NutrientBadge label="P" value={pyramid.phosphorus} unit="mg" color="default" />
                        <NutrientBadge label="Mg" value={pyramid.magnesium} unit="mg" color="default" />
                        <NutrientBadge label="Fe" value={pyramid.iron} unit="mg" color="destructive" />
                        <NutrientBadge label="Zn" value={pyramid.zinc} unit="mg" color="destructive" />
                        <NutrientBadge label="F" value={pyramid.fluorine} unit="mg" color="destructive" />
                        <NutrientBadge label="Mn" value={pyramid.manganese} unit="mg" color="destructive" />
                        <NutrientBadge label="Cu" value={pyramid.copper} unit="mg" color="destructive" />
                        <NutrientBadge label="I" value={pyramid.iodine} unit="mg" color="destructive" />
                        <NutrientBadge label="Se" value={pyramid.selenium} unit="mg" color="destructive" />
                        <NutrientBadge label="Mo" value={pyramid.molybdenum} unit="mg" color="destructive" />
                        <NutrientBadge label="Cr" value={pyramid.chromium} unit="mg" color="destructive" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link to={`/food-pyramids/${pyramid.id}`}>
                      <Button variant="ghost" size="sm">
                        {t("food_pyramids_table.view_details", "View Details")}
                      </Button>
                    </Link>
                  </TableCell>
                </motion.tr>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default FoodPyramidsTable
