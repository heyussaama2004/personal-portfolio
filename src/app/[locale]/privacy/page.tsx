import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { isLocale } from "@/i18n/routing";
import { buildJsonLd, buildMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "privacy" });

  return buildMetadata({
    locale,
    path: "/privacy",
    title: t("title"),
    description: t("intro"),
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "privacy" });
  const navT = await getTranslations({ locale, namespace: "nav" });

  return (
    <>
      <JsonLd
        data={buildJsonLd({
          config: siteConfig,
          locale,
          path: "/privacy",
          breadcrumbs: [
            { name: navT("home"), path: "/" },
            { name: t("title"), path: "/privacy" },
          ],
        })}
      />
      <SiteHeader locale={locale} />
      <main id="main">
        <Section id="privacy" as="h1" title={t("title")} subtitle={t("intro")}>
          <div className="max-w-3xl space-y-6 text-base leading-relaxed text-muted">
            <p>{t("storage")}</p>
            <p>{t("contact")}</p>
            <p>{t("analytics")}</p>
            <p>{t("rights")}</p>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
