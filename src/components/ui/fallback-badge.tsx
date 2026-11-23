export function FallbackBadge({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <span
      lang="en"
      className="ms-2 rounded border border-line px-1 py-0.5 align-middle text-[10px] uppercase tracking-wide text-muted"
    >
      EN
    </span>
  );
}
