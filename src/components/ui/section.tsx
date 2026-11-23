import type { ReactNode } from "react";

export function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-3 max-w-2xl text-muted">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
