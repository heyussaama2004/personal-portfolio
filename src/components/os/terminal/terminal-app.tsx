"use client"

import { useTranslations } from "next-intl"
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react"
import { getVisibleCommands } from "@/lib/os/commands/registry"
import { runTerminalCommand } from "@/lib/os/terminal/parser"
import type { TerminalAction } from "@/lib/os/terminal/types"
import type { OsData } from "@/lib/os/types"

type Line = { id: number; kind: "welcome" | "input" | "output"; text: string }

let nextLineId = 0

export function TerminalApp({
  data,
  queuedCommand,
  onAction,
}: {
  data: OsData
  queuedCommand?: { command: string; nonce: number }
  onAction: (action: TerminalAction) => void
}) {
  const t = useTranslations()
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [lines, setLines] = useState<Line[]>(() => [
    { id: nextLineId++, kind: "welcome", text: t("terminal.welcome") },
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const submit = useCallback(
    (command: string) => {
      const trimmed = command.trim()
      if (!trimmed) return

      const result = runTerminalCommand(command, {
        data,
        locale: data.locale,
        t: (key, values) => t(key, values),
      })

      const inputLine: Line = { id: nextLineId++, kind: "input", text: command }
      const outputLines: Line[] = result.lines.map((text) => ({
        id: nextLineId++,
        kind: "output",
        text,
      }))

      setLines((current) =>
        result.clear ? [inputLine, ...outputLines] : [...current, inputLine, ...outputLines],
      )
      setHistory((current) => [...current, command])
      setHistoryIndex(-1)
      setInput("")

      if (result.action && result.action.type !== "clear") onAction(result.action)
    },
    [data, onAction, t],
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight })
  }, [lines])

  useEffect(() => {
    if (!queuedCommand) return
    const timer = window.setTimeout(() => submit(queuedCommand.command), 0)
    return () => window.clearTimeout(timer)
  }, [queuedCommand, submit])

  function appendOutput(text: string) {
    setLines((current) => [...current, { id: nextLineId++, kind: "output", text }])
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault()
      submit(input)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (history.length === 0) return
      const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(next)
      setInput(history[next] ?? "")
      return
    }

    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (historyIndex === -1) return
      const next = historyIndex + 1
      if (next >= history.length) {
        setHistoryIndex(-1)
        setInput("")
      } else {
        setHistoryIndex(next)
        setInput(history[next] ?? "")
      }
      return
    }

    if (event.key === "Tab") {
      event.preventDefault()
      const parts = input.split(/\s+/)
      const last = parts.pop() ?? ""
      const head = parts.length > 0 ? `${parts.join(" ")} ` : ""
      const candidates = [
        ...getVisibleCommands().map((command) => command.id),
        ...data.projects.map((project) => project.slug),
      ]
      const matches = candidates.filter((candidate) => candidate.startsWith(last.toLowerCase()))
      if (matches.length === 1) setInput(`${head}${matches[0]}`)
      else if (matches.length > 1) appendOutput(matches.join("  "))
    }
  }

  return (
    <div className="flex h-full min-h-64 flex-col gap-3 font-mono text-sm">
      <div
        ref={outputRef}
        aria-live="polite"
        aria-label={t("terminal.help")}
        className="min-h-0 flex-1 space-y-1 overflow-auto rounded-lg border border-line bg-raised p-3"
      >
        {lines.map((line) => (
          <p
            key={line.id}
            className={
              line.kind === "input"
                ? "text-primary"
                : line.kind === "welcome"
                  ? "text-secondary"
                  : "text-muted"
            }
          >
            {line.kind === "input" ? <span className="text-primary">$ </span> : null}
            {line.text}
          </p>
        ))}
      </div>
      <label className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3">
        <span aria-hidden="true" className="text-primary">
          $
        </span>
        <span className="sr-only">{t("terminal.welcome")}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="go"
          className="h-11 w-full bg-transparent font-mono text-sm outline-none"
        />
      </label>
    </div>
  )
}
