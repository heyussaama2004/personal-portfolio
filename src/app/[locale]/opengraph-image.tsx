import { ImageResponse } from "next/og"
import { siteConfig } from "@/config/site"
import { isLocale } from "@/i18n/routing"

export const alt = `${siteConfig.owner.name} portfolio`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const safeLocale = isLocale(locale) ? locale : "en"
  const headline = siteConfig.owner.headline[safeLocale] ?? siteConfig.owner.headline.en ?? ""

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px",
        background: "linear-gradient(135deg, #0B0F19 0%, #111827 55%, #1E293B 100%)",
        color: "#F8FAFC",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: 28,
          color: "#93C5FD",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "#3B82F6",
            color: "#0B0F19",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
          }}
        >
          {siteConfig.owner.monogram}
        </div>
        <span>{siteConfig.owner.location}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: 900 }}>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>
          {siteConfig.owner.name}
        </div>
        <div style={{ fontSize: 34, lineHeight: 1.3, color: "#CBD5E1" }}>{headline}</div>
      </div>
      <div style={{ display: "flex", fontSize: 24, color: "#94A3B8" }}>{siteConfig.site.url}</div>
    </div>,
    size,
  )
}
