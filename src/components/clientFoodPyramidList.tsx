import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ClientFoodPyramid } from "@/types/food_pyramid";
import { nutrientKeys, nutrientUnits } from "@/constants/nutrients.ts";
import { t } from "i18next";

type Props = {
  pyramids: ClientFoodPyramid[];
  mode?: "client" | "dietician";
};

export function ClientFoodPyramidsList({ pyramids, mode = "client" }: Props) {
  const [openPyramids, setOpenPyramids] = useState<Set<string>>(new Set());

  const togglePyramid = (id: string) => {
    const newOpen = new Set(openPyramids);
    if (newOpen.has(id)) newOpen.delete(id);
    else newOpen.add(id);
    setOpenPyramids(newOpen);
  };

  if (!pyramids || pyramids.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center text-muted-foreground">
        <p>{t("client_food_pyramid_list.no_data")}</p>
      </div>
    );
  }

  const sorted = [...pyramids].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {sorted.map((pyramid, index) => {
        const isOpen = openPyramids.has(pyramid.foodPyramid.id);

        const isActive = mode === "dietician" ? index === 0 : pyramid.active;

        const pyramidLabel = isActive
          ? t("client_food_pyramid_list.active_pyramid")
          : t("client_food_pyramid_list.archive_pyramid");

        return (
          <Card key={pyramid.foodPyramid.id} className="w-full">
            <Collapsible open={isOpen}>
              <CollapsibleTrigger
                onClick={() => togglePyramid(pyramid.foodPyramid.id)}
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
                        {format(
                          new Date(pyramid.timestamp),
                          "dd.MM.yyyy HH:mm",
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-sm px-3 py-1 flex-shrink-0"
                >
                  {nutrientKeys.length}{" "}
                  {t("client_food_pyramid_list.parameters")}
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-2 px-6 pb-6">
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
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
}
