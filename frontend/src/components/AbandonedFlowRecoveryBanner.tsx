import type { CSSProperties } from "react";

export interface StagedSubmission {
  /** Human label for the staged flow, e.g. "deposit" or "game entry". */
  label?: string;
  /** When the draft was last saved. */
  savedAt?: Date | string | number;
}

export interface AbandonedFlowRecoveryBannerProps {
  /** The staged submission to recover; when null/undefined nothing renders. */
  staged?: StagedSubmission | null;
  onResume: () => void;
  onDismiss: () => void;
  className?: string;
}

function formatSavedAt(savedAt?: Date | string | number): string | null {
  if (savedAt === undefined || savedAt === null) return null;
  const date = savedAt instanceof Date ? savedAt : new Date(savedAt);
  if (Number.isNaN(date.getTime())) return null;
  const diffMs = Date.now() - date.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/**
 * Banner that offers to resume a staged-but-unsubmitted flow. Renders nothing
 * when there is no staged submission, so callers can mount it unconditionally.
 */
export function AbandonedFlowRecoveryBanner({
  staged,
  onResume,
  onDismiss,
  className = "",
}: AbandonedFlowRecoveryBannerProps) {
  if (!staged) return null;

  const what = staged.label?.trim() ? staged.label.trim() : "submission";
  const when = formatSavedAt(staged.savedAt);

  return (
    <div
      className={`abandoned-flow-recovery ${className}`}
      style={styles.banner}
      role="region"
      aria-label="Recover unfinished submission"
    >
      <div style={styles.text}>
        <strong style={styles.title}>You have an unfinished {what}</strong>
        <span style={styles.subtitle}>
          {when ? `Saved ${when}.` : "Pick up where you left off."}
        </span>
      </div>
      <div style={styles.actions}>
        <button type="button" onClick={onResume} style={styles.resume}>
          Resume
        </button>
        <button
          type="button"
          onClick={onDismiss}
          style={styles.dismiss}
          aria-label="Dismiss recovery banner"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

const styles = {
  banner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap" as const,
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1px solid #fde68a",
    backgroundColor: "#fffbeb",
  } as CSSProperties,
  text: { display: "flex", flexDirection: "column" as const, gap: "0.125rem", minWidth: 0 },
  title: { fontSize: "0.875rem", color: "#92400e" },
  subtitle: { fontSize: "0.75rem", color: "#b45309" },
  actions: { display: "flex", gap: "0.5rem", flexShrink: 0 },
  resume: {
    padding: "0.375rem 0.875rem",
    borderRadius: "0.375rem",
    border: "none",
    backgroundColor: "#f59e0b",
    color: "#1c1917",
    fontWeight: 600,
    fontSize: "0.8125rem",
    cursor: "pointer",
  },
  dismiss: {
    padding: "0.375rem 0.875rem",
    borderRadius: "0.375rem",
    border: "1px solid #fcd34d",
    backgroundColor: "transparent",
    color: "#92400e",
    fontWeight: 600,
    fontSize: "0.8125rem",
    cursor: "pointer",
  },
} as const;
