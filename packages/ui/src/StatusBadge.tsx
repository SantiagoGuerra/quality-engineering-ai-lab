export type StatusBadgeTone = 'neutral' | 'success' | 'warning' | 'danger';

export function StatusBadge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: StatusBadgeTone;
}) {
  return <span className={`tl-status-badge tl-status-badge--${tone}`}>{label}</span>;
}
