"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import type { OsData } from "@/lib/os/types"

const DeveloperOS = dynamic(
  () => import("@/components/os/developer-os").then((module) => module.DeveloperOS),
  {
    ssr: false,
    loading: () => <OsLoading />,
  },
)

function OsLoading() {
  const t = useTranslations("os")
  return (
    <div className="flex min-h-[70vh] items-center justify-center rounded-2xl border border-line bg-surface text-sm text-muted">
      {t("boot")}
    </div>
  )
}

export function OsLoader({ data }: { data: OsData }) {
  return <DeveloperOS data={data} />
}
