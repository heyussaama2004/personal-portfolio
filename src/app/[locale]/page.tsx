import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";

export default async function HomePage() {
  const t = await getTranslations("hero");

  return (
    <main id="main" className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-4xl font-semibold tracking-tight">{siteConfig.owner.name}</h1>
      <p className="mt-4 max-w-2xl text-muted">{t("description")}</p>
    </main>
  );
}
