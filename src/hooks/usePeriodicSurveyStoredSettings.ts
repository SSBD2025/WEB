import {useEffect, useState} from "react";

const PERIODIC_SURVEY_STORAGE_KEY = "periodicSurveySettings";

interface PeriodicSurveySettings {
    pageSize: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
}

const defaultPeriodicSurveySettings: PeriodicSurveySettings = {
    pageSize: 5, // Domyślna wartość dla listy ankiet
    sortBy: "measurementDate", // Domyślne sortowanie po dacie pomiaru
    sortOrder: "desc", // Domyślnie najnowsze na górze
};

function usePeriodicSurveySettings() {
    const [settings, setSettings] = useState<PeriodicSurveySettings>(() => {
        // Sprawdź czy są zapisane ustawienia w localStorage
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(PERIODIC_SURVEY_STORAGE_KEY);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    // Walidacja przechowywanych ustawień
                    return {
                        pageSize: typeof parsed.pageSize === "number" ?
                            Math.max(5, Math.min(50, parsed.pageSize)) : // Ogranicz do zakresu 5-50
                            defaultPeriodicSurveySettings.pageSize,
                        sortBy: ["measurementDate", "weight", "bloodPressure", "bloodSugarLevel"].includes(parsed.sortBy) ?
                            parsed.sortBy :
                            defaultPeriodicSurveySettings.sortBy,
                        sortOrder: parsed.sortOrder === "asc" || parsed.sortOrder === "desc" ?
                            parsed.sortOrder :
                            defaultPeriodicSurveySettings.sortOrder
                    };
                } catch {
                    return defaultPeriodicSurveySettings;
                }
            }
        }
        return defaultPeriodicSurveySettings;
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(PERIODIC_SURVEY_STORAGE_KEY, JSON.stringify(settings));
        }
    }, [settings]);

    // Funkcja do aktualizacji tylko części ustawień
    const updateSettings = (partialSettings: Partial<PeriodicSurveySettings>) => {
        setSettings(prev => ({
            ...prev,
            ...partialSettings
        }));
    };

    return {
        settings,
        updateSettings,
        setPageSize: (pageSize: number) => updateSettings({ pageSize }),
        setSort: (sortBy: string, sortOrder: "asc" | "desc") => updateSettings({ sortBy, sortOrder })
    };
}

export default usePeriodicSurveySettings;