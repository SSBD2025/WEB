import * as z from "zod";
import { t } from "i18next";

export const formSchema = z.object({
  height: z
    .number({
      required_error: t("permanent_survey_form.height_required"),
      invalid_type_error: t("permanent_survey_form.height_message"),
    })
    .positive(t("permanent_survey_form.height_message"))
    .max(220, t("permanent_survey_form.max_height")),
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
    .number({
      required_error: t("permanent_survey_form.meals_per_day_required"),
      invalid_type_error: t("permanent_survey_form.meals_per_day_message"),
    })
    .int()
    .min(1, t("permanent_survey_form.meals_per_day_message"))
    .max(10, t("permanent_survey_form.meals_per_day_message")),
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
    .min(10, t("permanent_survey_form.eating_habits_min"))
    .max(500, t("permanent_survey_form.eating_habits_max")),
});

export type FormValues = z.infer<typeof formSchema>;

export const activityLevelInfo = {
  SEDENTARY: t("permanent_survey_form.activity_level_info.sedentary"),
  LIGHT: t("permanent_survey_form.activity_level_info.light"),
  MODERATE: t("permanent_survey_form.activity_level_info.moderate"),
  ACTIVE: t("permanent_survey_form.activity_level_info.active"),
  VERY_ACTIVE: t("permanent_survey_form.activity_level_info.very_active"),
};

export const nutritionGoalInfo = {
  REDUCTION: t("permanent_survey_form.nutrition_goal_info.reduction"),
  MAINTENANCE: t("permanent_survey_form.nutrition_goal_info.maintenance"),
  MASS_GAIN: t("permanent_survey_form.nutrition_goal_info.mass_gain"),
};
