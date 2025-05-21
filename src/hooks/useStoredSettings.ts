import { useEffect, useState } from "react";

const STORAGE_KEY = "accountsListSettings";

interface Settings {
  pageSize: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const defaultSettings: Settings = {
  pageSize: 7,
  sortBy: "firstName",
  sortOrder: "asc",
};

function useStoredSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return [settings, setSettings] as const;
}

export default useStoredSettings;