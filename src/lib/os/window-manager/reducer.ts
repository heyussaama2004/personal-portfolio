import { z } from "zod";
import { APP_IDS, type WindowAction, type WindowAppId, type WindowState } from "./types";

const boundsSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
});

const windowSchema = boundsSchema.extend({
  id: z.string().min(1),
  appId: z.enum(APP_IDS),
  title: z.string(),
  z: z.number().int().positive(),
  minimized: z.boolean(),
  maximized: z.boolean(),
  previousBounds: boundsSchema.optional(),
});

const stateSchema = z.object({
  windows: z.array(windowSchema),
  nextZ: z.number().int().positive(),
  activeId: z.string().nullable(),
});

const baseBounds = { x: 80, y: 56, width: 640, height: 420 };

export function createInitialState(): WindowState {
  return { windows: [], nextZ: 1, activeId: null };
}

function topVisibleId(windows: WindowState["windows"]): string | null {
  const visible = windows.filter((window) => !window.minimized);
  if (visible.length === 0) return null;
  return visible.reduce((top, window) => (window.z > top.z ? window : top)).id;
}

function focusWindow(state: WindowState, id: string): WindowState {
  const target = state.windows.find((window) => window.id === id);
  if (!target) return state;

  const z = state.nextZ;
  return {
    nextZ: z + 1,
    activeId: id,
    windows: state.windows.map((window) =>
      window.id === id ? { ...window, z, minimized: false } : window,
    ),
  };
}

export function windowReducer(state: WindowState, action: WindowAction): WindowState {
  switch (action.type) {
    case "OPEN": {
      if (state.windows.some((window) => window.id === action.id)) {
        return focusWindow(state, action.id);
      }

      const offset = state.windows.length % 5;
      const z = state.nextZ;
      const window = {
        ...baseBounds,
        x: baseBounds.x + offset * 24,
        y: baseBounds.y + offset * 20,
        id: action.id,
        appId: action.appId,
        title: action.title,
        z,
        minimized: false,
        maximized: false,
      };

      return { windows: [...state.windows, window], nextZ: z + 1, activeId: action.id };
    }

    case "FOCUS":
      return focusWindow(state, action.id);

    case "MINIMIZE": {
      const windows = state.windows.map((window) =>
        window.id === action.id ? { ...window, minimized: true } : window,
      );
      return {
        ...state,
        windows,
        activeId: state.activeId === action.id ? topVisibleId(windows) : state.activeId,
      };
    }

    case "CLOSE": {
      const windows = state.windows.filter((window) => window.id !== action.id);
      return {
        ...state,
        windows,
        activeId: state.activeId === action.id ? topVisibleId(windows) : state.activeId,
      };
    }

    case "TOGGLE_MAXIMIZE":
      return {
        ...state,
        windows: state.windows.map((window) => {
          if (window.id !== action.id) return window;
          if (window.maximized) {
            const { previousBounds } = window;
            return {
              ...window,
              ...previousBounds,
              maximized: false,
              previousBounds: undefined,
            };
          }
          return {
            ...window,
            maximized: true,
            previousBounds: {
              x: window.x,
              y: window.y,
              width: window.width,
              height: window.height,
            },
          };
        }),
      };

    case "RESET":
      return createInitialState();

    case "MOVE":
    case "RESIZE":
      return {
        ...state,
        windows: state.windows.map((window) =>
          window.id === action.id ? { ...window, ...action } : window,
        ),
      };

    default:
      return state;
  }
}

export function hydrateWindowState(raw: unknown): WindowState {
  const parsed = stateSchema.safeParse(raw);
  if (!parsed.success) return createInitialState();

  const activeId = parsed.data.windows.some(
    (window) => window.id === parsed.data.activeId && !window.minimized,
  )
    ? parsed.data.activeId
    : null;

  return { ...parsed.data, activeId };
}

export function isAppId(value: string): value is WindowAppId {
  return (APP_IDS as readonly string[]).includes(value);
}
