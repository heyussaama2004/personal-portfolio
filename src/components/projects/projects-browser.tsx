"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import type { Project } from "@/content/schemas";
import type { Locale } from "@/i18n/routing";
import { filterProjects, getCategories, getTags } from "@/lib/content/project-filter";
import { ProjectCard } from "./project-card";

export function ProjectsBrowser({
  projects,
  covers,
  locale,
}: {
  projects: Project[];
  covers: Record<string, string | undefined>;
  locale: Locale;
}) {
  const t = useTranslations("projects");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");
  const [tag, setTag] = useState<string>("");

  const categories = useMemo(() => getCategories(projects), [projects]);
  const tags = useMemo(() => getTags(projects), [projects]);
  const visible = useMemo(
    () =>
      filterProjects(
        projects,
        query,
        category ? (category as Project["category"]) : undefined,
        tag || undefined,
      ),
    [projects, query, category, tag],
  );

  return (
    <div>
      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <label className="relative sm:col-span-1">
          <Search
            aria-hidden="true"
            size={16}
            className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <span className="sr-only">{t("search")}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("search")}
            className="h-11 w-full rounded-lg border border-line bg-surface ps-9 pe-3 text-sm"
          />
        </label>
        <select
          aria-label={t("allCategories")}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-11 rounded-lg border border-line bg-surface px-3 text-sm"
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {t(`categories.${item}`)}
            </option>
          ))}
        </select>
        <select
          aria-label={t("allTags")}
          value={tag}
          onChange={(event) => setTag(event.target.value)}
          className="h-11 rounded-lg border border-line bg-surface px-3 text-sm"
        >
          <option value="">{t("allTags")}</option>
          {tags.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
          {t("noResults")}
        </p>
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
              cover={covers[project.slug]}
              featuredLabel={t("featured")}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
