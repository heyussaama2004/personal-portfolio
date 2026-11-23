"use client";

import { CornerDownLeft, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  buildPaletteItems,
  COMMAND_GROUPS,
  groupPaletteItems,
  searchPalette,
  type PaletteItem,
} from "@/lib/os/commands/palette";
import type { TerminalAction } from "@/lib/os/terminal/types";
import type { OsData } from "@/lib/os/types";

function optionId(item: PaletteItem) {
  return `palette-option-${item.id.replace(/[^a-z0-9]/gi, "-")}`;
}

export function CommandPalette({
  data,
  onClose,
  onAction,
}: {
  data: OsData;
  onClose: () => void;
  onAction: (action: TerminalAction) => void;
}) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo(
    () => buildPaletteItems(data, (key) => t(key)),
    [data, t],
  );
  const displayed = useMemo(
    () => groupPaletteItems(searchPalette(items, query)),
    [items, query],
  );
  const active = displayed[activeIndex];

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    return () => previous?.focus();
  }, []);

  function select(item: PaletteItem) {
    onAction(item.action);
    onClose();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (displayed.length === 0 ? 0 : (index + 1) % displayed.length));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        displayed.length === 0 ? 0 : (index - 1 + displayed.length) % displayed.length,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (active) select(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  }

  function trapFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const focusable = rootRef.current?.querySelectorAll<HTMLElement>(
      'input, button:not([tabindex="-1"]), [href]',
    );
    if (!focusable || focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-[12vh]">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <div
        ref={rootRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("palette.placeholder")}
        onKeyDown={trapFocus}
        className="relative w-full max-w-xl overflow-hidden rounded-xl border border-line bg-overlay shadow-2xl"
      >
        <label className="flex items-center gap-3 border-b border-line px-4">
          <Search aria-hidden="true" size={18} className="text-muted" />
          <span className="sr-only">{t("palette.placeholder")}</span>
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-listbox"
            aria-activedescendant={active ? optionId(active) : undefined}
            aria-autocomplete="list"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t("palette.placeholder")}
            className="h-14 w-full bg-transparent text-sm outline-none"
          />
        </label>

        <ul id="palette-listbox" role="listbox" className="max-h-[50vh] overflow-auto p-2">
          {displayed.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-muted">{t("palette.empty")}</li>
          ) : (
            COMMAND_GROUPS.flatMap((group) => {
              const groupItems = displayed.filter((item) => item.group === group);
              if (groupItems.length === 0) return [];
              return [
                <li
                  key={`group-${group}`}
                  role="presentation"
                  className="px-3 pb-1 pt-3 text-xs uppercase tracking-wide text-muted"
                >
                  {t(`palette.${group}`)}
                </li>,
                ...groupItems.map((item) => {
                  const index = displayed.indexOf(item);
                  return (
                    <li key={item.id} role="presentation">
                      <button
                        type="button"
                        id={optionId(item)}
                        role="option"
                        aria-selected={index === activeIndex}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => select(item)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm ${
                          index === activeIndex ? "bg-primary/15 text-primary" : "text-foreground"
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {index === activeIndex ? (
                          <CornerDownLeft aria-hidden="true" size={14} className="ms-auto" />
                        ) : null}
                      </button>
                    </li>
                  );
                }),
              ];
            })
          )}
        </ul>
        <p className="border-t border-line px-4 py-2 text-xs text-muted">{t("palette.hint")}</p>
      </div>
    </div>
  );
}
