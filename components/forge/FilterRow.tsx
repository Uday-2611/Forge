"use client";

import { useState } from "react";
import { INDUSTRIES, DIFFICULTIES, SORTS } from "@/lib/data";

type FilterRowProps = {
  industry: string;
  setIndustry: (v: string) => void;
  difficulty: string;
  setDifficulty: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  total: number;
};

export function FilterRow({
  industry,
  setIndustry,
  difficulty,
  setDifficulty,
  sort,
  setSort,
  total,
}: FilterRowProps) {
  return (
    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "28px 32px 20px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          flex: 1,
          minWidth: 0,
        }}
      >
        <FilterGroup label="Industry">
          {INDUSTRIES.map((t) => (
            <Pill key={t} active={industry === t} onClick={() => setIndustry(t)}>
              {t}
            </Pill>
          ))}
        </FilterGroup>
        <FilterGroup label="Build Difficulty">
          {DIFFICULTIES.map((t) => (
            <Pill
              key={t}
              active={difficulty === t}
              onClick={() => setDifficulty(t)}
            >
              {t}
            </Pill>
          ))}
        </FilterGroup>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          alignItems: "flex-end",
        }}
      >
        <FilterGroup label="Sort" align="right">
          {SORTS.map((t) => (
            <Pill key={t} active={sort === t} onClick={() => setSort(t)}>
              {t}
            </Pill>
          ))}
        </FilterGroup>
        <div
          style={{
            fontFamily: "var(--font-ibm-plex-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.04em",
            color: "var(--forge-muted)",
          }}
        >
          Showing{" "}
          <span style={{ color: "var(--forge-text)" }}>
            {String(total).padStart(3, "0")}
          </span>{" "}
          of <span style={{ color: "var(--forge-text)" }}>1,284</span> pain
          points
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  children,
  align = "left",
}: {
  label: string;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-ibm-plex-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--forge-dim)",
          minWidth: 110,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: active ? "var(--forge-accent)" : "transparent",
        color: active
          ? "#0a0a0a"
          : hover
          ? "var(--forge-text)"
          : "var(--forge-muted)",
        border: `1px solid ${
          active
            ? "var(--forge-accent)"
            : hover
            ? "var(--forge-border-hover)"
            : "var(--forge-border)"
        }`,
        padding: "5px 11px",
        fontFamily: "var(--font-ibm-plex-mono), monospace",
        fontSize: 11,
        letterSpacing: "0.04em",
        cursor: "pointer",
        transition: "all 0.12s ease",
        textTransform: "uppercase",
      }}
    >
      {children}
    </button>
  );
}
