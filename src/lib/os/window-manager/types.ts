export const APP_IDS = [
  "projects",
  "skills",
  "about",
  "terminal",
  "presence",
  "contact",
  "settings",
] as const;

export type WindowAppId = (typeof APP_IDS)[number];

export type WindowBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OsWindow = WindowBounds & {
  id: string;
  appId: WindowAppId;
  title: string;
  z: number;
  minimized: boolean;
  maximized: boolean;
  previousBounds?: WindowBounds;
};

export type WindowState = {
  windows: OsWindow[];
  nextZ: number;
  activeId: string | null;
};

export type WindowAction =
  | { type: "OPEN"; id: string; appId: WindowAppId; title: string }
  | { type: "FOCUS"; id: string }
  | { type: "MINIMIZE"; id: string }
  | { type: "CLOSE"; id: string }
  | { type: "TOGGLE_MAXIMIZE"; id: string }
  | { type: "RESET" }
  | ({ type: "MOVE"; id: string } & Partial<WindowBounds>)
  | ({ type: "RESIZE"; id: string } & Partial<WindowBounds>);
