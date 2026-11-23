"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

export function ThemeToggle() {
  const t = useTranslations("common");
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("ol-theme", next);
    listeners.forEach((listener) => listener());
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? t("light") : t("dark")}
      aria-pressed={theme === "light"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-foreground transition-colors hover:text-primary"
    >
      {theme === "dark" ? <Sun aria-hidden="true" size={18} /> : <Moon aria-hidden="true" size={18} />}
    </button>
  );
}
