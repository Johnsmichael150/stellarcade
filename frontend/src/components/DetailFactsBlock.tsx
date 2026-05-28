import type { CSSProperties, ReactNode } from "react";

export interface DetailFact {
  /** Term shown in the first column. */
  label: string;
  /** Value shown in the second column. */
  value: ReactNode;
  /** Let a long value span both columns. */
  full?: boolean;
}

export interface DetailFactsBlockProps {
  facts: DetailFact[];
  /** Message rendered when there are no facts to show. */
  emptyLabel?: string;
  /** Accessible label for the underlying definition list. */
  ariaLabel?: string;
  className?: string;
}

/**
 * Shared two-column label/value block for dense side panels. Renders a semantic
 * <dl> so each fact is a proper term/description pair, and explicitly handles
 * the empty case rather than collapsing to nothing.
 */
export function DetailFactsBlock({
  facts,
  emptyLabel = "No details available",
  ariaLabel = "Details",
  className = "",
}: DetailFactsBlockProps) {
  if (facts.length === 0) {
    return (
      <p className={`detail-facts-empty ${className}`} style={styles.empty} role="note">
        {emptyLabel}
      </p>
    );
  }

  return (
    <dl className={`detail-facts ${className}`} style={styles.list} aria-label={ariaLabel}>
      {facts.map((fact, index) => (
        <div
          key={`${fact.label}-${index}`}
          style={{ ...styles.row, ...(fact.full ? styles.rowFull : null) }}
        >
          <dt style={styles.term}>{fact.label}</dt>
          <dd style={styles.value}>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

const styles = {
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "0.5rem 1rem",
    margin: 0,
  } as CSSProperties,
  row: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.125rem",
    minWidth: 0,
  },
  rowFull: { gridColumn: "1 / -1" },
  term: {
    fontSize: "0.6875rem",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    color: "#64748b",
  },
  value: {
    margin: 0,
    fontSize: "0.875rem",
    color: "#1e293b",
    wordBreak: "break-word" as const,
  },
  empty: {
    margin: 0,
    fontSize: "0.8125rem",
    color: "#94a3b8",
    fontStyle: "italic" as const,
  },
} as const;
