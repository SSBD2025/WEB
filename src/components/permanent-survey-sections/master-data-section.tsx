import type { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { t } from "i18next";
import { FormValues } from "@/schemas/permanentSurveyForms.schema.ts";
import {RequiredFormLabel} from "@/components/ui/requiredLabel.tsx";

interface MasterDataSectionProps {
  form: UseFormReturn<FormValues>;
}

export function MasterDataSection({ form }: MasterDataSectionProps) {
  const today = new Date().toISOString().split("T")[0];
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120);
  const minDateString = minDate.toISOString().split("T")[0];

  return (
    <AccordionItem value="section-1">
      <AccordionTrigger className="text-lg font-medium">
        {t("permanent_survey_form.master_data")}
      </AccordionTrigger>
      <AccordionContent className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                    <RequiredFormLabel>{t("permanent_survey_form.height")}</RequiredFormLabel>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="175"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        Number.parseFloat(e.target.value) || undefined,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredFormLabel>{t("permanent_survey_form.date_of_birth")}</RequiredFormLabel>
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={minDateString}
                    max={today}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                  <RequiredFormLabel>{t("permanent_survey_form.gender")}</RequiredFormLabel>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        "permanent_survey_form.choose_gender",
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">
                    {t("permanent_survey_form.gender_name.man")}
                  </SelectItem>
                  <SelectItem value="0">
                    {t("permanent_survey_form.gender_name.female")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </AccordionContent>
    </AccordionItem>
  );
}
