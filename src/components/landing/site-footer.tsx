import { getTranslations } from "next-intl/server"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Link } from "@/i18n/navigation"
import { siteConfig } from "@/config/site"

export async function SiteFooter() {
  const t = await getTranslations("footer")

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-muted sm:px-8">
        <p>
          © {new Date().getFullYear()} {siteConfig.owner.name}. {t("rights")}
        </p>
        <div className="flex items-center gap-3">
          <Link className="rounded transition-colors hover:text-foreground" href="/privacy">
            {t("privacy")}
          </Link>
          <span aria-hidden="true" className="text-line">
            /
          </span>
          <span>{t("builtWith")}</span>
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </footer>
  )
}
