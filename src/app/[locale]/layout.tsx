import type { ReactNode } from "react"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { IBM_Plex_Sans_Arabic, Inter, JetBrains_Mono } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import "@/app/globals.css"
import { JsonLd } from "@/components/seo/json-ld"
import { siteConfig } from "@/config/site"
import { isLocale, routing } from "@/i18n/routing"
import { buildJsonLd } from "@/lib/seo"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.site.url),
  title: {
    default: siteConfig.owner.name,
    template: `%s | ${siteConfig.owner.name}`,
  },
  description: siteConfig.owner.bio.en,
  applicationName: siteConfig.owner.name,
  robots: { index: true, follow: true },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const latinFont = Inter({
  subsets: ["latin"],
  variable: "--font-ui-latin",
  display: "swap",
})

const arabicFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ui-arabic",
  display: "swap",
})

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
})

const themeScript = `try{var t=localStorage.getItem('ol-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}`

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: "common" })
  const nonce = (await headers()).get("x-nonce") ?? undefined

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${latinFont.variable} ${arabicFont.variable} ${monoFont.variable}`}>
        <JsonLd
          data={buildJsonLd({
            config: siteConfig,
            locale,
            path: "/",
          })}
        />
        <NextIntlClientProvider messages={messages}>
          <a className="skip-link" href="#main">
            {t("skipToContent")}
          </a>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
