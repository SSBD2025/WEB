import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Calendar, Star } from "lucide-react";
import { format } from "date-fns";
import { ClientFoodPyramid } from "@/types/food_pyramid";
import { nutrientKeys, nutrientUnits } from "@/constants/nutrients.ts";
import { t } from "i18next";
import { useClientFeedbackForPyramid } from "@/hooks/useClientPyramids";
import { Button } from "./ui/button";
import RatePyramidModal from "./rate-pyramid-modal";

type Props = {
  pyramids: ClientFoodPyramid[];
  mode?: "client" | "dietician";
};

function PyramidWithFeedback({
  pyramid,
  pyramidLabel,
}: {
  pyramid: ClientFoodPyramid;
  isActive: boolean;
  pyramidLabel: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const { data: feedback, isLoading: feedbackLoading } =
    useClientFeedbackForPyramid(pyramid.foodPyramid.id);

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
                {nutrientKeys.length} {t("client_food_pyramid_list.parameters")}
              </Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-2 px-6 pb-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nutrientKeys.map((key) => (
                  <div
                    key={key}
                    className="flex justify-between p-3 border rounded-lg bg-card gap-x-6"
                  >
                    <span className="capitalize font-medium">
                      {t(`client_food_pyramid_list.nutrients.${key}`)}
                    </span>
                    <span>
                      {pyramid.foodPyramid[key]} {nutrientUnits[key] || ""}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <h4 className="text-lg font-semibold mb-3">
                  {t("client_food_pyramid_list.my_feedback")}
                </h4>

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
                          {t("client_food_pyramid_list.my_rating")}:
                        </span>
                        {renderStars(feedback.rating)}
                        <span className="text-sm text-muted-foreground">
                          ({feedback.rating}/5)
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(
                          new Date(feedback.timestamp),
                          "dd.MM.yyyy HH:mm"
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
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <RatePyramidModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        pyramidId={pyramid.foodPyramid.id}
      />
    </>
  );
}

export function ClientFoodPyramidsList({ pyramids, mode = "client" }: Props) {
  if (!pyramids || pyramids.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center text-muted-foreground">
        <p>{t("client_food_pyramid_list.no_data")}</p>
      </div>
    );
  }

  const sorted = [...pyramids].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
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
          />
        );
      })}
    </div>
  );
}
