import { describe, expect, it } from "vitest";
import { getVisibleCommands } from "@/lib/os/commands/registry";
import { runTerminalCommand, suggestCommand } from "@/lib/os/terminal/parser";
import type { TerminalContext } from "@/lib/os/terminal/types";
import type { OsData } from "@/lib/os/types";

const strings: Record<string, string> = {
  "terminal.helpLine": "{command}: {description}",
  "terminal.contactUnavailable": "No direct contact channel is configured yet.",
  "terminal.cvUnavailable": "No CV is configured for this language yet.",
  "terminal.cvAvailable": "CVs: {locales}",
  "terminal.themeUsage": "Usage: theme [dark|light|toggle]",
  "terminal.langUsage": "Usage: lang [en|fr|ar]",
  "terminal.openUsage": "Usage: open [app|project]",
  "terminal.unknown": "Unknown command: {command}",
  "terminal.didYouMean": "Did you mean {suggestion}?",
  "terminal.projectLine": "{title} ({slug})",
  "terminal.unknownProject": "Unknown project: {slug}",
  "terminal.skillLine": "{group}: {skills}",
  "terminal.experienceLine": "{title} — {organization}",
  "terminal.easter.matrix": "Wake up, Ussama.",
  "terminal.easter.coffee": "Coffee is a build dependency.",
  "terminal.easter.sudo": "Nice try.",
  "common.empty": "Nothing here yet",
  "terminal.commands.help": "Show commands",
  "terminal.commands.open": "Open an app or project",
};

const frStrings: Record<string, string> = {
  ...strings,
  "terminal.contactUnavailable": "Aucun canal de contact direct n'est configuré.",
};

function makeContext(overrides: Partial<OsData> = {}, locale: "en" | "fr" = "en"): TerminalContext {
  const data: OsData = {
    locale,
    owner: {
      name: "Ussama",
      monogram: "OL",
      location: "Laâyoune, Morocco",
      headline: "Full-stack developer",
      bio: "I build practical web software.",
    },
    projects: [
      {
        slug: "hrnexus",
        title: "HRNexus",
        summary: "HR and payroll",
        category: "php-mysql",
        tags: ["PHP"],
        tech: ["PHP", "MySQL"],
        featured: true,
      },
    ],
    skills: [
      {
        id: "frontend",
        title: "Frontend",
        skills: [{ name: "TypeScript", level: "core" }],
      },
    ],
    experience: [
      {
        id: "internship",
        title: "Internship",
        organization: "National Education",
      },
    ],
    presence: [],
    contact: { configured: false, formEnabled: false },
    cvLocales: [],
    ...overrides,
  };

  return {
    data,
    locale,
    t: (key, values) => {
      const source = locale === "fr" ? frStrings : strings;
      let result = source[key] ?? key;
      for (const [name, value] of Object.entries(values ?? {})) {
        result = result.replace(`{${name}}`, value);
      }
      return result;
    },
  };
}

describe("terminal commands", () => {
  it("lists visible commands in help", () => {
    const result = runTerminalCommand("help", makeContext());
    expect(result.lines).toContain("help: Show commands");
    expect(result.lines).toContain("open: Open an app or project");
    expect(result.lines.some((line) => line.includes("sudo"))).toBe(false);
  });

  it("prints about, projects, skills and experience", () => {
    const context = makeContext();
    const about = runTerminalCommand("about", context);
    expect(about.lines).toContain("Full-stack developer");
    expect(about.lines).toContain("I build practical web software.");
    expect(about.lines).toContain("Laâyoune, Morocco");

    expect(runTerminalCommand("projects", context).lines).toContain("HRNexus (hrnexus)");
    expect(runTerminalCommand("skills", context).lines).toContain("Frontend: TypeScript");
    expect(runTerminalCommand("experience", context).lines).toContain(
      "Internship — National Education",
    );
  });

  it("shows one project for projects <slug>", () => {
    expect(runTerminalCommand("projects hrnexus", makeContext()).lines).toEqual([
      "HRNexus (hrnexus)",
      "HR and payroll",
      "PHP, MySQL",
    ]);
  });

  it("reports unknown project slugs with a suggestion", () => {
    expect(runTerminalCommand("projects hrnexu", makeContext()).lines).toEqual([
      "Unknown project: hrnexu",
      "Did you mean hrnexus?",
    ]);
  });

  it("handles empty and configured contact states", () => {
    expect(runTerminalCommand("contact", makeContext()).lines).toEqual([
      "No direct contact channel is configured yet.",
    ]);
    const configured = makeContext({
      contact: { configured: true, formEnabled: false, email: "hello@example.com" },
    });
    expect(runTerminalCommand("contact", configured).lines).toContain("hello@example.com");
  });

  it("localizes unavailable messages", () => {
    const french = makeContext({}, "fr");
    expect(runTerminalCommand("contact", french).lines).toEqual([
      "Aucun canal de contact direct n'est configuré.",
    ]);
  });

  it("handles CV availability", () => {
    expect(runTerminalCommand("cv", makeContext()).lines).toEqual([
      "No CV is configured for this language yet.",
    ]);
    const withCv = makeContext({ cvLocales: ["en", "fr"] });
    expect(runTerminalCommand("cv", withCv).lines).toEqual(["CVs: en, fr"]);
  });

  it("validates theme and language arguments", () => {
    expect(runTerminalCommand("theme dark", makeContext()).action).toEqual({
      type: "theme",
      value: "dark",
    });
    expect(runTerminalCommand("theme", makeContext()).action).toEqual({
      type: "theme",
      value: "toggle",
    });
    expect(runTerminalCommand("theme neon", makeContext()).lines).toEqual([
      "Usage: theme [dark|light|toggle]",
    ]);

    expect(runTerminalCommand("lang ar", makeContext()).action).toEqual({
      type: "lang",
      locale: "ar",
    });
    expect(runTerminalCommand("lang de", makeContext()).lines).toEqual([
      "Usage: lang [en|fr|ar]",
    ]);
  });

  it("opens apps and projects and rejects unknown targets", () => {
    expect(runTerminalCommand("open skills", makeContext()).action).toEqual({
      type: "open-app",
      appId: "skills",
    });
    expect(runTerminalCommand("open hrnexus", makeContext()).action).toEqual({
      type: "open-project",
      slug: "hrnexus",
    });
    expect(runTerminalCommand("open nope", makeContext()).lines[0]).toContain("Unknown command");
    expect(runTerminalCommand("open", makeContext()).lines[0]).toContain("Usage: open");
  });

  it("clears output and supports Easter eggs", () => {
    expect(runTerminalCommand("clear", makeContext()).clear).toBe(true);
    expect(runTerminalCommand("matrix", makeContext()).lines).toEqual(["Wake up, Ussama."]);
    expect(runTerminalCommand("coffee", makeContext()).lines).toEqual([
      "Coffee is a build dependency.",
    ]);
    expect(runTerminalCommand("sudo rm -rf /", makeContext()).lines).toEqual(["Nice try."]);
  });

  it("suggests close matches for unknown commands", () => {
    expect(suggestCommand("projcts")).toBe("projects");
    expect(runTerminalCommand("projcts", makeContext()).lines).toEqual([
      "Unknown command: projcts",
      "Did you mean projects?",
    ]);
    expect(runTerminalCommand("xyz", makeContext()).lines).toEqual(["Unknown command: xyz"]);
  });

  it("ignores blank input and exposes a stable visible registry", () => {
    expect(runTerminalCommand("   ", makeContext()).lines).toEqual([]);
    const ids = getVisibleCommands().map((command) => command.id);
    expect(ids).toContain("help");
    expect(ids).toContain("open");
    expect(ids).not.toContain("sudo");
  });
});
