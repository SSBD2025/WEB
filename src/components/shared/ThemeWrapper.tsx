import { ReactNode, useEffect, useState } from "react";

export type AccessLevel = "admin" | "client" | "dietician" | null;

interface ThemeWrapperProps {
  role: AccessLevel;
  prefersDark: boolean;
  children: ReactNode;
}

export const ThemeWrapper = ({
  role,
  prefersDark,
  children,
}: ThemeWrapperProps) => {
  const [, setTheme] = useState<string>("");

  useEffect(() => {
    const newTheme = `theme-${role}-${prefersDark ? "dark" : "light"}`;
    setTheme(newTheme);
    document.body.className = newTheme;
  }, [role, prefersDark]);

  return <>{children}</>;
};
