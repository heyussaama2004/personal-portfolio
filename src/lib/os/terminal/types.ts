import type { Locale } from "@/i18n/routing"
import type { WindowAppId } from "@/lib/os/window-manager/types"

export type TerminalAction =
  | { type: "open-app"; appId: WindowAppId }
  | { type: "open-project"; slug: string }
  | { type: "run"; command: string }
  | { type: "navigate"; href: string }
  | { type: "theme"; value: "dark" | "light" | "toggle" }
  | { type: "lang"; locale: Locale }
  | { type: "clear" }

export type TerminalResult = {
  lines: string[]
  action?: TerminalAction
  clear?: boolean
}

export type TerminalContext = {
  data: import("@/lib/os/types").OsData
  locale: Locale
  t: (key: string, values?: Record<string, string>) => string
}
