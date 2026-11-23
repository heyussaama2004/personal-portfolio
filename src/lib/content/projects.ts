import fs from "node:fs";
import path from "node:path";
import { projectSchema, type Project } from "@/content/schemas";

const projectsDirectory = path.join(process.cwd(), "src", "content", "projects");
const publicDirectory = path.join(process.cwd(), "public");

export function createProjectLoader(directory: string) {
  return function loadProjects(): Project[] {
    let files: string[];
    try {
      files = fs.readdirSync(directory).filter((file) => file.endsWith(".json"));
    } catch {
      return [];
    }

    return files
      .map((file) => JSON.parse(fs.readFileSync(path.join(directory, file), "utf8")))
      .map((entry) => projectSchema.parse(entry))
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);
  };
}

const loadProjects = createProjectLoader(projectsDirectory);

export function getProjects(): Project[] {
  return loadProjects();
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find((project) => project.slug === slug);
}

function resolveAsset(asset: string, directory: string): string | undefined {
  const relative = asset.replace(/^\/+/, "");
  const root = path.resolve(directory);
  const resolved = path.resolve(root, relative);

  if (!resolved.startsWith(`${root}${path.sep}`)) return undefined;
  return fs.existsSync(resolved) ? resolved : undefined;
}

export function getProjectCover(
  project: Project,
  directory: string = publicDirectory,
): string | undefined {
  return project.cover ? (resolveAsset(project.cover, directory) ? project.cover : undefined) : undefined;
}

export function getProjectGallery(
  project: Project,
  directory: string = publicDirectory,
): string[] {
  return project.gallery.filter((asset) => resolveAsset(asset, directory) !== undefined);
}
