import { describe, expect, it } from "vitest";
import { getFeaturedProjects, getProjects } from "@/lib/content/projects";

describe("project loaders", () => {
  it("returns an empty collection while no project files are added", () => {
    expect(getProjects()).toEqual([]);
    expect(getFeaturedProjects()).toEqual([]);
  });
});
