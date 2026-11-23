import { isLocale } from "@/i18n/routing";
import { getVisibleCommands } from "@/lib/os/commands/registry";
import { isAppId } from "@/lib/os/window-manager/reducer";
import type { TerminalContext, TerminalResult } from "./types";

function distance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, (_, row) =>
    Array.from({ length: b.length + 1 }, (_, column) => (row === 0 ? column : column === 0 ? row : 0)),
  );

  for (let row = 1; row <= a.length; row += 1) {
    for (let column = 1; column <= b.length; column += 1) {
      matrix[row]![column] = Math.min(
        matrix[row - 1]![column]! + 1,
        matrix[row]![column - 1]! + 1,
        matrix[row - 1]![column - 1]! + (a[row - 1] === b[column - 1] ? 0 : 1),
      );
    }
  }

  return matrix[a.length]![b.length]!;
}

function suggestValue(input: string, candidates: string[]): string | undefined {
  const needle = input.toLowerCase();
  const scored = candidates
    .map((candidate) => ({ candidate, score: distance(needle, candidate) }))
    .filter((entry) => entry.score <= 2 || entry.candidate.startsWith(needle))
    .sort((a, b) => a.score - b.score);

  return scored[0]?.candidate;
}

export function suggestCommand(input: string): string | undefined {
  return suggestValue(
    input,
    getVisibleCommands().map((command) => command.id),
  );
}

function suggestProject(input: string, slugs: string[]): string | undefined {
  return suggestValue(input, slugs);
}

function unknown(name: string, context: TerminalContext): TerminalResult {
  const lines = [context.t("terminal.unknown", { command: name })];
  const suggestion = suggestCommand(name);
  if (suggestion) lines.push(context.t("terminal.didYouMean", { suggestion }));
  return { lines };
}

export function runTerminalCommand(input: string, context: TerminalContext): TerminalResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };

  const [rawName = "", ...rest] = trimmed.split(/\s+/);
  const name = rawName.toLowerCase();
  const args = rest.map((argument) => argument.toLowerCase());
  const { data, t } = context;

  switch (name) {
    case "help":
      return {
        lines: getVisibleCommands().map((command) =>
          t("terminal.helpLine", {
            command: command.usage.split(" ")[0] ?? command.id,
            description: t(`terminal.commands.${command.id}`),
          }),
        ),
      };

    case "about":
      return { lines: [data.owner.headline, data.owner.bio, data.owner.location] };

    case "projects": {
      const slug = args[0];
      if (slug) {
        const project = data.projects.find((entry) => entry.slug === slug);
        if (!project) {
          const lines = [t("terminal.unknownProject", { slug })];
          const suggestion = suggestProject(
            slug,
            data.projects.map((entry) => entry.slug),
          );
          if (suggestion) lines.push(t("terminal.didYouMean", { suggestion }));
          return { lines };
        }
        return {
          lines: [
            t("terminal.projectLine", { title: project.title, slug: project.slug }),
            project.summary,
            ...(project.tech.length > 0 ? [project.tech.join(", ")] : []),
          ],
        };
      }
      return {
        lines:
          data.projects.length === 0
            ? [t("common.empty")]
            : data.projects.map((project) =>
                t("terminal.projectLine", { title: project.title, slug: project.slug }),
              ),
      };
    }

    case "skills":
      return {
        lines: data.skills.map((group) =>
          t("terminal.skillLine", {
            group: group.title,
            skills: group.skills.map((skill) => skill.name).join(", "),
          }),
        ),
      };

    case "experience":
      return {
        lines: data.experience.map((item) =>
          t("terminal.experienceLine", { title: item.title, organization: item.organization }),
        ),
      };

    case "contact": {
      if (!data.contact.configured) return { lines: [t("terminal.contactUnavailable")] };
      const lines: string[] = [];
      if (data.contact.email) lines.push(data.contact.email);
      if (data.contact.whatsapp) lines.push(`WhatsApp: ${data.contact.whatsapp}`);
      return { lines };
    }

    case "cv":
      return {
        lines:
          data.cvLocales.length === 0
            ? [t("terminal.cvUnavailable")]
            : [t("terminal.cvAvailable", { locales: data.cvLocales.join(", ") })],
      };

    case "theme": {
      const value = args[0] ?? "toggle";
      if (value !== "dark" && value !== "light" && value !== "toggle") {
        return { lines: [t("terminal.themeUsage")] };
      }
      return { lines: [], action: { type: "theme", value } };
    }

    case "lang": {
      const locale = args[0] ?? context.locale;
      if (!isLocale(locale)) return { lines: [t("terminal.langUsage")] };
      return { lines: [], action: { type: "lang", locale } };
    }

    case "open": {
      const target = args[0];
      if (!target) return { lines: [t("terminal.openUsage")] };
      if (isAppId(target)) return { lines: [], action: { type: "open-app", appId: target } };
      if (data.projects.some((project) => project.slug === target)) {
        return { lines: [], action: { type: "open-project", slug: target } };
      }
      return unknown(`open ${target}`, context);
    }

    case "clear":
      return { lines: [], clear: true, action: { type: "clear" } };

    case "sudo":
      return { lines: [t("terminal.easter.sudo")] };

    case "matrix":
      return { lines: [t("terminal.easter.matrix")] };

    case "coffee":
      return { lines: [t("terminal.easter.coffee")] };

    default:
      return unknown(name, context);
  }
}
