import type { PermanentSurvey } from "@/types/permanent_survey"
import { useTranslation } from "react-i18next"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Separator } from "./ui/separator"
import { User, Utensils, Activity, Heart, Target } from "lucide-react"
import { Badge } from "./ui/badge"
import { useState } from "react"
import EditPermanentSurveyForm from "./editPermamentSurvey"
import { Edit } from "lucide-react"
import { Button } from "./ui/button"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { motion } from "framer-motion";

const PermanentSurveyView = ({ survey }: { survey: PermanentSurvey }) => {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const { data: currentUser } = useCurrentUser()
  const canEdit = currentUser?.roles?.some((role) => role.roleName === "CLIENT" && role.active) || false

  const getNutritionGoalLabel = (goal: string) => {
    switch (goal) {
      case "REDUCTION":
        return t("permanent_survey_form.reduction");
      case "MAINTENANCE":
        return t("permanent_survey_form.maintenance");
      case "MASS_GAIN":
        return t("permanent_survey_form.mass_gain");
      default:
        return goal;
    }
  };

  const getActivityLevelLabel = (level: string) => {
    switch (level) {
      case "SEDENTARY":
        return t("permanent_survey_form.activity_level_name.SEDENTARY");
      case "LIGHT":
        return t("permanent_survey_form.activity_level_name.LIGHT");
      case "MODERATE":
        return t("permanent_survey_form.activity_level_name.MODERATE");
      case "ACTIVE":
        return t("permanent_survey_form.activity_level_name.ACTIVE");
      case "VERY_ACTIVE":
        return t("permanent_survey_form.activity_level_name.VERY_ACTIVE");
      default:
        return level;
    }
  };

  if (isEditing && canEdit) {
    return <EditPermanentSurveyForm survey={survey} onSuccess={() => setIsEditing(false)} />
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="animate-in fade-in-0 duration-700 ease-out">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut"
          }}
        >
          <Card className="mx-auto shadow-xl py-8 rounded-2xl md:min-w-[750px] lg:min-w-[850px] md:min-h-[590px] m-4 md:m-0 lg:p-4">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl md:mb-5">
                  {t("client_dashboard.permanent_survey")}
                </CardTitle>
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    {t("common.edit")}
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Sekcja 1 - Master Data */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <p className="text-lg font-semibold">{t("permanent_survey_form.master_data")}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-4">
                    <p className="font-medium text-muted-foreground">{t("permanent_survey_form.height")}</p>
                    <p className="text-lg">{survey.height} cm</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground">{t("permanent_survey_form.date_of_birth")}</p>
                    <p className="text-lg">{new Date(survey.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground">{t("permanent_survey_form.gender")}</p>
                    <p className="text-lg">
                      {survey.gender
                        ? t("permanent_survey_form.gender_name.man")
                        : t("permanent_survey_form.gender_name.female")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Sekcja 2 - Food Preferences */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Utensils className="h-5 w-5" />
                  <p className="text-lg font-semibold">{t("permanent_survey_form.food_preferences")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground">{t("permanent_survey_form.diet_preferences")}</p>
                    <p>
                      {survey.dietPreferences.length > 0
                        ? survey.dietPreferences.map((pref, index) => (
                            <Badge variant="secondary" className="mr-2 mb-2 text-sm" key={index}>
                              {pref}
                            </Badge>
                          ))
                        : t("permanent_survey_form.none")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground">{t("permanent_survey_form.allergies")}</p>
                    <p>
                      {survey.allergies.length > 0
                        ? survey.allergies.map((allergy, index) => (
                            <Badge variant="destructive" className="mr-2 mb-2 text-sm" key={index}>
                              {allergy}
                            </Badge>
                          ))
                        : t("permanent_survey_form.none")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Sekcja 3 - Lifestyle */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <p className="text-lg font-semibold">{t("permanent_survey_form.lifestyle")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground">{t("permanent_survey_form.activity_level")}</p>
                    <Badge variant="secondary" className="text-sm">
                      {getActivityLevelLabel(survey.activityLevel)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground">{t("permanent_survey_form.smoking")}</p>
                    <Badge className="text-sm" variant={survey.smokes ? "destructive" : "secondary"}>
                      {survey.smokes ? t("common.yes") : t("common.no")}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground">{t("permanent_survey_form.drinking_alcohol")}</p>
                    <Badge className="text-sm" variant={survey.drinksAlcohol ? "destructive" : "secondary"}>
                      {survey.drinksAlcohol ? t("common.yes") : t("common.no")}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Sekcja 4 - Health */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Heart className="h-5 w-5" />
                  <p className="text-lg font-semibold">
                    {t("permanent_survey_form.health")}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground">{t("permanent_survey_form.illnesses")}</p>
                    <p>
                      {survey.illnesses.length > 0
                        ? survey.illnesses.map((illness, index) => (
                            <Badge variant="destructive" className="mr-2 mb-2 text-sm" key={index}>
                              {illness}
                            </Badge>
                          ))
                        : t("permanent_survey_form.none")}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground">{t("permanent_survey_form.medications")}</p>
                    <p>
                      {survey.medications.length > 0
                        ? survey.medications.map((medication, index) => (
                            <Badge variant="secondary" className="mr-2 mb-2 text-sm" key={index}>
                              {medication}
                            </Badge>
                          ))
                        : t("permanent_survey_form.none")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Sekcja 5 - Nutrition Plan */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <p className="text-lg font-semibold">{t("permanent_survey_form.nutrition_plan")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground">{t("permanent_survey_form.nutrition_goal")}</p>
                    <Badge variant="secondary" className="text-sm">
                      {getNutritionGoalLabel(survey.nutritionGoal)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground">
                      {t("permanent_survey_form.number_of_meals_per_day")}
                    </p>
                    <p className="text-lg">{survey.mealsPerDay}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground">{t("permanent_survey_form.meal_times")}</p>
                    <p>
                      {survey.mealTimes.length > 0
                        ? survey.mealTimes.map((time, index) => (
                            <Badge variant="secondary" className="mr-2 mb-2 text-sm" key={index}>
                              {new Date(time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Badge>
                          ))
                        : t("permanent_survey_form.none")}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium text-muted-foreground">{t("permanent_survey_form.eating_habits")}</p>
                  <p>{survey.eatingHabits || t("permanent_survey_form.none")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default PermanentSurveyView;
