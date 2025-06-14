export interface PermanentSurvey {
    lockToken?: string;
    height: number;
    dateOfBirth: string;
    gender: boolean;
    dietPreferences: string[];
    allergies: string[];
    activityLevel: "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE" | "VERY_ACTIVE";
    smokes: boolean;
    drinksAlcohol: boolean;
    illnesses: string[];
    medications: string[];
    mealsPerDay: number;
    nutritionGoal: "REDUCTION" | "MAINTENANCE" | "MASS_GAIN";
    mealTimes: string[];
    eatingHabits: string;
}