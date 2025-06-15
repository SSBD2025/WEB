import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";
import { t } from "i18next";
import { FormValues } from "@/schemas/permanentSurveyForms.schema.ts";

interface FoodPreferencesSectionProps {
  form: UseFormReturn<FormValues>;
}

export function FoodPreferencesSection({ form }: FoodPreferencesSectionProps) {
  const dietPreferencesArray = useFieldArray({
    control: form.control,
    name: "dietPreferences",
  });

  const allergiesArray = useFieldArray({
    control: form.control,
    name: "allergies",
  });

  return (
    <AccordionItem value="section-2">
      <AccordionTrigger className="text-lg font-medium">
        {t("permanent_survey_form.food_preferences")}
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{t("permanent_survey_form.diet_preferences")}</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {dietPreferencesArray.fields.length}/5
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => dietPreferencesArray.append({ value: "" })}
                disabled={dietPreferencesArray.fields.length >= 5}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />{" "}
                {t("permanent_survey_form.add")}
              </Button>
            </div>
          </div>
          {dietPreferencesArray.fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                {...form.register(`dietPreferences.${index}.value`)}
                placeholder={t(
                  "permanent_survey_form.diet_preferences_placeholder",
                )}
                className="flex-grow"
              />
              {dietPreferencesArray.fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => dietPreferencesArray.remove(index)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{t("permanent_survey_form.allergies")}</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {allergiesArray.fields.length}/5
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => allergiesArray.append({ value: "" })}
                disabled={allergiesArray.fields.length >= 5}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />{" "}
                {t("permanent_survey_form.add")}
              </Button>
            </div>
          </div>
          {allergiesArray.fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                {...form.register(`allergies.${index}.value`)}
                placeholder={t("permanent_survey_form.allergies_placeholder")}
                className="flex-grow"
              />
              {allergiesArray.fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => allergiesArray.remove(index)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
