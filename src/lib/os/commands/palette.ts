import { LOCALES, type Locale } from "@/i18n/routing";
import { COMMANDS, type CommandGroup } from "@/lib/os/commands/registry";
import type { TerminalAction } from "@/lib/os/terminal/types";
import type { OsData } from "@/lib/os/types";
import { APP_IDS } from "@/lib/os/window-manager/types";

export type PaletteItem = {
  id: string;
  label: string;
  group: CommandGroup;
  keywords: string[];
  action: TerminalAction;
};

export const COMMAND_GROUPS: CommandGroup[] = ["navigation", "apps", "projects", "actions", "contact"];

export function groupPaletteItems(items: PaletteItem[]): PaletteItem[] {
  return COMMAND_GROUPS.flatMap((group) => items.filter((item) => item.group === group));
}

export function buildPaletteItems(data: OsData, t: (key: string) => string): PaletteItem[] {
  const appItems: PaletteItem[] = APP_IDS.map((appId) => {
    const command = COMMANDS.find((entry) => entry.appId === appId);
    return {
      id: `app:${appId}`,
      label: t(`os.${appId}`),
      group: command?.group ?? "apps",
      keywords: command?.keywords ?? [appId],
      action: { type: "open-app", appId },
    };
  });

  const projectItems: PaletteItem[] = data.projects.map((project) => ({
    id: `project:${project.slug}`,
    label: project.title,
    group: "projects",
    keywords: [project.slug, project.category, ...project.tags, ...project.tech],
    action: { type: "open-project", slug: project.slug },
  }));

  const languageItems: PaletteItem[] = LOCALES.map((locale: Locale) => ({
    id: `action:lang:${locale}`,
    label: t(`languages.${locale}`),
    group: "actions",
    keywords: ["lang", "language", "locale", locale, t("terminal.commands.lang")],
    action: { type: "lang", locale },
  }));

  const contactItems: PaletteItem[] = [];
  if (data.contact.email) {
    contactItems.push({
      id: "contact:email",
      label: data.contact.email,
      group: "contact",
      keywords: ["email", "contact", "hire"],
      action: { type: "navigate", href: `mailto:${data.contact.email}` },
    });
  }
  if (data.contact.whatsapp) {
    contactItems.push({
      id: "contact:whatsapp",
      label: `WhatsApp: ${data.contact.whatsapp}`,
      group: "contact",
      keywords: ["whatsapp", "contact", "chat"],
      action: {
        type: "navigate",
        href: `https://wa.me/${data.contact.whatsapp.replace(/\D/g, "")}`,
      },
    });
  }

  const cvItems: PaletteItem[] =
    data.cvLocales.length === 0
      ? []
      : [
          {
            id: "action:cv",
            label: t("terminal.commands.cv"),
            group: "contact",
            keywords: ["cv", "resume", "download"],
            action: { type: "run", command: "cv" },
          },
        ];

  const socialItems: PaletteItem[] = data.presence.map((link, index) => ({
    id: `social:${index}`,
    label: link.label,
    group: "contact",
    keywords: ["social", "presence", "link", link.label],
    action: { type: "navigate", href: link.url },
  }));

  const actionItems: PaletteItem[] = [
    {
      id: "action:theme",
      label: t("terminal.commands.theme"),
      group: "actions",
      keywords: ["theme", "dark", "light", "toggle"],
      action: { type: "theme", value: "toggle" },
    },
    {
      id: "nav:home",
      label: t("os.home"),
      group: "navigation",
      keywords: ["home", "landing", "back"],
      action: { type: "navigate", href: "/" },
    },
  ];

  return [
    ...appItems,
    ...projectItems,
    ...languageItems,
    ...cvItems,
    ...contactItems,
    ...socialItems,
    ...actionItems,
  ];
}

function matchScore(value: string, query: string): number {
  const haystack = value.toLowerCase();
  if (haystack.startsWith(query)) return 0;
  if (haystack.includes(query)) return 1;

  let index = 0;
  for (const character of haystack) {
    if (character === query[index]) index += 1;
    if (index === query.length) return 2;
  }
  return Number.POSITIVE_INFINITY;
}

export function searchPalette(items: PaletteItem[], query: string): PaletteItem[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return items;

  return items
    .map((item) => ({
      item,
      score: Math.min(...[item.label, ...item.keywords].map((value) => matchScore(value, needle))),
    }))
    .filter((entry) => Number.isFinite(entry.score))
    .sort((a, b) => a.score - b.score || a.item.label.localeCompare(b.item.label))
    .map((entry) => entry.item);
}
