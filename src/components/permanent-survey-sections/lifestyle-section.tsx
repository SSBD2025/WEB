import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { t } from "i18next";
import {
  activityLevelInfo,
  FormValues,
} from "@/schemas/permanentSurveyForms.schema.ts";
import {RequiredFormLabel} from "@/components/ui/requiredLabel.tsx";

interface LifestyleSectionProps {
  form: UseFormReturn<FormValues>;
}

export function LifestyleSection({ form }: LifestyleSectionProps) {
  return (
    <AccordionItem value="section-3">
      <AccordionTrigger className="text-lg font-medium">
        {t("permanent_survey_form.lifestyle")}
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="activityLevel"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>
                  <RequiredFormLabel>{t("permanent_survey_form.activity_level")}</RequiredFormLabel>
                </FormLabel>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>
                        {t("permanent_survey_form.activity_level_description")}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        "permanent_survey_form.activity_level_placeholder",
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SEDENTARY">
                    {t("permanent_survey_form.activity_level_name.SEDENTARY")}
                  </SelectItem>
                  <SelectItem value="LIGHT">
                    {t("permanent_survey_form.activity_level_name.LIGHT")}
                  </SelectItem>
                  <SelectItem value="MODERATE">
                    {t("permanent_survey_form.activity_level_name.MODERATE")}
                  </SelectItem>
                  <SelectItem value="ACTIVE">
                    {t("permanent_survey_form.activity_level_name.ACTIVE")}
                  </SelectItem>
                  <SelectItem value="VERY_ACTIVE">
                    {t("permanent_survey_form.activity_level_name.VERY_ACTIVE")}
                  </SelectItem>
                </SelectContent>
              </Select>
              {field.value && (
                <FormDescription>
                  {
                    activityLevelInfo[
                      field.value as keyof typeof activityLevelInfo
                    ]
                  }
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="smokes"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{t("permanent_survey_form.smoking")}</FormLabel>
                  <FormDescription>
                    {t("permanent_survey_form.smoking_description")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="drinksAlcohol"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {t("permanent_survey_form.drinking_alcohol")}
                  </FormLabel>
                  <FormDescription>
                    {t("permanent_survey_form.drinking_alcohol_description")}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
