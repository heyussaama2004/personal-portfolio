import { describe, expect, it } from "vitest"
import type { Project } from "@/content/schemas"
import { filterProjects, getCategories, getTags } from "@/lib/content/project-filter"

function makeProject(overrides: Partial<Project>): Project {
  return {
    slug: "base",
    title: "Base project",
    summary: { en: "A base project", fr: "Un projet de base", ar: "مشروع أساسي" },
    category: "web-development",
    status: "completed",
    featured: false,
    order: 10,
    tags: ["react"],
    tech: ["React"],
    gallery: [],
    galleryAlt: [],
    highlights: [],
    ...overrides,
  }
}

const projects: Project[] = [
  makeProject({
    slug: "hrnexus",
    title: "HRNexus",
    summary: { en: "HR and payroll for Moroccan businesses" },
    category: "php-mysql",
    tags: ["PHP", "Payroll"],
  }),
  makeProject({
    slug: "landing",
    title: "Landing page",
    summary: { en: "A fast marketing site" },
    category: "web-development",
    tags: ["Next.js"],
  }),
]

describe("project filtering", () => {
  it("matches query text against title, summary, tags and tech", () => {
    expect(filterProjects(projects, "hrnexus").map((item) => item.slug)).toEqual(["hrnexus"])
    expect(filterProjects(projects, "payroll").map((item) => item.slug)).toEqual(["hrnexus"])
    expect(filterProjects(projects, "marketing").map((item) => item.slug)).toEqual(["landing"])
    expect(filterProjects(projects, "next").map((item) => item.slug)).toEqual(["landing"])
  })

  it("filters by category and tag", () => {
    expect(filterProjects(projects, "", "php-mysql").map((item) => item.slug)).toEqual(["hrnexus"])
    expect(filterProjects(projects, "", undefined, "PHP").map((item) => item.slug)).toEqual([
      "hrnexus",
    ])
    expect(filterProjects(projects, "", "web-development", "PHP")).toEqual([])
  })

  it("builds filter option lists from loaded projects", () => {
    expect(getCategories(projects)).toEqual(["php-mysql", "web-development"])
    expect(getTags(projects)).toEqual(["Next.js", "Payroll", "PHP"])
  })
})
