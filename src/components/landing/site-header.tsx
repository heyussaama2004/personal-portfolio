import { Terminal } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { availableCvLocales } from "@/lib/config/visibility";

export async function SiteHeader({ locale }: { locale: Locale }) {
  const t = await getTranslations("nav");
  const os = await getTranslations("os");
  const cvLocales = availableCvLocales(siteConfig);
  const firstCv = cvLocales[0];

  return (
    <header className="glass sticky top-0 z-40 rounded-none border-x-0 border-t-0">
      <nav
        aria-label={siteConfig.owner.name}
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-5 sm:px-8"
      >
        <Link href="/" className="flex items-center gap-3 rounded-md">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-background">
            {siteConfig.owner.monogram}
          </span>
          <span className="hidden font-semibold sm:inline">{siteConfig.owner.name}</span>
        </Link>

        <ul className="hidden items-center gap-6 text-sm text-muted md:flex">
          <li>
            <Link className="rounded transition-colors hover:text-foreground" href="/#projects">
              {t("projects")}
            </Link>
          </li>
          <li>
            <Link className="rounded transition-colors hover:text-foreground" href="/#services">
              {t("services")}
            </Link>
          </li>
          {firstCv ? (
            <li>
              <a
                className="rounded transition-colors hover:text-foreground"
                href={`/cv/${firstCv}.pdf`}
              >
                {t("cv")}
              </a>
            </li>
          ) : null}
          <li>
            <Link className="rounded transition-colors hover:text-foreground" href="/#contact">
              {t("contact")}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            href="/os"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            <Terminal aria-hidden="true" size={16} />
            <span className="hidden lg:inline">OS</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
