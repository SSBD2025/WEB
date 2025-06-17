import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { periodicSurveySchema } from "@/schemas/client/surveyFroms.schema";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useSubmitPeriodicSurvey } from "@/hooks/useSubmitPeriodicSurvey";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RequiredFormLabel } from "@/components/ui/requiredLabel";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";


export function SubmitPeriodicSurveyForm() {
  const { t } = useTranslation();
  const submitSurveyMutation = useSubmitPeriodicSurvey();
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(periodicSurveySchema),
    defaultValues: {
      weight: undefined,
      bloodPressure: "",
      bloodSugarLevel: undefined,
    },
  });

  function onSubmit() {
    setIsSubmitDialogOpen(true);
  }

  const confirmSubmit = () => {
    const formData = form.getValues();

    submitSurveyMutation.mutate(
      formData,
      {}
    );
    setIsSubmitDialogOpen(false);
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {t("periodic_survey.form.title")}
          </CardTitle>
          <CardDescription>
            {t("periodic_survey.form.description")}
          </CardDescription>
          </CardHeader>
      <CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <RequiredFormLabel htmlFor="weight">
                  {t("periodic_survey.form.label.weight")}
                </RequiredFormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bloodPressure"
            render={({ field }) => (
              <FormItem>
                <RequiredFormLabel htmlFor="bloodPressure">
                  {t("periodic_survey.form.label.blood_pressure")}
                </RequiredFormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bloodSugarLevel"
            render={({ field }) => (
              <FormItem>
                <RequiredFormLabel htmlFor="bloodSugarLevel">
                  {t("periodic_survey.form.label.blood_sugar")}
                </RequiredFormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value) || 0)
                      }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            {t("periodic_survey.form.submit_button")}
          </Button>
        </form>
      </Form>
      </CardContent>
      </Card>
      <AlertDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
      >
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>
                {t("periodic_survey.form.submit_alert_title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
                {t("periodic_survey.form.submit_alert_description")}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>
                {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmit}>
                {t("periodic_survey.form.submit_button")}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SubmitPeriodicSurveyForm;