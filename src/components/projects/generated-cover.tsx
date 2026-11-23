import { Code2 } from "lucide-react";

export function GeneratedCover({ title, label }: { title: string; label?: string }) {
  const initials = title
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      role="img"
      aria-label={label ?? title}
      className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/25 via-secondary/15 to-transparent"
    >
      <span aria-hidden="true" className="absolute text-6xl font-bold text-foreground/5">
        {initials}
      </span>
      <Code2 aria-hidden="true" size={36} className="text-primary/70" />
    </div>
  );
}
