"use client";

export function HeroStrip() {
  return (
    <div style={{ borderBottom: "1px solid var(--forge-border)" }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "44px 32px 36px",
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr",
          gap: 64,
          alignItems: "end",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 56,
            lineHeight: 1.05,
            margin: 0,
            color: "var(--forge-text)",
            letterSpacing: "-0.015em",
          }}
        >
          Problems worth building
          <br />
          <span style={{ color: "var(--forge-muted)" }}>— sourced from</span>{" "}
          <span style={{ color: "var(--forge-accent)", fontStyle: "italic" }}>
            the open internet.
          </span>
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            borderLeft: "1px solid var(--forge-border)",
          }}
        >
          <StatCell label="Pain points indexed" value="1,284" />
          <StatCell label="High-pain (≥ 7.0)" value="312" accent />
          <StatCell label="Reddit threads scraped" value="48.2k" />
          <StatCell label="Founders building" value="2,847" />
        </div>
      </div>
    </div>
  );
}

function StatCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        padding: "16px 22px",
        borderRight: "1px solid var(--forge-border)",
        borderTop: "1px solid var(--forge-border)",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          fontSize: 9,
          letterSpacing: "0.2em",
          color: "var(--forge-dim)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          fontVariantNumeric: "tabular-nums",
          fontSize: 26,
          color: accent ? "var(--forge-accent)" : "var(--forge-text)",
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
    </div>
  );
}
