import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { isLocale } from "@/i18n/routing";
import { localize } from "@/lib/content/loaders";
import { getProjectBySlug } from "@/lib/content/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateImageMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return [{ id: "og", alt: project ? `${project.title} preview` : siteConfig.owner.name }];
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const safeLocale = isLocale(locale) ? locale : "en";
  const project = getProjectBySlug(slug);
  const title = project?.title ?? siteConfig.owner.name;
  const summary = project ? localize(project.summary, safeLocale).value : siteConfig.owner.headline[safeLocale] ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background: "linear-gradient(135deg, #0B0F19 0%, #0F172A 60%, #1E293B 100%)",
          color: "#F8FAFC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "14px", alignItems: "center", color: "#93C5FD", fontSize: 26 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
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
            <span>{siteConfig.owner.name}</span>
          </div>
          <div style={{ fontSize: 22, color: "#94A3B8" }}>Project</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", maxWidth: 960 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: "#CBD5E1" }}>{summary.slice(0, 140)}</div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#64748B" }}>{siteConfig.site.url}</div>
      </div>
    ),
    size,
  );
}
