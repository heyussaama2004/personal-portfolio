import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { Project } from "@/content/schemas";
import {
  createProjectLoader,
  getFeaturedProjects,
  getProjectCover,
  getProjectGallery,
  getProjects,
} from "@/lib/content/projects";

const temporaryDirectories: string[] = [];

function makeDirectory() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "ol-projects-"));
  temporaryDirectories.push(directory);
  return directory;
}

function writeProject(directory: string, name: string, overrides: Partial<Project>) {
  const project = {
    slug: overrides.slug ?? name,
    title: overrides.title ?? name,
    summary: overrides.summary ?? { en: `${name} summary` },
    category: overrides.category ?? "web-development",
    status: overrides.status ?? "completed",
    featured: overrides.featured ?? false,
    order: overrides.order ?? 100,
    tags: overrides.tags ?? [],
    tech: overrides.tech ?? [],
    gallery: overrides.gallery ?? [],
    highlights: overrides.highlights ?? [],
    ...overrides,
  };
  fs.writeFileSync(path.join(directory, `${name}.json`), JSON.stringify(project));
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

describe("project loaders", () => {
  it("loads HRNexus from its single content file", () => {
    const projects = getProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]).toMatchObject({
      slug: "hrnexus",
      title: "HRNexus",
      category: "php-mysql",
      status: "in-progress",
      featured: true,
      tech: ["PHP", "MySQL"],
    });
    expect(getFeaturedProjects().map((project) => project.slug)).toEqual(["hrnexus"]);
  });

  it("sorts featured projects first and then by order", () => {
    const directory = makeDirectory();
    writeProject(directory, "later", { slug: "later", order: 2, featured: true });
    writeProject(directory, "earlier", { slug: "earlier", order: 1, featured: true });
    writeProject(directory, "plain", { slug: "plain", order: 0 });

    expect(createProjectLoader(directory)().map((project) => project.slug)).toEqual([
      "earlier",
      "later",
      "plain",
    ]);
  });

  it("picks up a project when one JSON file is added", () => {
    const directory = makeDirectory();
    const load = createProjectLoader(directory);
    expect(load()).toEqual([]);

    writeProject(directory, "new-one", { slug: "new-one" });
    expect(load().map((project) => project.slug)).toEqual(["new-one"]);
  });

  it("falls back when a project asset is missing", () => {
    const directory = makeDirectory();
    fs.writeFileSync(path.join(directory, "exists.png"), "asset");
    const project = {
      slug: "hrnexus",
      title: "HRNexus",
      summary: { en: "HR and payroll" },
      category: "php-mysql" as const,
      status: "completed" as const,
      featured: false,
      order: 1,
      tags: [],
      tech: [],
      cover: "missing.png",
      gallery: ["exists.png", "missing.png"],
      galleryAlt: [],
      highlights: [],
    } satisfies Project;

    expect(getProjectCover(project, directory)).toBeUndefined();
    expect(getProjectGallery(project, directory)).toEqual(["exists.png"]);
    expect(getProjectCover({ ...project, cover: "exists.png" }, directory)).toBe("exists.png");
  });
});
