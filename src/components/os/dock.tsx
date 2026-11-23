"use client"

import { Code2, Contact, Grid2X2, Settings, Share2, Terminal, User } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { WindowAppId } from "@/lib/os/window-manager/types"

const icons: Record<WindowAppId, LucideIcon> = {
  projects: Grid2X2,
  skills: Code2,
  about: User,
  terminal: Terminal,
  presence: Share2,
  contact: Contact,
  settings: Settings,
}

export function Dock({
  apps,
  openIds,
  onOpenApp,
}: {
  apps: { id: WindowAppId; label: string }[]
  openIds: string[]
  onOpenApp: (id: WindowAppId) => void
}) {
  return (
    <nav
      aria-label="Dock"
      className="glass pointer-events-auto absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-2xl p-2"
    >
      {apps.map((app) => {
        const Icon = icons[app.id]
        const open = openIds.includes(app.id)
        return (
          <button
            key={app.id}
            type="button"
            onClick={() => onOpenApp(app.id)}
            aria-label={app.label}
            title={app.label}
            className={`relative flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
              open
                ? "border-primary bg-primary/15 text-primary"
                : "border-line bg-surface hover:text-primary"
            }`}
          >
            <Icon aria-hidden="true" size={18} />
            {open ? (
              <span
                aria-hidden="true"
                className="absolute -bottom-1 h-1 w-1 rounded-full bg-primary"
              />
            ) : null}
          </button>
        )
      })}
    </nav>
  )
}

export function MobileLauncher({
  apps,
  onOpenApp,
}: {
  apps: { id: WindowAppId; label: string }[]
  onOpenApp: (id: WindowAppId) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {apps.map((app) => {
        const Icon = icons[app.id]
        return (
          <button
            key={app.id}
            type="button"
            onClick={() => onOpenApp(app.id)}
            className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-line bg-surface p-4 text-sm transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Icon aria-hidden="true" size={22} />
            {app.label}
          </button>
        )
      })}
    </div>
  )
}
