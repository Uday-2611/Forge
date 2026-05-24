"use client";

import { useEffect } from "react";
import { PainPoint } from "@/lib/data";
import { Tag } from "./Tag";

type DetailModalProps = {
  p: PainPoint | null;
  onClose: () => void;
};

export function DetailModal({ p, onClose }: DetailModalProps) {
  useEffect(() => {
    if (!p) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [p, onClose]);

  if (!p) return null;
  const high = p.score >= 7;

  return (
    <div onClick={onClose} style={overlayStyle()}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--forge-bg)",
          border: "1px solid var(--forge-border)",
          width: "min(960px, calc(100vw - 48px))",
          maxHeight: "calc(100vh - 64px)",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* sticky header */}
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "var(--forge-bg)",
            borderBottom: "1px solid var(--forge-border)",
            zIndex: 2,
            padding: "20px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.04em",
                color: "var(--forge-muted)",
              }}
            >
              FORGE · IDEA #{String(p.id).padStart(4, "0")}
            </span>
            <Tag>{p.industry}</Tag>
            <Tag variant="ghost">{p.difficulty}</Tag>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid var(--forge-border)",
              color: "var(--forge-text)",
              padding: "6px 10px",
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            CLOSE · ESC
          </button>
        </div>

        <div style={{ padding: "40px 40px 28px" }}>
          <h1
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: 38,
              lineHeight: 1.18,
              margin: 0,
              color: "var(--forge-text)",
              letterSpacing: "-0.005em",
            }}
          >
            {p.title}
          </h1>
        </div>

        {/* score strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            borderTop: "1px solid var(--forge-border)",
            borderBottom: "1px solid var(--forge-border)",
          }}
        >
          <StatCell
            label="Pain Score"
            value={p.score.toFixed(1)}
            accent={high}
            large
          />
          <StatCell label="Build" value={p.difficulty} />
          <StatCell label="Industry" value={p.industry} />
          <StatCell
            label="Builders"
            value={String(p.builders)}
            suffix="active"
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
          }}
        >
          {/* left column */}
          <div
            style={{
              padding: "36px 40px",
              borderRight: "1px solid var(--forge-border)",
            }}
          >
            <Section label="The Problem">
              <p style={proseStyle()}>{p.title}</p>
            </Section>
            <Section label="Target User">
              <p style={proseStyle()}>{p.target}</p>
            </Section>
            <Section label="Suggested Solution">
              <p style={proseStyle()}>{p.solution}</p>
            </Section>
            <Section label="Source Posts">
              <div style={{ display: "flex", flexDirection: "column" }}>
                {p.sourceDetail.map((s, i) => (
                  <a
                    key={i}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 18,
                      padding: "14px 0",
                      borderBottom: "1px solid var(--forge-border)",
                      textDecoration: "none",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-ibm-plex-mono), monospace",
                          fontSize: 10,
                          letterSpacing: "0.16em",
                          color: "var(--forge-accent)",
                          textTransform: "uppercase",
                        }}
                      >
                        {s.sub}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-playfair), serif",
                          fontStyle: "italic",
                          fontSize: 16,
                          color: "var(--forge-text)",
                          lineHeight: 1.35,
                        }}
                      >
                        &ldquo;{s.title}&rdquo;
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-ibm-plex-mono), monospace",
                        fontSize: 11,
                        color: "var(--forge-muted)",
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {s.upvotes != null
                        ? `↑ ${s.upvotes.toLocaleString()}`
                        : "—"}
                    </span>
                  </a>
                ))}
              </div>
            </Section>
          </div>

          {/* right column */}
          <div
            style={{
              padding: "36px 40px",
              background: "var(--forge-surface-dim)",
            }}
          >
            <Section label="Keywords">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {p.keywords.map((k) => (
                  <Tag key={k} variant="ghost">
                    {k}
                  </Tag>
                ))}
              </div>
            </Section>
            <Section label="Signal Composition">
              <SignalBars />
            </Section>
            <Section label="Submitted">
              <p style={{ ...proseStyle(), fontSize: 13 }}>
                Detected 04.18.26 · last surfaced 7 hours ago · velocity{" "}
                <span style={{ color: "var(--forge-accent)" }}>↑ 18%</span> week
                over week.
              </p>
            </Section>
          </div>
        </div>

        {/* sticky CTA bar */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "var(--forge-bg)",
            borderTop: "1px solid var(--forge-border)",
            padding: "18px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "var(--forge-muted)",
            }}
          >
            <span style={{ color: "var(--forge-accent)" }}>●</span>
            &nbsp;&nbsp;{p.builders} founders are building toward this
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={outlinedBtnStyle()}>Save</button>
            <button style={primaryBtnStyle()}>I&apos;m building this →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 30 }}>
      <div
        style={{
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          color: "var(--forge-dim)",
          textTransform: "uppercase",
          marginBottom: 14,
          paddingBottom: 8,
          borderBottom: "1px solid var(--forge-border)",
        }}
      >
        {label}
      </div>
      {children}
    </section>
  );
}

function StatCell({
  label,
  value,
  suffix,
  accent,
  large,
}: {
  label: string;
  value: string;
  suffix?: string;
  accent?: boolean;
  large?: boolean;
}) {
  return (
    <div
      style={{
        padding: "22px 28px",
        borderRight: "1px solid var(--forge-border)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.2em",
          color: "var(--forge-dim)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span
          style={{
            fontFamily: "var(--font-ibm-plex-mono), monospace",
            fontVariantNumeric: "tabular-nums",
            fontSize: large ? 42 : 20,
            color: accent ? "var(--forge-accent)" : "var(--forge-text)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </span>
        {suffix && (
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "var(--forge-muted)",
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function SignalBars() {
  const segments = [
    { label: "Reddit", value: 58, color: "var(--forge-accent)" },
    { label: "Hacker News", value: 24, color: "#666" },
    { label: "User Submitted", value: 12, color: "#444" },
    { label: "Twitter", value: 6, color: "#333" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", height: 6, gap: 2 }}>
        {segments.map((s) => (
          <div
            key={s.label}
            style={{ background: s.color, width: `${s.value}%` }}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {segments.map((s) => (
          <div
            key={s.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              fontSize: 11,
              color: "var(--forge-muted)",
            }}
          >
            <span>
              <span style={{ color: s.color, marginRight: 8 }}>▪</span>
              {s.label}
            </span>
            <span
              style={{
                color: "var(--forge-text)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function proseStyle(): React.CSSProperties {
  return {
    fontFamily: "var(--font-ibm-plex-mono), monospace",
    fontSize: 14,
    lineHeight: 1.7,
    color: "var(--forge-text-dim)",
    margin: 0,
  };
}

function outlinedBtnStyle(): React.CSSProperties {
  return {
    background: "transparent",
    border: "1px solid var(--forge-accent)",
    color: "var(--forge-accent)",
    padding: "8px 14px",
    fontFamily: "var(--font-ibm-plex-mono), monospace",
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.15s",
  };
}

function primaryBtnStyle(): React.CSSProperties {
  return {
    background: "var(--forge-accent)",
    border: "none",
    color: "var(--forge-accent-fg)",
    padding: "10px 18px",
    fontFamily: "var(--font-ibm-plex-mono), monospace",
    fontSize: 12,
    letterSpacing: "0.16em",
    fontWeight: 500,
    textTransform: "uppercase",
    cursor: "pointer",
  };
}

function overlayStyle(): React.CSSProperties {
  return {
    position: "fixed",
    inset: 0,
    background: "rgba(5,5,5,0.78)",
    backdropFilter: "blur(4px)",
    zIndex: 100,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "32px 0",
    overflowY: "auto",
  };
}
