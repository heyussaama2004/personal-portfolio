import { ArrowUpRight, Code2 } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { FallbackBadge } from "@/components/ui/fallback-badge";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getFeaturedProjects } from "@/lib/content/projects";
import { localize } from "@/lib/content/loaders";

export async function FeaturedProjectsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("sections");
  const projectT = await getTranslations("projects");
  const projects = getFeaturedProjects().slice(0, 3);

  if (projects.length === 0) return null;

  return (
    <Section id="projects" title={t("projects")} subtitle={t("projectsSubtitle")}>
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const summary = localize(project.summary, locale);
          return (
            <li key={project.slug} className="group overflow-hidden rounded-xl border border-line bg-surface">
              <Link href={`/projects/${project.slug}`} className="block rounded-xl">
                <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-primary/25 via-secondary/15 to-transparent">
                  <Code2 aria-hidden="true" size={36} className="text-primary/70" />
                  {project.featured ? (
                    <span className="absolute start-3 top-3 rounded-full border border-line bg-background/70 px-2 py-1 text-[11px] font-medium">
                      {projectT("featured")}
                    </span>
                  ) : null}
                </div>
                <div className="p-5">
                  <h3 className="flex items-center font-semibold">
                    {project.title}
                    <ArrowUpRight
                      aria-hidden="true"
                      size={16}
                      className="ms-auto text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {summary.value}
                    <FallbackBadge show={summary.fallbackUsed} />
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tech.slice(0, 3).map((tech) => (
                      <span key={tech} className="rounded-full border border-line px-2 py-1 text-xs text-muted">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
