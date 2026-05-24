"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wordmark } from "./Wordmark";
import { authClient } from "@/lib/auth-client";
import { AvatarButton } from "./ProfileMenu";

type NavProps = {
  onSubmitOpen: () => void;
  onSearchToggle: () => void;
  searchOpen: boolean;
  query: string;
  setQuery: (q: string) => void;
  onProfileOpen: () => void;
  profileOpen: boolean;
};

export function Nav({
  onSubmitOpen,
  onSearchToggle,
  searchOpen,
  query,
  setQuery,
  onProfileOpen,
  profileOpen,
}: NavProps) {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "rgba(14,14,14,0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--forge-border)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Wordmark size={26} />
          <span
            style={{
              fontFamily: "var(--font-ibm-plex-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.18em",
              color: "var(--forge-dim)",
              textTransform: "uppercase",
              paddingLeft: 16,
              borderLeft: "1px solid var(--forge-border)",
            }}
          >
            Pain Point Discovery · Week 21
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {searchOpen ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--forge-surface)",
                border: "1px solid var(--forge-border)",
                padding: "8px 14px",
                width: 280,
              }}
            >
              <SearchGlyph color="var(--forge-accent)" />
              <input
                autoFocus
                placeholder="search 1,284 pain points"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--forge-text)",
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                  fontSize: 12,
                  width: "100%",
                }}
              />
              <button onClick={onSearchToggle} style={ghostIconBtnStyle()}>
                ×
              </button>
            </div>
          ) : (
            <button onClick={onSearchToggle} style={iconBtnStyle()}>
              <SearchGlyph />
            </button>
          )}
          {session && (
            <button onClick={onSubmitOpen} style={outlinedBtnStyle()}>
              <span style={{ color: "var(--forge-accent)", marginRight: 8 }}>
                +
              </span>
              Submit Pain Point
            </button>
          )}
          {session ? (
            <AvatarButton onClick={onProfileOpen} open={profileOpen} />
          ) : (
            <button onClick={() => router.push("/login")} style={ghostBtnStyle()}>Sign in</button>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchGlyph({ color = "var(--forge-text)" }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke={color} strokeWidth="1.2" />
      <path
        d="M11 11L14 14"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
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

function ghostBtnStyle(): React.CSSProperties {
  return {
    background: "transparent",
    border: "1px solid var(--forge-border)",
    color: "var(--forge-text)",
    padding: "8px 14px",
    fontFamily: "var(--font-ibm-plex-mono), monospace",
    fontSize: 11,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.15s",
  };
}

function iconBtnStyle(): React.CSSProperties {
  return {
    background: "transparent",
    border: "1px solid var(--forge-border)",
    color: "var(--forge-text)",
    padding: "9px 11px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    lineHeight: 0,
  };
}

function ghostIconBtnStyle(): React.CSSProperties {
  return {
    background: "transparent",
    border: "none",
    color: "var(--forge-muted)",
    cursor: "pointer",
    fontSize: 18,
    lineHeight: 1,
    padding: 0,
  };
}
