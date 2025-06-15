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

interface HealthSectionProps {
  form: UseFormReturn<FormValues>;
}

export function HealthSection({ form }: HealthSectionProps) {
  const illnessesArray = useFieldArray({
    control: form.control,
    name: "illnesses",
  });

  const medicationsArray = useFieldArray({
    control: form.control,
    name: "medications",
  });

  return (
    <AccordionItem value="section-4">
      <AccordionTrigger className="text-lg font-medium">
        {t("permanent_survey_form.health")}
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>{t("permanent_survey_form.illnesses")}</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {illnessesArray.fields.length}/5
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => illnessesArray.append({ value: "" })}
                disabled={illnessesArray.fields.length >= 5}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />{" "}
                {t("permanent_survey_form.add")}
              </Button>
            </div>
          </div>
          {illnessesArray.fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                {...form.register(`illnesses.${index}.value`)}
                placeholder={t("permanent_survey_form.illnesses_placeholder")}
                className="flex-grow"
              />
              {illnessesArray.fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => illnessesArray.remove(index)}
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
            <Label>{t("permanent_survey_form.medications")}</Label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {medicationsArray.fields.length}/5
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => medicationsArray.append({ value: "" })}
                disabled={medicationsArray.fields.length >= 5}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />{" "}
                {t("permanent_survey_form.add")}
              </Button>
            </div>
          </div>
          {medicationsArray.fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <Input
                {...form.register(`medications.${index}.value`)}
                placeholder={t("permanent_survey_form.medications_placeholder")}
                className="flex-grow"
              />
              {medicationsArray.fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => medicationsArray.remove(index)}
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
