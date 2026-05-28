import type { CSSProperties } from "react";

export type PayoutHealthStatus =
  | "healthy"
  | "delayed"
  | "at_risk"
  | "failed"
  | "unknown";

export interface PayoutHealthChipProps {
  /** Health status; missing/unrecognised values render as "Unknown". */
  status?: PayoutHealthStatus | null;
  /** Optional label override; defaults to the humanised status. */
  label?: string;
  /** Compact summary chip ("sm") vs. slightly larger detail chip ("md"). */
  size?: "sm" | "md";
  className?: string;
}

const STATUS_META: Record<
  PayoutHealthStatus,
  { label: string; fg: string; bg: string; border: string; dot: string }
> = {
  healthy: { label: "Healthy", fg: "#047857", bg: "#ecfdf5", border: "#a7f3d0", dot: "#10b981" },
  delayed: { label: "Delayed", fg: "#b45309", bg: "#fffbeb", border: "#fde68a", dot: "#f59e0b" },
  at_risk: { label: "At risk", fg: "#c2410c", bg: "#fff7ed", border: "#fed7aa", dot: "#f97316" },
  failed: { label: "Failed", fg: "#b91c1c", bg: "#fef2f2", border: "#fecaca", dot: "#ef4444" },
  unknown: { label: "Unknown", fg: "#475569", bg: "#f8fafc", border: "#e2e8f0", dot: "#94a3b8" },
};

/**
 * Compact, color-coded chip summarising payout health. Designed to read the
 * same in a dense summary row ("sm") and in a detail panel ("md"); an absent or
 * unrecognised status degrades gracefully to a neutral "Unknown" chip.
 */
export function PayoutHealthChip({
  status,
  label,
  size = "sm",
  className = "",
}: PayoutHealthChipProps) {
  const resolved: PayoutHealthStatus =
    status && status in STATUS_META ? status : "unknown";
  const meta = STATUS_META[resolved];
  const text = label ?? meta.label;

  const chipStyle: CSSProperties = {
    ...styles.chip,
    ...(size === "md" ? styles.md : styles.sm),
    color: meta.fg,
    backgroundColor: meta.bg,
    borderColor: meta.border,
  };

  return (
    <span
      className={`payout-health-chip ${className}`}
      style={chipStyle}
      role="status"
      data-status={resolved}
      aria-label={`Payout health: ${text}`}
    >
      <span aria-hidden="true" style={{ ...styles.dot, backgroundColor: meta.dot }} />
      {text}
    </span>
  );
}

const styles = {
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    borderRadius: "9999px",
    border: "1px solid",
    fontWeight: 600,
    lineHeight: 1.2,
    whiteSpace: "nowrap" as const,
  },
  sm: { padding: "0.125rem 0.5rem", fontSize: "0.6875rem" },
  md: { padding: "0.25rem 0.75rem", fontSize: "0.8125rem" },
  dot: {
    width: "0.5rem",
    height: "0.5rem",
    borderRadius: "9999px",
    flexShrink: 0,
  },
} as const;
