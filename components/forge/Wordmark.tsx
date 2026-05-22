"use client";

export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-playfair), serif",
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: size,
        letterSpacing: "-0.01em",
        color: "var(--forge-text)",
      }}
    >
      Forge<span style={{ color: "var(--forge-accent)" }}>.</span>
    </span>
  );
}
