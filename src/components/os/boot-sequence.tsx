"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export function BootSequence({ onSkip }: { onSkip: () => void }) {
  const t = useTranslations("os")
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStep(1), 500),
      window.setTimeout(() => setStep(2), 1200),
    ]
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const steps = [t("boot"), t("kernel"), t("apps")]

  return (
    <section
      aria-label={t("boot")}
      className="flex min-h-[70vh] flex-col items-center justify-center rounded-2xl border border-line bg-surface p-8 text-center"
    >
      <div className="boot-pulse flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-background">
        OL
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">{t("boot")}</h1>
      <ol className="mt-6 space-y-2 text-sm text-muted">
        {steps.map((label, index) => (
          <li key={label} aria-current={index === step ? "step" : undefined}>
            <span className={index <= step ? "text-primary" : "text-muted"}>
              {index < step ? "✓" : index === step ? "▸" : "·"}
            </span>
            <span className="ms-2">{label}</span>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={onSkip}
        className="mt-8 rounded-lg border border-line px-4 py-2 text-sm transition-colors hover:text-primary"
      >
        {t("skip")}
      </button>
    </section>
  )
}
