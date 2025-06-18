import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { PermanentSurvey } from "@/types/permanent_survey"
import { useUpdatePermanentSurvey } from "@/hooks/useSubmitPermanentSurvey"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RequiredFormLabel } from "@/components/ui/requiredLabel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Info, Plus, Trash2 } from "lucide-react"
import { t } from "i18next"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { motion } from "framer-motion";

const formSchema = z.object({
  height: z
    .string()
    .min(1, t("permanent_survey_form.height_required"))
    .refine(
      (val) => {
        const num = Number.parseFloat(val)
        return !isNaN(num) && num > 0 && num >= 130 && num <= 250
      },
      {
        message: t("permanent_survey_form.height_message_violation"),
      },
    ),
  dateOfBirth: z
    .string()
    .min(1, t("permanent_survey_form.date_of_birth_required"))
    .refine(
      (val) => {
        const year = new Date(val).getFullYear()
        return year >= 1900
      },
      {
        message: t("permanent_survey_form.date_of_birth_min_year"),
      },
    ),
  gender: z.string().min(1, t("permanent_survey_form.gender_required")),
  dietPreferences: z
    .array(
      z.object({
        value: z.string().max(100, t("permanent_survey_form.diet_preference_max_length")),
      }),
    )
    .max(5, t("permanent_survey_form.max_5_items")),
  allergies: z
    .array(
      z.object({
        value: z.string().max(100, t("permanent_survey_form.allergy_max_length")),
      }),
    )
    .max(5, t("permanent_survey_form.max_5_items")),
  activityLevel: z.enum(["SEDENTARY", "LIGHT", "MODERATE", "ACTIVE", "VERY_ACTIVE"], {
    required_error: t("permanent_survey_form.activity_level_required"),
  }),
  smokes: z.boolean().optional(),
  drinksAlcohol: z.boolean().optional(),
  illnesses: z
    .array(
      z.object({
        value: z.string().max(150, t("permanent_survey_form.illness_max_length")),
      }),
    )
    .max(5, t("permanent_survey_form.max_5_items")),
  medications: z
    .array(
      z.object({
        value: z.string().max(200, t("permanent_survey_form.medication_max_length")),
      }),
    )
    .max(5, t("permanent_survey_form.max_5_items")),
  mealsPerDay: z
    .string()
    .min(1, t("permanent_survey_form.meals_per_day_required"))
    .refine(
      (val) => {
        const num = Number.parseInt(val)
        return !isNaN(num) && num >= 1 && num <= 10
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
    .min(10, t("permanent_survey_form.eating_habits_min_length"))
    .max(1000, t("permanent_survey_form.eating_habits_max_length")),
})

type FormValues = z.infer<typeof formSchema>

const activityLevelInfo = {
  SEDENTARY: t("permanent_survey_form.activity_level_info.sedentary"),
  LIGHT: t("permanent_survey_form.activity_level_info.light"),
  MODERATE: t("permanent_survey_form.activity_level_info.moderate"),
  ACTIVE: t("permanent_survey_form.activity_level_info.active"),
  VERY_ACTIVE: t("permanent_survey_form.activity_level_info.very_active"),
}

const nutritionGoalInfo = {
  REDUCTION: t("permanent_survey_form.nutrition_goal_info.reduction"),
  MAINTENANCE: t("permanent_survey_form.nutrition_goal_info.maintenance"),
  MASS_GAIN: t("permanent_survey_form.nutrition_goal_info.mass_gain"),
}

const convertTo12Hour = (time24: string): string => {
  if (!time24) return ""
  const [hours, minutes] = time24.split(":")
  const hour = Number.parseInt(hours, 10)
  const ampm = hour >= 12 ? "PM" : "AM"
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

const getDefaultMealTimes = (mealsCount: number): string[] => {
  const defaultTimes: { [key: number]: string[] } = {
    1: ["12:00"],
    2: ["08:00", "18:00"],
    3: ["08:00", "13:00", "18:00"],
    4: ["08:00", "12:00", "16:00", "20:00"],
    5: ["07:00", "10:00", "13:00", "16:00", "19:00"],
    6: ["07:00", "10:00", "12:00", "15:00", "18:00", "21:00"],
    7: ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00"],
    8: ["07:00", "09:00", "11:00", "13:00", "15:00", "17:00", "19:00", "21:00"],
    9: ["07:00", "08:30", "10:00", "11:30", "13:00", "15:00", "17:00", "19:00", "21:00"],
    10: ["07:00", "08:30", "10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00", "21:00"],
  }
  return defaultTimes[mealsCount] || ["08:00", "13:00", "18:00"]
}

interface EditPermanentSurveyFormProps {
  survey: PermanentSurvey
  onSuccess?: () => void
}

const EditPermanentSurveyForm = ({ survey, onSuccess }: EditPermanentSurveyFormProps) => {
  const { i18n } = useTranslation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: "",
      dateOfBirth: "",
      gender: "",
      dietPreferences: [{ value: "" }],
      allergies: [{ value: "" }],
      activityLevel: "MODERATE",
      smokes: false,
      drinksAlcohol: false,
      illnesses: [{ value: "" }],
      medications: [{ value: "" }],
      mealsPerDay: "3",
      nutritionGoal: "MAINTENANCE",
      mealTimes: [{ time: "08:00" }, { time: "13:00" }, { time: "18:00" }],
      eatingHabits: "",
    },
  })

  const { mutate: updateSurvey, isPending } = useUpdatePermanentSurvey()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const previousMealsPerDay = useRef<string>("")

  const dietPreferencesArray = useFieldArray({
    control: form.control,
    name: "dietPreferences",
  })
  const allergiesArray = useFieldArray({
    control: form.control,
    name: "allergies",
  })
  const illnessesArray = useFieldArray({
    control: form.control,
    name: "illnesses",
  })
  const medicationsArray = useFieldArray({
    control: form.control,
    name: "medications",
  })
  const mealTimesArray = useFieldArray({
    control: form.control,
    name: "mealTimes",
  })

  const mealsPerDay = form.watch("mealsPerDay")

  useEffect(() => {
    if (mealsPerDay && mealsPerDay !== previousMealsPerDay.current) {
      const mealsCount = Number.parseInt(mealsPerDay)
      if (!isNaN(mealsCount) && mealsCount >= 1 && mealsCount <= 10) {
        const currentMealTimes = form.getValues("mealTimes")
        const defaultTimes = getDefaultMealTimes(mealsCount)

        const newMealTimes = Array.from({ length: mealsCount }, (_, index) => ({
          time: currentMealTimes[index]?.time || defaultTimes[index] || "08:00",
        }))

        mealTimesArray.replace(newMealTimes)
        previousMealsPerDay.current = mealsPerDay
      }
    }
  }, [mealsPerDay, mealTimesArray, form, i18n.language])

  useEffect(() => {
    if (survey) {
      const dateOfBirth = new Date(survey.dateOfBirth).toISOString().split("T")[0]

      const formData = {
        height: survey.height.toString(),
        dateOfBirth,
        gender: survey.gender ? "1" : "0",
        dietPreferences:
          survey.dietPreferences.length > 0 ? survey.dietPreferences.map((pref) => ({ value: pref })) : [{ value: "" }],
        allergies:
          survey.allergies.length > 0 ? survey.allergies.map((allergy) => ({ value: allergy })) : [{ value: "" }],
        activityLevel: survey.activityLevel,
        smokes: survey.smokes,
        drinksAlcohol: survey.drinksAlcohol,
        illnesses:
          survey.illnesses.length > 0 ? survey.illnesses.map((illness) => ({ value: illness })) : [{ value: "" }],
        medications:
          survey.medications.length > 0
            ? survey.medications.map((medication) => ({ value: medication }))
            : [{ value: "" }],
        mealsPerDay: survey.mealsPerDay.toString(),
        nutritionGoal: survey.nutritionGoal,
        mealTimes:
          survey.mealTimes.length > 0
            ? survey.mealTimes.map((time) => ({
                time: new Date(time).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }),
              }))
            : [{ time: "08:00" }, { time: "13:00" }, { time: "18:00" }],
        eatingHabits: survey.eatingHabits,
      }

      form.reset(formData)
      previousMealsPerDay.current = formData.mealsPerDay
    }
  }, [survey, form])

  const onSubmit = (data: FormValues) => {
    const today = new Date().toISOString().split("T")[0]

    const formatted: PermanentSurvey = {
      lockToken: survey.lockToken,
      height: Number.parseFloat(data.height),
      dateOfBirth: new Date(data.dateOfBirth).toISOString(),
      gender: data.gender === "1",
      dietPreferences: data.dietPreferences.map((d) => d.value.trim()).filter(Boolean),
      allergies: data.allergies.map((a) => a.value.trim()).filter(Boolean),
      activityLevel: data.activityLevel,
      smokes: !!data.smokes,
      drinksAlcohol: !!data.drinksAlcohol,
      illnesses: data.illnesses.map((i) => i.value.trim()).filter(Boolean),
      medications: data.medications.map((m) => m.value.trim()).filter(Boolean),
      mealsPerDay: Number.parseInt(data.mealsPerDay),
      nutritionGoal: data.nutritionGoal,
      mealTimes: data.mealTimes.map(({ time }) => new Date(`${today}T${time}:00`).toISOString()),
      eatingHabits: data.eatingHabits,
    }

    updateSurvey(formatted, {
      onSuccess: () => {
        onSuccess?.()
      },
    })
  }

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <div className="animate-in fade-in-0 duration-700 ease-out">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut"
          }}
        ></motion.div>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{t("permanent_survey_form.edit_title")}</CardTitle>
            <CardDescription>{t("permanent_survey_form.edit_description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Accordion type="single" collapsible defaultValue="section-1" className="w-full">
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
                              <RequiredFormLabel>{t("permanent_survey_form.height")}</RequiredFormLabel>
                              <FormControl>
                                <Input type="number" placeholder="175" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormItem>
                        <Label>{t("permanent_survey_form.date_of_birth")}</Label>
                        <FormControl>
                          <div className="flex items-center h-10 px-3 text-sm border rounded-md bg-muted">
                            {new Date(survey.dateOfBirth).toLocaleDateString()}
                          </div>
                        </FormControl>
                      </FormItem>


                      <div>
                        <Label>{t("permanent_survey_form.gender")}</Label>
                        <div className="flex items-center h-10 px-3 py-2 text-sm border rounded-md bg-muted">
                          {survey.gender 
                            ? t("permanent_survey_form.gender_name.man") 
                            : t("permanent_survey_form.gender_name.female")}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="section-2">
                    <AccordionTrigger className="text-lg font-medium">
                      {t("permanent_survey_form.food_preferences")}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>{t("permanent_survey_form.diet_preferences")} (max 5)</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => dietPreferencesArray.append({ value: "" })}
                            className="h-8"
                            disabled={dietPreferencesArray.fields.length >= 5}
                          >
                            <Plus className="h-4 w-4 mr-1" /> {t("permanent_survey_form.add")}
                          </Button>
                        </div>
                        {dietPreferencesArray.fields.map((field, index) => (
                          <div key={field.id} className="flex items-center gap-2">
                            <div className="flex-grow">
                              <Input
                                {...form.register(`dietPreferences.${index}.value`)}
                                placeholder={t("permanent_survey_form.diet_preferences_placeholder")}
                                maxLength={100}
                              />
                              {form.formState.errors.dietPreferences?.[index]?.value && (
                                <p className="text-sm text-destructive mt-1">
                                  {form.formState.errors.dietPreferences[index]?.value?.message}
                                </p>
                              )}
                            </div>
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
                          <Label>{t("permanent_survey_form.allergies")} (max 5)</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => allergiesArray.append({ value: "" })}
                            className="h-8"
                            disabled={allergiesArray.fields.length >= 5}
                          >
                            <Plus className="h-4 w-4 mr-1" /> {t("permanent_survey_form.add")}
                          </Button>
                        </div>
                        {allergiesArray.fields.map((field, index) => (
                          <div key={field.id} className="flex items-center gap-2">
                            <div className="flex-grow">
                              <Input
                                {...form.register(`allergies.${index}.value`)}
                                placeholder={t("permanent_survey_form.allergies_placeholder")}
                                maxLength={100}
                              />
                              {form.formState.errors.allergies?.[index]?.value && (
                                <p className="text-sm text-destructive mt-1">
                                  {form.formState.errors.allergies[index]?.value?.message}
                                </p>
                              )}
                            </div>
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
                              <RequiredFormLabel>{t("permanent_survey_form.activity_level")}</RequiredFormLabel>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p>{t("permanent_survey_form.activity_level_description")}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("permanent_survey_form.activity_level_placeholder")} />
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
                                {activityLevelInfo[field.value as keyof typeof activityLevelInfo]}
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
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>{t("permanent_survey_form.smoking")}</FormLabel>
                                <FormDescription>{t("permanent_survey_form.smoking_description")}</FormDescription>
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
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>{t("permanent_survey_form.drinking_alcohol")}</FormLabel>
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

                  <AccordionItem value="section-4">
                    <AccordionTrigger className="text-lg font-medium">
                      {t("permanent_survey_form.health")}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label>{t("permanent_survey_form.illnesses")} (max 5)</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => illnessesArray.append({ value: "" })}
                            className="h-8"
                            disabled={illnessesArray.fields.length >= 5}
                          >
                            <Plus className="h-4 w-4 mr-1" /> {t("permanent_survey_form.add")}
                          </Button>
                        </div>
                        {illnessesArray.fields.map((field, index) => (
                          <div key={field.id} className="flex items-center gap-2">
                            <div className="flex-grow">
                              <Input
                                {...form.register(`illnesses.${index}.value`)}
                                placeholder={t("permanent_survey_form.illnesses_placeholder")}
                                maxLength={150}
                              />
                              {form.formState.errors.illnesses?.[index]?.value && (
                                <p className="text-sm text-destructive mt-1">
                                  {form.formState.errors.illnesses[index]?.value?.message}
                                </p>
                              )}
                            </div>
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
                          <Label>{t("permanent_survey_form.medications")} (max 5)</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => medicationsArray.append({ value: "" })}
                            className="h-8"
                            disabled={medicationsArray.fields.length >= 5}
                          >
                            <Plus className="h-4 w-4 mr-1" /> {t("permanent_survey_form.add")}
                          </Button>
                        </div>
                        {medicationsArray.fields.map((field, index) => (
                          <div key={field.id} className="flex items-center gap-2">
                            <div className="flex-grow">
                              <Input
                                {...form.register(`medications.${index}.value`)}
                                placeholder={t("permanent_survey_form.medications_placeholder")}
                                maxLength={200}
                              />
                              {form.formState.errors.medications?.[index]?.value && (
                                <p className="text-sm text-destructive mt-1">
                                  {form.formState.errors.medications[index]?.value?.message}
                                </p>
                              )}
                            </div>
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
                            <RequiredFormLabel>{t("permanent_survey_form.nutrition_goal")}</RequiredFormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("permanent_survey_form.choose_nutrition_goal")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="REDUCTION">{t("permanent_survey_form.reduction")}</SelectItem>
                                <SelectItem value="MAINTENANCE">{t("permanent_survey_form.maintenance")}</SelectItem>
                                <SelectItem value="MASS_GAIN">{t("permanent_survey_form.mass_gain")}</SelectItem>
                              </SelectContent>
                            </Select>
                            {field.value && (
                              <FormDescription>
                                {nutritionGoalInfo[field.value as keyof typeof nutritionGoalInfo]}
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
                            <RequiredFormLabel>{t("permanent_survey_form.number_of_meals_per_day")}</RequiredFormLabel>
                            <FormControl>
                              <Input type="number" min="1" max="10" placeholder="3" {...field} />
                            </FormControl>
                            <FormDescription>
                              {t("permanent_survey_form.meals_per_day_description")}{" "}
                              {t("permanent_survey_form.meal_times_auto_adjust")}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <RequiredFormLabel>
                            {t("permanent_survey_form.meal_times")} ({mealTimesArray.fields.length}{" "}
                            {t("permanent_survey_form.meals")})
                          </RequiredFormLabel>
                          <div className="text-sm text-muted-foreground">
                            {t("permanent_survey_form.time_format_label")}
                          </div>
                        </div>
                        <FormDescription className="text-sm">
                          {t("permanent_survey_form.time_format_helper")}
                        </FormDescription>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {mealTimesArray.fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                              <Label className="w-20 text-sm text-muted-foreground">
                                {t("permanent_survey_form.meal")} {index + 1}:
                              </Label>
                              <div className="flex-grow">
                                <Input type="time" {...form.register(`mealTimes.${index}.time`)} className="flex-grow" />
                                {i18n.language !== "pl" && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {form.watch(`mealTimes.${index}.time`) &&
                                      convertTo12Hour(form.watch(`mealTimes.${index}.time`))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
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
                            <RequiredFormLabel>{t("permanent_survey_form.eating_habits")}</RequiredFormLabel>
                            <FormControl>
                              <div className="relative">
                                <Textarea
                                  placeholder={t("permanent_survey_form.eating_habits_placeholder")}
                                  className="min-h-[120px] resize-none"
                                  maxLength={1000}
                                  {...field}
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                  {field.value?.length || 0}/1000
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Separator />

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
                    {t("common.cancel")}
                  </Button>

                  <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                    <AlertDialogTrigger asChild>
                      <Button type="button" disabled={isPending} className="w-full sm:w-auto">
                        {isPending ? t("permanent_survey_form.updating") : t("permanent_survey_form.update")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("permanent_survey_form.confirm_update_title")}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("permanent_survey_form.confirm_update_description")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                        <Button
                          onClick={() => {
                            setShowConfirmDialog(false)
                            form.handleSubmit(onSubmit)()
                          }}
                          disabled={isPending}
                        >
                          {isPending ? t("permanent_survey_form.updating") : t("permanent_survey_form.confirm_update")}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EditPermanentSurveyForm