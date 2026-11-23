import type { Project } from "@/content/schemas"

type ProjectCategory = Project["category"]

export function filterProjects(
  projects: Project[],
  query = "",
  category?: ProjectCategory,
  tag?: string,
): Project[] {
  const needle = query.trim().toLowerCase()

  return projects.filter((project) => {
    if (category && project.category !== category) return false
    if (tag && !project.tags.includes(tag)) return false
    if (!needle) return true

    const haystack = [
      project.title,
      ...Object.values(project.summary),
      ...project.tags,
      ...project.tech,
      project.category,
    ]
      .join(" ")
      .toLowerCase()

    return haystack.includes(needle)
  })
}

export function getCategories(projects: Project[]): ProjectCategory[] {
  return [...new Set(projects.map((project) => project.category))].sort((a, b) =>
    a.localeCompare(b),
  )
}

export function getTags(projects: Project[]): string[] {
  return [...new Set(projects.flatMap((project) => project.tags))].sort((a, b) =>
    a.localeCompare(b),
  )
}
