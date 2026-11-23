"use client";

import { Maximize2, Minimize2, Minus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, type PointerEvent, type ReactNode } from "react";
import type { OsWindow } from "@/lib/os/window-manager/types";

export function DesktopWindow({
  window,
  active,
  children,
  onFocus,
  onMove,
  onMinimize,
  onToggleMaximize,
  onClose,
}: {
  window: OsWindow;
  active: boolean;
  children: ReactNode;
  onFocus: () => void;
  onMove: (bounds: { x: number; y: number }) => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onClose: () => void;
}) {
  const t = useTranslations("os");
  const drag = useRef<{ pointerX: number; pointerY: number; x: number; y: number } | null>(null);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (window.maximized || (event.target as HTMLElement).closest("button")) return;
    drag.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: window.x,
      y: window.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    onFocus();
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    onMove({
      x: drag.current.x + event.clientX - drag.current.pointerX,
      y: drag.current.y + event.clientY - drag.current.pointerY,
    });
  }

  function handlePointerUp() {
    drag.current = null;
  }

  const style = window.maximized
    ? { inset: 0, zIndex: window.z }
    : { left: window.x, top: window.y, width: window.width, height: window.height, zIndex: window.z };

  if (window.minimized) return null;

  return (
    <section
      aria-label={window.title}
      className={`absolute flex flex-col overflow-hidden rounded-xl border bg-background shadow-2xl ${
        active ? "border-primary/60" : "border-line"
      }`}
      style={style}
      onPointerDownCapture={onFocus}
    >
      <div
        className="flex h-10 shrink-0 cursor-grab items-center justify-between border-b border-line bg-surface px-3 active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span className="truncate text-sm font-medium">{window.title}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMinimize}
            aria-label={t("minimize")}
            title={t("minimize")}
            className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-raised"
          >
            <Minus aria-hidden="true" size={14} />
          </button>
          <button
            type="button"
            onClick={onToggleMaximize}
            aria-label={window.maximized ? t("restore") : t("maximize")}
            title={window.maximized ? t("restore") : t("maximize")}
            className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-raised"
          >
            {window.maximized ? <Minimize2 aria-hidden="true" size={14} /> : <Maximize2 aria-hidden="true" size={14} />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("closeWindow")}
            title={t("closeWindow")}
            className="inline-flex h-7 w-7 items-center justify-center rounded hover:bg-danger/20 hover:text-danger"
          >
            <X aria-hidden="true" size={14} />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
    </section>
  );
}
