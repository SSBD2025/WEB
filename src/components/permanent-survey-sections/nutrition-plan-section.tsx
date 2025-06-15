import { type UseFormReturn, useFieldArray } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect } from "react";
import { t } from "i18next";
import {
  FormValues,
  nutritionGoalInfo,
} from "@/schemas/permanentSurveyForms.schema";

interface NutritionPlanSectionProps {
  form: UseFormReturn<FormValues>;
}

export function NutritionPlanSection({ form }: NutritionPlanSectionProps) {
  const mealTimesArray = useFieldArray({
    control: form.control,
    name: "mealTimes",
  });

  const mealsPerDay = form.watch("mealsPerDay");

  useEffect(() => {
    if (mealsPerDay && mealsPerDay > 0) {
      const mealsCount = Math.min(mealsPerDay, 10);
      const currentMealTimesCount = mealTimesArray.fields.length;

      if (mealsCount > currentMealTimesCount) {
        for (let i = currentMealTimesCount; i < mealsCount; i++) {
          mealTimesArray.append({ time: "" });
        }
      } else if (mealsCount < currentMealTimesCount) {
        for (let i = currentMealTimesCount - 1; i >= mealsCount; i--) {
          mealTimesArray.remove(i);
        }
      }
    }
  }, [mealsPerDay, mealTimesArray]);

  return (
    <AccordionItem value="section-5">
      <AccordionTrigger className="text-lg font-medium">
        {t("permanent_survey_form.nutrition_plan")}
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="nutritionGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("permanent_survey_form.nutrition_goal")} *
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        "permanent_survey_form.choose_nutrition_goal",
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="REDUCTION">
                    {t("permanent_survey_form.reduction")}
                  </SelectItem>
                  <SelectItem value="MAINTENANCE">
                    {t("permanent_survey_form.maintenance")}
                  </SelectItem>
                  <SelectItem value="MASS_GAIN">
                    {t("permanent_survey_form.mass_gain")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {field.value && (
                <FormDescription>
                  {
                    nutritionGoalInfo[
                      field.value as keyof typeof nutritionGoalInfo
                    ]
                  }
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mealsPerDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("permanent_survey_form.number_of_meals_per_day")} *
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="3"
                  {...field}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value);
                    const clampedValue =
                      value > 10 ? 10 : value < 1 ? undefined : value;
                    field.onChange(clampedValue || undefined);
                  }}
                />
              </FormControl>
              <FormDescription>
                {t("permanent_survey_form.meals_per_day_description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label
              className={
                form.formState.errors.mealTimes ? "text-destructive" : ""
              }
            >
              {t("permanent_survey_form.meal_times")} *
            </Label>
          </div>
          {mealTimesArray.fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`mealTimes.${index}.time`}
              render={({ field: timeField }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground min-w-[80px]">
                      {t("permanent_survey_form.meal")} {index + 1}:
                    </span>
                    <FormControl>
                      <Input type="time" className="w-32" {...timeField} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          {form.formState.errors.mealTimes &&
            typeof form.formState.errors.mealTimes.message === "string" && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.mealTimes.message}
              </p>
            )}
        </div>

        <FormField
          control={form.control}
          name="eatingHabits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("permanent_survey_form.eating_habits")} *
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t(
                    "permanent_survey_form.eating_habits_placeholder",
                  )}
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {field.value?.length || 0}
                {t("permanent_survey_form.eating_habits_limit")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
