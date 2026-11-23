"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");

  return (
    <label className="relative inline-flex items-center">
      <Languages aria-hidden="true" size={16} className="pointer-events-none absolute start-2 text-muted" />
      <span className="sr-only">{t("language")}</span>
      <select
        value={locale}
        aria-label={t("language")}
        onChange={(event) => router.replace(pathname, { locale: event.target.value as Locale })}
        className="h-10 appearance-none rounded-lg border border-line bg-surface ps-8 pe-3 text-sm uppercase text-foreground"
      >
        {routing.locales.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
