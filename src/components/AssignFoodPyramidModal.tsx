import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetAllFoodPyramids } from "@/hooks/useGetAllFoodPyramids"
import { useAssignFoodPyramid } from "@/hooks/useAssignFoodPyramid"
import { t } from "i18next"
import { Loader2, Pyramid } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AssignFoodPyramidModalProps {
  isOpen: boolean
  onClose: () => void
  clientId: string
  clientName: string
}

const AssignFoodPyramidModal = ({ isOpen, onClose, clientId, clientName }: AssignFoodPyramidModalProps) => {
  const [selectedPyramidId, setSelectedPyramidId] = useState<string>("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const { data: pyramids, isLoading: pyramidsLoading } = useGetAllFoodPyramids()
  const assignFoodPyramid = useAssignFoodPyramid()

  const handleAssignClick = () => {
    if (!selectedPyramidId) return
    setShowConfirmDialog(true)
  }

  const handleConfirmAssign = () => {
    if (!selectedPyramidId) return

    assignFoodPyramid.mutate(
      { clientId, foodPyramidId: selectedPyramidId },
      {
        onSuccess: () => {
          onClose()
          setSelectedPyramidId("")
          setShowConfirmDialog(false)
        },
        onError: () => {
          setShowConfirmDialog(false)
        },
      },
    )
  }

  const selectedPyramid = pyramids?.find((p) => p.id === selectedPyramidId)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pyramid className="w-5 h-5" />
              {t("assign_food_pyramid.title")}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{t("assign_food_pyramid.subtitle", { clientName })}</p>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t("assign_food_pyramid.select_pyramid")}</label>
              <Select value={selectedPyramidId} onValueChange={setSelectedPyramidId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("assign_food_pyramid.select_placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {pyramidsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    pyramids?.map((pyramid) => (
                      <SelectItem key={pyramid.id} value={pyramid.id}>
                        <div className="flex items-center gap-2">
                          <span>{pyramid.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {pyramid.kcal} kcal
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedPyramid && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{selectedPyramid.name}</CardTitle>
                  <CardDescription>{t("assign_food_pyramid.pyramid_details")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-lg font-semibold">{selectedPyramid.kcal}</div>
                      <div className="text-xs text-muted-foreground">kcal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{selectedPyramid.protein}g</div>
                      <div className="text-xs text-muted-foreground">{t("nutrients.protein")}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{selectedPyramid.carbohydrates}g</div>
                      <div className="text-xs text-muted-foreground">{t("nutrients.carbohydrates")}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{selectedPyramid.fat}g</div>
                      <div className="text-xs text-muted-foreground">{t("nutrients.fat")}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleAssignClick} disabled={!selectedPyramidId || assignFoodPyramid.isPending}>
                {assignFoodPyramid.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {t("assign_food_pyramid.assign")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("assign_food_pyramid.confirm_dialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("assign_food_pyramid.confirm_dialog.description", {
                clientName,
                pyramidName: selectedPyramid?.name,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={assignFoodPyramid.isPending}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAssign} disabled={assignFoodPyramid.isPending}>
              {assignFoodPyramid.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {t("assign_food_pyramid.confirm_dialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default AssignFoodPyramidModal
