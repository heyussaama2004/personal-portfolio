import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactSection } from "@/components/landing/contact-section";
import { ExperienceSection } from "@/components/landing/experience-section";
import { FeaturedProjectsSection } from "@/components/landing/featured-projects-section";
import { Hero } from "@/components/landing/hero";
import { PresenceSection } from "@/components/landing/presence-section";
import { ProofSection } from "@/components/landing/proof-section";
import { ServicesSection } from "@/components/landing/services-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { SkillsSection } from "@/components/landing/skills-section";
import { siteConfig } from "@/config/site";
import { isLocale, routing } from "@/i18n/routing";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const description = siteConfig.owner.headline[locale] ?? siteConfig.owner.headline.en;
  const title = `${siteConfig.owner.name} — ${siteConfig.owner.monogram}`;

  return {
    title: { default: title, template: `%s | ${siteConfig.owner.name}` },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(routing.locales.map((item) => [item, `/${item}`])),
    },
    openGraph: {
      title,
      description,
      locale,
      siteName: siteConfig.owner.name,
      type: "website",
      images: siteConfig.site.ogImage ? [siteConfig.site.ogImage] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <SiteHeader locale={locale} />
      <main id="main">
        <Hero locale={locale} />
        <FeaturedProjectsSection locale={locale} />
        <ServicesSection locale={locale} />
        <SkillsSection locale={locale} />
        <ExperienceSection locale={locale} />
        <ProofSection />
        <PresenceSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
