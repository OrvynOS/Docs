/**
 * The Orvyn mark: an orbit ring with a node travelling on it. The ring and core take the text
 * colour; the node is light blue (deeper blue on light grounds via --accent). `mono` draws the
 * node in the text colour too (e.g. ink on a light-blue block).
 */
export function LogoMark({ size = 24, title, mono }: { size?: number; title?: string; mono?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title} style={{ display: "block", flex: "none" }}>
      {/* The orbit: a thick ring, opened where the node passes. */}
      <path d="M50.5 21.5A21 21 0 1 1 38.4 12.0" stroke="currentColor" strokeWidth={7} strokeLinecap="round" fill="none" />
      <circle cx="32" cy="32" r="6.5" fill="currentColor" />
      <circle cx="47" cy="14.5" r="5.2" fill={mono ? "currentColor" : "var(--accent, #8bc8ff)"} />
    </svg>
  );
}

/** Mark plus wordmark. */
export function Logo({ size = 24 }: { size?: number }) {
  return (
    <span className="brand">
      <span className="brand-mark">
        <LogoMark size={size} />
      </span>
      <span className="brand-word">orvyn</span>
    </span>
  );
}
