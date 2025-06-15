import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { PermanentSurvey } from "@/types/permanent_survey";
import { useSubmitPermanentSurvey } from "@/hooks/useSubmitPermanentSurvey";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { t } from "i18next";
import { formSchema, FormValues } from "@/schemas/permanentSurveyForms.schema";
import { MasterDataSection } from "@/components/permanent-survey-sections/master-data-section.tsx";
import { LifestyleSection } from "@/components/permanent-survey-sections/lifestyle-section.tsx";
import { FoodPreferencesSection } from "@/components/permanent-survey-sections/food-preferences-section.tsx";
import { HealthSection } from "@/components/permanent-survey-sections/health-section.tsx";
import { NutritionPlanSection } from "@/components/permanent-survey-sections/nutrition-plan-section.tsx";

const PermanentSurveyForm = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<FormValues | null>(
    null,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: undefined,
      dateOfBirth: "",
      gender: "",
      dietPreferences: [{ value: "" }],
      allergies: [{ value: "" }],
      activityLevel: undefined,
      smokes: false,
      drinksAlcohol: false,
      illnesses: [{ value: "" }],
      medications: [{ value: "" }],
      mealsPerDay: undefined,
      nutritionGoal: undefined,
      mealTimes: [{ time: "" }],
      eatingHabits: "",
    },
  });

  const { mutate: submitSurvey, isPending } = useSubmitPermanentSurvey();

  const onSubmit = (data: FormValues) => {
    setFormDataToSubmit(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    if (!formDataToSubmit) return;

    const today = new Date().toISOString().split("T")[0];

    const formatted: PermanentSurvey = {
      height: formDataToSubmit.height!,
      dateOfBirth: new Date(formDataToSubmit.dateOfBirth).toISOString(),
      gender: formDataToSubmit.gender === "1",
      dietPreferences: formDataToSubmit.dietPreferences
        .map((d) => d.value.trim())
        .filter(Boolean),
      allergies: formDataToSubmit.allergies
        .map((a) => a.value.trim())
        .filter(Boolean),
      activityLevel: formDataToSubmit.activityLevel!,
      smokes: !!formDataToSubmit.smokes,
      drinksAlcohol: !!formDataToSubmit.drinksAlcohol,
      illnesses: formDataToSubmit.illnesses
        .map((i) => i.value.trim())
        .filter(Boolean),
      medications: formDataToSubmit.medications
        .map((m) => m.value.trim())
        .filter(Boolean),
      mealsPerDay: formDataToSubmit.mealsPerDay!,
      nutritionGoal: formDataToSubmit.nutritionGoal!,
      mealTimes: formDataToSubmit.mealTimes
        .filter(({ time }) => time.trim() !== "")
        .map(({ time }) => new Date(`${today}T${time}:00`).toISOString()),
      eatingHabits: formDataToSubmit.eatingHabits,
    };

    submitSurvey(formatted, {
      onSuccess: () => {
        form.reset();
        setShowConfirmDialog(false);
        setFormDataToSubmit(null);
      },
    });
  };

  const handleCancelSubmit = () => {
    setShowConfirmDialog(false);
    setFormDataToSubmit(null);
  };

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            {t("permanent_survey_form.title")}
          </CardTitle>
          <CardDescription>
            {t("permanent_survey_form.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Accordion
                type="single"
                collapsible
                defaultValue="section-1"
                className="w-full"
              >
                <MasterDataSection form={form} />
                <FoodPreferencesSection form={form} />
                <LifestyleSection form={form} />
                <HealthSection form={form} />
                <NutritionPlanSection form={form} />
              </Accordion>
              <Separator />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto"
                >
                  {isPending
                    ? t("permanent_survey_form.sending")
                    : t("permanent_survey_form.send")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("permanent_survey_form.confirm_dialog_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("permanent_survey_form.confirm_dialog_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelSubmit}>
              {t("permanent_survey_form.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmSubmit}
              disabled={isPending}
            >
              {isPending
                ? t("permanent_survey_form.sending")
                : t("permanent_survey_form.send")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PermanentSurveyForm;
