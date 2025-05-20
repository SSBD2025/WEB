import { useEffect, useState } from "react";

const THEME_KEY = "theme";

export const useTheme = () => {
    const [userTheme, setUserTheme] = useState<boolean>(false);

    useEffect(() => {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved !== null) {
            setUserTheme(saved === "true");
        }
    }, []);

    const toggleTheme = () => {
        setUserTheme((prev) => {
            localStorage.setItem(THEME_KEY, (!prev).toString());
            return !prev;
        });
    };

    const setTheme = (value: boolean) => {
        localStorage.setItem(THEME_KEY, value.toString());
        setUserTheme(value);
    };

    return { userTheme, toggleTheme, setTheme };
};
