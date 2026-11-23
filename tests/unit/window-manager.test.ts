import { describe, expect, it } from "vitest"
import type { WindowAppId } from "@/lib/os/window-manager/types"
import {
  createInitialState,
  hydrateWindowState,
  windowReducer,
} from "@/lib/os/window-manager/reducer"

function open(state: ReturnType<typeof createInitialState>, appId: WindowAppId, id: string) {
  return windowReducer(state, { type: "OPEN", appId, id, title: appId })
}

describe("window manager reducer", () => {
  it("opens a window and focuses it", () => {
    const first = open(createInitialState(), "projects", "projects-1")
    expect(first.windows).toHaveLength(1)
    expect(first.activeId).toBe("projects-1")
    expect(first.windows[0]).toMatchObject({ appId: "projects", z: 1, minimized: false })
  })

  it("focuses an existing window instead of duplicating it", () => {
    let state = open(createInitialState(), "projects", "projects-1")
    state = open(state, "skills", "skills-1")
    state = open(state, "projects", "projects-1")

    expect(state.windows).toHaveLength(2)
    expect(state.activeId).toBe("projects-1")
    expect(state.windows.find((window) => window.id === "projects-1")?.z).toBe(3)
    expect(state.nextZ).toBe(4)
  })

  it("minimizes, restores, maximizes and closes windows", () => {
    let state = open(createInitialState(), "about", "about-1")
    state = windowReducer(state, { type: "MINIMIZE", id: "about-1" })
    expect(state.windows[0]?.minimized).toBe(true)
    expect(state.activeId).toBeNull()

    state = windowReducer(state, { type: "FOCUS", id: "about-1" })
    expect(state.windows[0]?.minimized).toBe(false)
    expect(state.activeId).toBe("about-1")

    const bounds = { x: 10, y: 20, width: 300, height: 200 }
    state = windowReducer(state, { type: "MOVE", id: "about-1", ...bounds })
    state = windowReducer(state, { type: "TOGGLE_MAXIMIZE", id: "about-1" })
    expect(state.windows[0]?.maximized).toBe(true)
    expect(state.windows[0]?.previousBounds).toEqual(bounds)

    state = windowReducer(state, { type: "TOGGLE_MAXIMIZE", id: "about-1" })
    expect(state.windows[0]).toMatchObject({ maximized: false, ...bounds })

    state = windowReducer(state, { type: "CLOSE", id: "about-1" })
    expect(state.windows).toEqual([])
    expect(state.activeId).toBeNull()
  })

  it("keeps z-order stable when the active window closes", () => {
    let state = open(createInitialState(), "projects", "projects-1")
    state = open(state, "skills", "skills-1")
    state = windowReducer(state, { type: "CLOSE", id: "skills-1" })

    expect(state.activeId).toBe("projects-1")
    expect(state.windows[0]?.z).toBe(1)
  })

  it("resets to the initial state", () => {
    let state = open(createInitialState(), "settings", "settings-1")
    state = open(state, "about", "about-1")
    expect(windowReducer(state, { type: "RESET" })).toEqual(createInitialState())
  })

  it("ignores malformed persisted state", () => {
    expect(hydrateWindowState(null)).toEqual(createInitialState())
    expect(hydrateWindowState({ windows: "nope" })).toEqual(createInitialState())
    expect(hydrateWindowState({ windows: [{ id: 4 }] })).toEqual(createInitialState())
  })

  it("restores valid persisted state", () => {
    const original = open(createInitialState(), "contact", "contact-1")
    expect(hydrateWindowState(JSON.parse(JSON.stringify(original)))).toEqual(original)
  })
})
