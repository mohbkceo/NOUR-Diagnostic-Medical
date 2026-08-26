export function EmptyState({ title, hint }) {
  return (
    <div className="rounded-md border border-dashed border-line bg-white/50 px-6 py-10 text-center">
      <p className="font-medium text-ink">{title}</p>
      {hint ? <p className="mt-1 text-sm text-ink-soft">{hint}</p> : null}
    </div>
  )
}
