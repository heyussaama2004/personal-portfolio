"use client";

import { Home, RotateCcw, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Link } from "@/i18n/navigation";
import type { OsData } from "@/lib/os/types";
import type { WindowAppId } from "@/lib/os/window-manager/types";

export function MenuBar({
  data,
  apps,
  onOpenApp,
  onResetWindows,
  onOpenPalette,
}: {
  data: OsData;
  apps: { id: WindowAppId; label: string }[];
  onOpenApp: (id: WindowAppId) => void;
  onResetWindows: () => void;
  onOpenPalette: () => void;
}) {
  const t = useTranslations("os");

  return (
    <header className="glass mb-4 flex items-center justify-between gap-3 rounded-xl px-3 py-2">
      <div className="flex items-center gap-3">
        <span className="font-semibold">{data.owner.monogram} OS</span>
        <details className="relative">
          <summary className="cursor-pointer list-none rounded px-2 py-1 text-sm text-muted hover:text-foreground">
            {t("menu")}
          </summary>
          <ul className="absolute start-0 top-full z-[100] mt-1 w-48 rounded-lg border border-line bg-raised p-1 shadow-lg">
            {apps.map((app) => (
              <li key={app.id}>
                <button
                  type="button"
                  onClick={() => onOpenApp(app.id)}
                  className="w-full rounded px-2 py-2 text-start text-sm hover:bg-surface"
                >
                  {app.label}
                </button>
              </li>
            ))}
          </ul>
        </details>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenPalette}
          aria-label={t("commandPalette")}
          title={t("commandPalette")}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm hover:text-primary"
        >
          <Search aria-hidden="true" size={16} />
          <span className="hidden lg:inline">{t("commandPalette")}</span>
        </button>
        <button
          type="button"
          onClick={onResetWindows}
          aria-label={t("resetWindows")}
          title={t("resetWindows")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface hover:text-primary"
        >
          <RotateCcw aria-hidden="true" size={16} />
        </button>
        <Link
          href="/"
          aria-label={t("home")}
          title={t("home")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface hover:text-primary"
        >
          <Home aria-hidden="true" size={16} />
        </Link>
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
