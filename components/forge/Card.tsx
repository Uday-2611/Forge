"use client";

import { useState } from "react";
import { PainPoint } from "@/lib/data";
import { Tag } from "./Tag";

type CardProps = {
  p: PainPoint;
  onOpen: (p: PainPoint) => void;
};

export function Card({ p, onOpen }: CardProps) {
  const [hover, setHover] = useState(false);
  const high = p.score >= 7;

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(p)}
      style={{
        background: "var(--forge-surface)",
        border: `1px solid ${hover ? "var(--forge-accent)" : "var(--forge-border)"}`,
        padding: "26px 28px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        cursor: "pointer",
        transition: "border-color 0.15s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Tag>{p.industry}</Tag>
          <Tag variant="ghost">{p.difficulty}</Tag>
        </div>
        <div
          style={{
            fontFamily: "var(--font-ibm-plex-mono), monospace",
            fontVariantNumeric: "tabular-nums",
            fontSize: 34,
            lineHeight: 1,
            fontWeight: 500,
            color: high ? "var(--forge-accent)" : "var(--forge-text)",
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}
        >
          {p.score.toFixed(1)}
        </div>
      </div>

      <p
        style={{
          fontFamily: "var(--font-playfair), serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 19,
          lineHeight: 1.38,
          color: "var(--forge-text)",
          margin: 0,
        }}
      >
        {p.title}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginTop: "auto",
          paddingTop: 6,
          borderTop: "1px dashed var(--forge-border)",
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
          {p.source}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.04em",
              color: "var(--forge-muted)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <BuildersGlyph />
            {p.builders} building
          </span>
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.04em",
              color: hover ? "var(--forge-accent)" : "var(--forge-text)",
              textTransform: "uppercase",
              transition: "color 0.15s",
            }}
          >
            Expand idea →
          </span>
        </div>
      </div>
    </article>
  );
}

function BuildersGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
      <circle
        cx="4"
        cy="4"
        r="1.6"
        stroke="var(--forge-muted)"
        strokeWidth="1"
      />
      <path
        d="M1 11C1 8.8 2.3 7.5 4 7.5C5.7 7.5 7 8.8 7 11"
        stroke="var(--forge-muted)"
        strokeWidth="1"
      />
      <circle
        cx="9"
        cy="3.5"
        r="1.3"
        stroke="var(--forge-muted)"
        strokeWidth="1"
      />
      <path
        d="M7.5 7C8 6.6 8.5 6.4 9 6.4C10.4 6.4 11 7.6 11 9"
        stroke="var(--forge-muted)"
        strokeWidth="1"
      />
    </svg>
  );
}
