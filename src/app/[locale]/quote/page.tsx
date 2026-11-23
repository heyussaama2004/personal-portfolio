import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { QuoteForm } from "@/components/contact/quote-form";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { getServices } from "@/lib/content/loaders";
import { isLocale } from "@/i18n/routing";
import { buildMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({ locale, namespace: "contact" });

  return buildMetadata({
    locale,
    path: "/quote",
    title: t("openForm"),
    description: t("description"),
    indexable: false,
  });
}

export default async function QuotePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = await getTranslations({ locale, namespace: "contact" });
  const services = getServices(locale).map((service) => ({
    id: service.id,
    title: service.title,
  }));

  return (
    <>
      <SiteHeader locale={locale} />
      <main id="main">
        <Section id="quote" as="h1" title={t("openForm")} subtitle={t("description")}>
          <QuoteForm enabled={siteConfig.contact.contactFormEnabled} services={services} />
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
