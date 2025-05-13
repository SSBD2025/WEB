import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import pl from "./locales/pl.json";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: en,
            },
            pl: {
                translation: pl,
            },
        },
        fallbackLng: "pl",
        interpolation: {
            escapeValue: false,
        },
        supportedLngs: ["en", "pl"],
        detection: {
            order: ["navigator", "localStorage", "cookie"],
            caches: ["localStorage", "cookie"],
        },
    });

export default i18n;