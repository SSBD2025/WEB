import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { PermanentSurvey } from "@/types/permanent_survey";
import { useSubmitPermanentSurvey } from "@/hooks/useSubmitPermanentSurvey";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
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
import { Separator } from "@/components/ui/separator";
import { Info, Plus, Trash2 } from "lucide-react";
import { t } from "i18next";

const formSchema = z.object({
  height: z
    .string()
    .min(1, t("permanent_survey_form.height_required"))
    .refine(
      (val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
      {
        message: t("permanent_survey_form.height_message"),
      },
    ),
  dateOfBirth: z
    .string()
    .min(1, t("permanent_survey_form.date_of_birth_required")),
  gender: z.string().min(1, t("permanent_survey_form.gender_required")),
  dietPreferences: z.array(z.object({ value: z.string() })),
  allergies: z.array(z.object({ value: z.string() })),
  activityLevel: z.enum(
    ["SEDENTARY", "LIGHT", "MODERATE", "ACTIVE", "VERY_ACTIVE"],
    {
      required_error: t("permanent_survey_form.activity_level_required"),
    },
  ),
  smokes: z.boolean().optional(),
  drinksAlcohol: z.boolean().optional(),
  illnesses: z.array(z.object({ value: z.string() })),
  medications: z.array(z.object({ value: z.string() })),
  mealsPerDay: z
    .string()
    .min(1, t("permanent_survey_form.meals_per_day_required"))
    .refine(
      (val) => {
        const num = Number.parseInt(val);
        return !isNaN(num) && num >= 1 && num <= 10;
      },
      {
        message: t("permanent_survey_form.meals_per_day_message"),
      },
    ),
  nutritionGoal: z.enum(["REDUCTION", "MAINTENANCE", "MASS_GAIN"], {
    required_error: t("permanent_survey_form.nutrition_goal_required"),
  }),
  mealTimes: z
    .array(
      z.object({
        time: z.string().min(1, t("permanent_survey_form.meal_times_required")),
      }),
    )
    .min(1, t("permanent_survey_form.meal_times_message")),
  eatingHabits: z
    .string()
    .min(1, t("permanent_survey_form.eating_habits_required")),
});

type FormValues = z.infer<typeof formSchema>;

const activityLevelInfo = {
  SEDENTARY: t("permanent_survey_form.activity_level_info.sedentary"),
  LIGHT: t("permanent_survey_form.activity_level_info.light"),
  MODERATE: t("permanent_survey_form.activity_level_info.moderate"),
  ACTIVE: t("permanent_survey_form.activity_level_info.active"),
  VERY_ACTIVE: t("permanent_survey_form.activity_level_info.very_active"),
};

const nutritionGoalInfo = {
  REDUCTION: t("permanent_survey_form.nutrition_goal_info.reduction"),
  MAINTENANCE: t("permanent_survey_form.nutrition_goal_info.maintenance"),
  MASS_GAIN: t("permanent_survey_form.nutrition_goal_info.mass_gain"),
};

const PermanentSurveyForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dietPreferences: [{ value: "" }],
      allergies: [{ value: "" }],
      illnesses: [{ value: "" }],
      medications: [{ value: "" }],
      mealTimes: [{ time: "" }],
      smokes: false,
      drinksAlcohol: false,
    },
  });

  const { mutate: submitSurvey, isPending } = useSubmitPermanentSurvey();

  const dietPreferencesArray = useFieldArray({
    control: form.control,
    name: "dietPreferences",
  });
  const allergiesArray = useFieldArray({
    control: form.control,
    name: "allergies",
  });
  const illnessesArray = useFieldArray({
    control: form.control,
    name: "illnesses",
  });
  const medicationsArray = useFieldArray({
    control: form.control,
    name: "medications",
  });
  const mealTimesArray = useFieldArray({
    control: form.control,
    name: "mealTimes",
  });

  const onSubmit = (data: FormValues) => {
    const today = new Date().toISOString().split("T")[0];

    const formatted: PermanentSurvey = {
      height: Number.parseFloat(data.height),
      dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      gender: data.gender === "1",
      dietPreferences: data.dietPreferences
        .map((d) => d.value.trim())
        .filter(Boolean),
      allergies: data.allergies.map((a) => a.value.trim()).filter(Boolean),
      activityLevel: data.activityLevel,
      smokes: !!data.smokes,
      drinksAlcohol: !!data.drinksAlcohol,
      illnesses: data.illnesses.map((i) => i.value.trim()).filter(Boolean),
      medications: data.medications.map((m) => m.value.trim()).filter(Boolean),
      mealsPerDay: Number.parseInt(data.mealsPerDay),
      nutritionGoal: data.nutritionGoal,
      mealTimes: data.mealTimes.map(({ time }) =>
        new Date(`${today}T${time}:00`).toISOString(),
      ),
      eatingHabits: data.eatingHabits,
    };

    submitSurvey(formatted, { onSuccess: () => form.reset() });
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
                              {t("permanent_survey_form.height")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="175"
                                {...field}
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
                              {t("permanent_survey_form.date_of_birth")}
                            </FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
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
                            {t("permanent_survey_form.gender")}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Wybierz płeć" />
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

                <AccordionItem value="section-2">
                  <AccordionTrigger className="text-lg font-medium">
                    {t("permanent_survey_form.food_preferences")}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>
                          {t("permanent_survey_form.diet_preferences")}
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            dietPreferencesArray.append({ value: "" })
                          }
                          className="h-8"
                        >
                          <Plus className="h-4 w-4 mr-1" />{" "}
                          {t("permanent_survey_form.add")}
                        </Button>
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
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => allergiesArray.append({ value: "" })}
                          className="h-8"
                        >
                          <Plus className="h-4 w-4 mr-1" />{" "}
                          {t("permanent_survey_form.add")}
                        </Button>
                      </div>
                      {allergiesArray.fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <Input
                            {...form.register(`allergies.${index}.value`)}
                            placeholder={t(
                              "permanent_survey_form.allergies_placeholder",
                            )}
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
                              {t("permanent_survey_form.activity_level")}
                            </FormLabel>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p>
                                    {t(
                                      "permanent_survey_form.activity_level_description",
                                    )}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
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
                                {t(
                                  "permanent_survey_form.activity_level_name.SEDENTARY",
                                )}
                              </SelectItem>
                              <SelectItem value="LIGHT">
                                {t(
                                  "permanent_survey_form.activity_level_name.LIGHT",
                                )}
                              </SelectItem>
                              <SelectItem value="MODERATE">
                                {t(
                                  "permanent_survey_form.activity_level_name.MODERATE",
                                )}
                              </SelectItem>
                              <SelectItem value="ACTIVE">
                                {t(
                                  "permanent_survey_form.activity_level_name.ACTIVE",
                                )}
                              </SelectItem>
                              <SelectItem value="VERY_ACTIVE">
                                {t(
                                  "permanent_survey_form.activity_level_name.VERY_ACTIVE",
                                )}
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
                              <FormLabel>
                                {t("permanent_survey_form.smoking")}
                              </FormLabel>
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
                                {t(
                                  "permanent_survey_form.drinking_alcohol_description",
                                )}
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="section-4">
                  <AccordionTrigger className="text-lg font-medium">
                    {t("permanent_survey_form.health")}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-6 pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>{t("permanent_survey_form.illnesses")}</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => illnessesArray.append({ value: "" })}
                          className="h-8"
                        >
                          <Plus className="h-4 w-4 mr-1" />{" "}
                          {t("permanent_survey_form.add")}
                        </Button>
                      </div>
                      {illnessesArray.fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <Input
                            {...form.register(`illnesses.${index}.value`)}
                            placeholder={t(
                              "permanent_survey_form.illnesses_placeholder",
                            )}
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
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => medicationsArray.append({ value: "" })}
                          className="h-8"
                        >
                          <Plus className="h-4 w-4 mr-1" />{" "}
                          {t("permanent_survey_form.add")}
                        </Button>
                      </div>
                      {medicationsArray.fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <Input
                            {...form.register(`medications.${index}.value`)}
                            placeholder={t(
                              "permanent_survey_form.medications_placeholder",
                            )}
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
                            {t("permanent_survey_form.nutrition_goal")}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
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
                            {t("permanent_survey_form.number_of_meals_per_day")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              placeholder="3"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              "permanent_survey_form.meals_per_day_description",
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>{t("permanent_survey_form.meal_times")}</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => mealTimesArray.append({ time: "" })}
                          className="h-8"
                        >
                          <Plus className="h-4 w-4 mr-1" />{" "}
                          {t("permanent_survey_form.add")}
                        </Button>
                      </div>
                      {mealTimesArray.fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                          <Input
                            type="time"
                            {...form.register(`mealTimes.${index}.time`)}
                            className="flex-grow"
                          />
                          {mealTimesArray.fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => mealTimesArray.remove(index)}
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {form.formState.errors.mealTimes && (
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
                            {t("permanent_survey_form.eating_habits")}
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
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
    </div>
  );
};

export default PermanentSurveyForm;
