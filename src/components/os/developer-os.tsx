"use client"

import { ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { usePathname, useRouter } from "@/i18n/navigation"
import { AppContent } from "@/components/apps/app-content"
import { BootSequence } from "@/components/os/boot-sequence"
import { CommandPalette } from "@/components/os/command-palette/command-palette"
import { setTheme } from "@/components/ui/theme-toggle"
import { DesktopWindow } from "@/components/os/desktop-window"
import { Dock, MobileLauncher } from "@/components/os/dock"
import { MenuBar } from "@/components/os/menu-bar"
import type { TerminalAction } from "@/lib/os/terminal/types"
import type { OsData } from "@/lib/os/types"
import {
  isAppId,
  createInitialState,
  hydrateWindowState,
  windowReducer,
} from "@/lib/os/window-manager/reducer"
import type { WindowAppId } from "@/lib/os/window-manager/types"
import { readJson, readString, removeString, writeJson, writeString } from "@/lib/os/storage"

const APP_IDS: WindowAppId[] = [
  "projects",
  "skills",
  "about",
  "terminal",
  "presence",
  "contact",
  "settings",
]

export function DeveloperOS({ data }: { data: OsData }) {
  const t = useTranslations("os")
  const router = useRouter()
  const pathname = usePathname()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [terminalCommand, setTerminalCommand] = useState<{ command: string; nonce: number }>()
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string>()
  const [booting, setBooting] = useState(() => {
    if (typeof window === "undefined") return true
    const booted = readString("session", "ol-os-booted") === "1"
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!booted && reduced) writeString("session", "ol-os-booted", "1")
    return !(booted || reduced)
  })
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches,
  )
  const [mobileApp, setMobileApp] = useState<WindowAppId | null>(null)
  const [state, dispatch] = useReducer(windowReducer, undefined, () =>
    hydrateWindowState(readJson("local", "ol-os-windows")),
  )

  const apps = useMemo(() => APP_IDS.map((id) => ({ id, label: t(id) })), [t])
  const labels = useMemo(
    () => Object.fromEntries(apps.map((app) => [app.id, app.label])) as Record<WindowAppId, string>,
    [apps],
  )

  const finishBoot = useCallback(() => {
    writeString("session", "ol-os-booted", "1")
    setBooting(false)
  }, [])

  const replayBoot = useCallback(() => {
    removeString("session", "ol-os-booted")
    setBooting(true)
  }, [])

  const resetWindows = useCallback(() => {
    removeString("local", "ol-os-windows")
    dispatch({ type: "RESET" })
  }, [])

  const openApp = useCallback(
    (id: WindowAppId) => {
      if (isMobile) {
        setMobileApp(id)
        window.history.pushState({ olApp: id }, "")
        return
      }
      dispatch({ type: "OPEN", id, appId: id, title: labels[id] })
    },
    [isMobile, labels],
  )

  const handleTerminalAction = useCallback(
    (action: TerminalAction) => {
      switch (action.type) {
        case "open-app":
          openApp(action.appId)
          break
        case "open-project":
          setSelectedProjectSlug(action.slug)
          openApp("projects")
          break
        case "run":
          setTerminalCommand((current) => ({
            command: action.command,
            nonce: (current?.nonce ?? 0) + 1,
          }))
          openApp("terminal")
          break
        case "navigate":
          router.push(action.href)
          break
        case "theme": {
          const current = document.documentElement.dataset.theme === "light" ? "light" : "dark"
          setTheme(
            action.value === "toggle" ? (current === "dark" ? "light" : "dark") : action.value,
          )
          break
        }
        case "lang":
          router.replace(pathname, { locale: action.locale })
          break
        case "clear":
          break
      }
    },
    [openApp, pathname, router],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    if (!booting) return
    const timer = window.setTimeout(finishBoot, 2200)
    return () => window.clearTimeout(timer)
  }, [booting, finishBoot])

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(media.matches)
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    writeJson("local", "ol-os-windows", state)
  }, [state])

  useEffect(() => {
    writeString("local", "ol-locale", data.locale)
  }, [data.locale])

  useEffect(() => {
    const onPopState = () => setMobileApp(null)
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const app = params.get("app")
    if (!app || !isAppId(app)) return
    const timer = window.setTimeout(() => openApp(app), 0)
    return () => window.clearTimeout(timer)
  }, [openApp])

  const closeMobileApp = useCallback(() => {
    if (window.history.state?.olApp) window.history.back()
    else setMobileApp(null)
  }, [])

  if (booting) return <BootSequence onSkip={finishBoot} />

  return (
    <div className="relative min-h-[70vh]">
      <MenuBar
        data={data}
        apps={apps}
        onOpenApp={openApp}
        onResetWindows={resetWindows}
        onOpenPalette={() => setPaletteOpen(true)}
      />

      {isMobile ? (
        mobileApp ? (
          <section
            aria-label={labels[mobileApp]}
            className="rounded-xl border border-line bg-background"
          >
            <div className="flex items-center gap-2 border-b border-line px-3 py-2">
              <button
                type="button"
                onClick={closeMobileApp}
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm text-muted hover:text-foreground"
              >
                <ArrowLeft aria-hidden="true" size={15} />
                {t("backToLauncher")}
              </button>
              <span className="ms-auto text-sm font-medium">{labels[mobileApp]}</span>
            </div>
            <div className="max-h-[65vh] overflow-auto p-4">
              <AppContent
                appId={mobileApp}
                data={data}
                onReplayBoot={replayBoot}
                onResetWindows={resetWindows}
                onTerminalAction={handleTerminalAction}
                terminalCommand={terminalCommand}
                selectedProjectSlug={selectedProjectSlug}
              />
            </div>
          </section>
        ) : (
          <MobileLauncher apps={apps} onOpenApp={openApp} />
        )
      ) : (
        <div className="os-wallpaper relative h-[70vh] overflow-hidden rounded-xl border border-line">
          {state.windows.length === 0 ? (
            <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-muted">
              {t("noWindows")}
            </p>
          ) : null}
          {state.windows.map((window) => (
            <DesktopWindow
              key={window.id}
              window={window}
              active={state.activeId === window.id}
              onFocus={() => dispatch({ type: "FOCUS", id: window.id })}
              onMove={(bounds) => dispatch({ type: "MOVE", id: window.id, ...bounds })}
              onMinimize={() => dispatch({ type: "MINIMIZE", id: window.id })}
              onToggleMaximize={() => dispatch({ type: "TOGGLE_MAXIMIZE", id: window.id })}
              onClose={() => dispatch({ type: "CLOSE", id: window.id })}
            >
              <AppContent
                appId={window.appId}
                data={data}
                onReplayBoot={replayBoot}
                onResetWindows={resetWindows}
                onTerminalAction={handleTerminalAction}
                terminalCommand={terminalCommand}
                selectedProjectSlug={selectedProjectSlug}
              />
            </DesktopWindow>
          ))}
          <Dock
            apps={apps}
            openIds={state.windows.map((window) => window.id)}
            onOpenApp={openApp}
          />
        </div>
      )}

      {paletteOpen ? (
        <CommandPalette
          data={data}
          onClose={() => setPaletteOpen(false)}
          onAction={handleTerminalAction}
        />
      ) : null}
    </div>
  )
}
