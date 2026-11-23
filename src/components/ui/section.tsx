import type { ReactNode } from "react"

export function Section({
  id,
  title,
  subtitle,
  as = "h2",
  children,
}: {
  id: string
  title: string
  subtitle?: string
  as?: "h1" | "h2"
  children: ReactNode
}) {
  const Heading = as

  return (
    <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mb-10">
        <Heading className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</Heading>
        {subtitle ? <p className="mt-3 max-w-2xl text-pretty text-muted">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  )
}
