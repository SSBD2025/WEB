import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronRight,
  Calendar,
  Star,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { ClientFoodPyramid } from "@/types/food_pyramid";
import { nutrientKeys, nutrientUnits } from "@/constants/nutrients.ts";
import { t } from "i18next";
import { useClientFeedbackForPyramid } from "@/hooks/useClientPyramids";
import { Button } from "./ui/button";
import RatePyramidModal from "./rate-pyramid-modal";
import { useDeleteFeedback } from "@/hooks/useDeleteFeedback";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  pyramids: ClientFoodPyramid[];
  mode?: "client" | "dietician";
};

function PyramidWithFeedback({
  pyramid,
  pyramidLabel,
  mode,
}: {
  pyramid: ClientFoodPyramid;
  isActive: boolean;
  pyramidLabel: string;
  mode: "client" | "dietician";
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { data: feedback, isLoading: feedbackLoading } =
    useClientFeedbackForPyramid(pyramid.foodPyramid.id);

  const { mutate: deleteFeedback } = useDeleteFeedback(pyramid.foodPyramid.id);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <Card className="w-full">
          <Collapsible open={isOpen}>
            <CollapsibleTrigger
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-muted/50 transition-colors min-h-[72px]"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {isOpen ? (
                  <ChevronDown className="h-10 w-10 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-10 w-10 flex-shrink-0" />
                )}
                <div className="text-left truncate">
                  <CardTitle className="text-xl font-semibold leading-none truncate">
                    {pyramidLabel}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1 truncate">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {format(new Date(pyramid.timestamp), "dd.MM.yyyy HH:mm")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {feedback && (
                  <Badge variant="secondary" className="text-xs px-2 py-1">
                    {t("client_food_pyramid_list.has_feedback")}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="text-sm px-3 py-1 flex-shrink-0"
                >
                  {nutrientKeys.length}{" "}
                  {t("client_food_pyramid_list.parameters")}
                </Badge>
              </div>
            </CollapsibleTrigger>
            <AnimatePresence initial={false}>
              {isOpen && (
                <CollapsibleContent asChild forceMount>
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <CardContent className="pt-2 px-6 pb-2">
                      <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{
                          duration: 0.6,
                          ease: "easeInOut",
                        }}
                      >
                        {nutrientKeys.map((key) => (
                          <motion.div
                            key={key}
                            className="flex justify-between p-3 border rounded-lg bg-card gap-x-6"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{
                              duration: 0.8,
                              ease: "easeOut",
                            }}
                          >
                            <span className="capitalize font-medium">
                              {t(`client_food_pyramid_list.nutrients.${key}`)}
                            </span>
                            <span>
                              {pyramid.foodPyramid[key]}{" "}
                              {nutrientUnits[key] || ""}
                            </span>
                          </motion.div>
                        ))}
                      </motion.div>

                      {mode === "client" && (
                        <div className="mt-6 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold mb-3">
                              {t("client_food_pyramid_list.my_feedback")}
                            </h4>

                            {feedback && (
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setIsRatingModalOpen(true)}
                                >
                                  {t("common.edit")}
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                      <Trash2 />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        {t(
                                          "client_food_pyramid_list.feedback_alert.title",
                                        )}
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        {t(
                                          "client_food_pyramid_list.feedback_alert.description",
                                        )}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        {t(
                                          "client_food_pyramid_list.feedback_alert.cancel_button",
                                        )}
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          deleteFeedback(feedback.id)
                                        }
                                      >
                                        {t(
                                          "client_food_pyramid_list.feedback_alert.confirm_button",
                                        )}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            )}
                          </div>

                          {feedbackLoading ? (
                            <div className="bg-muted/30 rounded-lg p-4">
                              <p className="text-sm text-muted-foreground">
                                {t("common.loading")}
                              </p>
                            </div>
                          ) : feedback ? (
                            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    {t("client_food_pyramid_list.my_rating")}
                                  </span>
                                  {renderStars(feedback.rating)}
                                  <span className="text-sm text-muted-foreground">
                                    ({feedback.rating}/5)
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {format(
                                    new Date(feedback.timestamp),
                                    "dd.MM.yyyy HH:mm",
                                  )}
                                </span>
                              </div>
                              {feedback.description && (
                                <div>
                                  <span className="text-sm font-medium">
                                    {t("client_food_pyramid_list.my_comment")}:
                                  </span>
                                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                    {feedback.description}
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-muted/30 rounded-lg p-2">
                              <p className="text-sm text-muted-foreground">
                                {t("client_food_pyramid_list.no_feedback")}
                              </p>
                              <Button
                                onClick={() => setIsRatingModalOpen(true)}
                                className="mt-2"
                              >
                                {t("client_food_pyramid_list.add_feedback")}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>
        </Card>
      </motion.div>

      <RatePyramidModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        pyramidId={pyramid.foodPyramid.id}
        existingFeedback={feedback}
      />
    </>
  );
}

export function ClientFoodPyramidsList({ pyramids, mode = "client" }: Props) {
  if (!pyramids || pyramids.length === 0) {
    return (
      <motion.div
        className="max-w-5xl mx-auto p-6 text-center text-muted-foreground"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <p>{t("client_food_pyramid_list.no_data")}</p>
      </motion.div>
    );
  }

  const sorted = [...pyramids].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {sorted.map((pyramid, index) => {
        const isActive = mode === "dietician" ? index === 0 : pyramid.active;
        const pyramidLabel = isActive
          ? t("client_food_pyramid_list.active_pyramid")
          : t("client_food_pyramid_list.archive_pyramid");

        return (
          <PyramidWithFeedback
            key={pyramid.foodPyramid.id}
            pyramid={pyramid}
            isActive={isActive}
            pyramidLabel={pyramidLabel}
            mode={mode}
            index={index}
          />
        );
      })}
    </div>
  );
}
