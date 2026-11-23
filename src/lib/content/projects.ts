import fs from "node:fs";
import path from "node:path";
import { projectSchema, type Project } from "@/content/schemas";

const projectsDirectory = path.join(process.cwd(), "src", "content", "projects");

export function getProjects(): Project[] {
  let files: string[];
  try {
    files = fs.readdirSync(projectsDirectory).filter((file) => file.endsWith(".json"));
  } catch {
    return [];
  }

  return files
    .map((file) => JSON.parse(fs.readFileSync(path.join(projectsDirectory, file), "utf8")))
    .map((entry) => projectSchema.parse(entry))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}
