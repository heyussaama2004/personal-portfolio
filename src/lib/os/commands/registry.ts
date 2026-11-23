import type { WindowAppId } from "@/lib/os/window-manager/types"

export type CommandId =
  | "help"
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "contact"
  | "cv"
  | "theme"
  | "lang"
  | "open"
  | "clear"
  | "sudo"
  | "matrix"
  | "coffee"

export type CommandGroup = "navigation" | "apps" | "projects" | "actions" | "contact"

export type CommandDefinition = {
  id: CommandId
  usage: string
  keywords: string[]
  group: CommandGroup
  hidden?: boolean
  appId?: WindowAppId
}

export const COMMANDS: CommandDefinition[] = [
  { id: "help", usage: "help", keywords: ["help", "commands", "?"] },
  {
    id: "about",
    usage: "about",
    keywords: ["about", "bio", "whoami"],
    group: "navigation",
    appId: "about",
  },
  {
    id: "projects",
    usage: "projects",
    keywords: ["projects", "work", "portfolio"],
    group: "navigation",
    appId: "projects",
  },
  {
    id: "skills",
    usage: "skills",
    keywords: ["skills", "stack", "tech"],
    group: "navigation",
    appId: "skills",
  },
  {
    id: "experience",
    usage: "experience",
    keywords: ["experience", "education", "cv"],
    group: "navigation",
    appId: "about",
  },
  {
    id: "contact",
    usage: "contact",
    keywords: ["contact", "email", "hire"],
    group: "contact",
    appId: "contact",
  },
  { id: "cv", usage: "cv", keywords: ["cv", "resume", "download"], group: "contact" },
  {
    id: "theme",
    usage: "theme [dark|light|toggle]",
    keywords: ["theme", "dark", "light"],
    group: "actions",
  },
  {
    id: "lang",
    usage: "lang [en|fr|ar]",
    keywords: ["lang", "language", "locale"],
    group: "actions",
  },
  { id: "open", usage: "open [app|project]", keywords: ["open", "launch", "start"], group: "apps" },
  { id: "clear", usage: "clear", keywords: ["clear", "cls"], group: "actions" },
  { id: "sudo", usage: "sudo", keywords: ["sudo", "admin"], group: "actions", hidden: true },
  {
    id: "matrix",
    usage: "matrix",
    keywords: ["matrix", "redpill"],
    group: "actions",
    hidden: true,
  },
  { id: "coffee", usage: "coffee", keywords: ["coffee", "cafe"], group: "actions", hidden: true },
].map((command) => ({ group: "navigation", ...command })) as CommandDefinition[]

export function getVisibleCommands(): CommandDefinition[] {
  return COMMANDS.filter((command) => !command.hidden)
}

export function getCommand(id: string): CommandDefinition | undefined {
  return COMMANDS.find((command) => command.id === id)
}
