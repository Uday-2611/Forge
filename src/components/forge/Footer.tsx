"use client";

import { Wordmark } from "./Wordmark";

const LINKS = ["Manifesto", "Changelog", "API", "Discord"];

export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--forge-border)",
        padding: "32px 32px 48px",
        maxWidth: 1280,
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Wordmark size={18} />
        <span
          style={{
            fontFamily: "var(--font-ibm-plex-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.04em",
            color: "var(--forge-muted)",
          }}
        >
          v0.4 · indexed 48.2k threads this week
        </span>
      </div>
      <div style={{ display: "flex", gap: 22 }}>
        {LINKS.map((l) => (
          <FooterLink key={l} label={l} />
        ))}
      </div>
    </footer>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      style={{
        fontFamily: "var(--font-ibm-plex-mono), monospace",
        fontSize: 11,
        letterSpacing: "0.04em",
        color: "var(--forge-muted)",
        textDecoration: "none",
        transition: "color 0.15s",
      }}
      onMouseEnter={(e) =>
        ((e.target as HTMLElement).style.color = "var(--forge-accent)")
      }
      onMouseLeave={(e) =>
        ((e.target as HTMLElement).style.color = "var(--forge-muted)")
      }
    >
      {label}
    </a>
  );
}
