import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/section";
import { ProjectCard } from "@/components/projects/project-card";
import type { Locale } from "@/i18n/routing";
import { getFeaturedProjects, getProjectCover } from "@/lib/content/projects";

export async function FeaturedProjectsSection({ locale }: { locale: Locale }) {
  const t = await getTranslations("sections");
  const projectT = await getTranslations("projects");
  const projects = getFeaturedProjects().slice(0, 3);

  if (projects.length === 0) return null;

  return (
    <Section id="projects" title={t("projects")} subtitle={t("projectsSubtitle")}>
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            locale={locale}
            cover={getProjectCover(project)}
            featuredLabel={projectT("featured")}
          />
        ))}
      </ul>
    </Section>
  );
}
