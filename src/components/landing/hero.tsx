import { ArrowRight, Download, Terminal } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { availableCvLocales } from "@/lib/config/visibility";

export async function Hero({ locale }: { locale: Locale }) {
  const t = await getTranslations("hero");
  const common = await getTranslations("common");
  const cvLocales = availableCvLocales(siteConfig);
  const headline = siteConfig.owner.headline[locale] ?? siteConfig.owner.headline.en;

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 start-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
          {siteConfig.owner.name}
        </h1>
        <p className="mt-5 max-w-3xl text-xl font-medium text-foreground/90 sm:text-2xl">
          {headline}
        </p>
        <p className="mt-5 max-w-2xl leading-relaxed text-muted">{t("description")}</p>
        {siteConfig.owner.availability.jobs ||
        siteConfig.owner.availability.freelance ||
        siteConfig.owner.availability.remote ? (
          <p className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
            <span>{t("availability")}</span>
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/#contact"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 font-medium text-background transition-opacity hover:opacity-90"
          >
            {t("primary")}
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
          <Link
            href="/os"
            className="accent-glow inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-surface px-5 font-medium transition-colors hover:text-primary"
          >
            <Terminal aria-hidden="true" size={17} />
            {t("secondary")}
          </Link>
          {cvLocales.length > 0 ? (
            <a
              href={`/cv/${cvLocales[0]}.pdf`}
              className="inline-flex h-11 items-center gap-2 rounded-lg border border-line px-5 font-medium transition-colors hover:text-primary"
            >
              <Download aria-hidden="true" size={17} />
              {common("downloadCv")}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
