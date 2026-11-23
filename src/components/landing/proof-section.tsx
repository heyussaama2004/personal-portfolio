import { getTranslations } from "next-intl/server"
import { Section } from "@/components/ui/section"
import { hasProofEntries } from "@/lib/config/visibility"
import { getProof } from "@/lib/content/loaders"

export async function ProofSection() {
  const t = await getTranslations("sections")
  const proof = getProof()

  if (!hasProofEntries(proof)) return null

  return (
    <Section id="proof" title={t("proof")}>
      <div className="grid gap-4 sm:grid-cols-2">
        {proof.metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-line bg-surface p-6">
            <p className="text-2xl font-semibold text-primary">{metric.value}</p>
            <p className="mt-1 text-sm font-medium">{metric.label}</p>
            <p className="mt-2 text-xs text-muted">{metric.source}</p>
          </div>
        ))}
        {proof.testimonials.map((item) => (
          <blockquote
            key={`${item.name}-${item.company}`}
            className="rounded-xl border border-line bg-surface p-6 text-sm leading-relaxed"
          >
            <p>“{item.quote}”</p>
            <footer className="mt-3 text-xs text-muted">
              {item.name} — {item.role}, {item.company}
            </footer>
          </blockquote>
        ))}
        {proof.certifications.map((item) => (
          <div key={item.title} className="rounded-xl border border-line bg-surface p-6">
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-sm text-muted">
              {item.issuer} · {item.date}
            </p>
          </div>
        ))}
      </div>
    </Section>
  )
}
