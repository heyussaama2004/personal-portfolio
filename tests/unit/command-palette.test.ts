import { describe, expect, it } from "vitest"
import {
  buildPaletteItems,
  COMMAND_GROUPS,
  groupPaletteItems,
  searchPalette,
} from "@/lib/os/commands/palette"
import type { OsData } from "@/lib/os/types"

const data: OsData = {
  locale: "en",
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
      tags: ["PHP", "Payroll"],
      tech: ["PHP", "MySQL"],
      featured: true,
    },
  ],
  skills: [],
  experience: [],
  presence: [],
  contact: { configured: false, formEnabled: false },
  cvLocales: [],
}

const t = (key: string) =>
  ({
    "os.projects": "Projects",
    "os.skills": "Skills",
    "os.about": "About",
    "os.contact": "Contact",
    "os.presence": "Presence",
    "os.settings": "Settings",
    "os.terminal": "Terminal",
    "os.home": "Home",
    "terminal.commands.theme": "Switch theme",
    "terminal.commands.lang": "Change language",
    "terminal.commands.cv": "Show available CVs",
    "languages.en": "English",
    "languages.fr": "Français",
    "languages.ar": "العربية",
  })[key] ?? key

describe("command palette", () => {
  it("builds grouped items from the shared command registry and content", () => {
    const items = buildPaletteItems(data, t)
    expect(items.map((item) => item.id)).toContain("app:projects")
    expect(items.map((item) => item.id)).toContain("project:hrnexus")
    expect(items.map((item) => item.id)).toContain("action:theme")
    expect(items.find((item) => item.id === "app:projects")?.action).toEqual({
      type: "open-app",
      appId: "projects",
    })
    expect(items.find((item) => item.id === "project:hrnexus")?.action).toEqual({
      type: "open-project",
      slug: "hrnexus",
    })
  })

  it("builds configured language, CV and social actions", () => {
    const configured: OsData = {
      ...data,
      presence: [{ label: "GitHub", url: "https://github.com/ussama" }],
      contact: { configured: true, formEnabled: false, email: "hello@example.com" },
      cvLocales: ["en"],
    }
    const items = buildPaletteItems(configured, t)

    expect(items.find((item) => item.id === "action:lang:fr")?.action).toEqual({
      type: "lang",
      locale: "fr",
    })
    expect(items.find((item) => item.id === "action:cv")?.action).toEqual({
      type: "run",
      command: "cv",
    })
    expect(items.find((item) => item.id === "social:0")?.action).toEqual({
      type: "navigate",
      href: "https://github.com/ussama",
    })
    expect(items.find((item) => item.id === "contact:email")?.action).toEqual({
      type: "navigate",
      href: "mailto:hello@example.com",
    })
  })

  it("orders items by group for keyboard navigation", () => {
    const items = buildPaletteItems(data, t)
    const ranks = groupPaletteItems(items).map((item) => COMMAND_GROUPS.indexOf(item.group))
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b))
  })

  it("returns fuzzy matches ordered by relevance", () => {
    const items = buildPaletteItems(data, t)
    expect(searchPalette(items, "hrn")[0]?.id).toBe("project:hrnexus")
    expect(searchPalette(items, "skl").map((item) => item.id)).toContain("app:skills")
    expect(searchPalette(items, "zzzz")).toEqual([])
  })
})
