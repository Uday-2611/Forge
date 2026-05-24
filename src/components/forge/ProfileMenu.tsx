"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const A = "var(--forge-accent)";
const BG = "var(--forge-bg)";
const SURF = "var(--forge-surface)";
const B = "var(--forge-border)";
const T = "var(--forge-text)";
const MUT = "var(--forge-muted)";
const DIM = "var(--forge-dim)";
const MONO = "var(--font-ibm-plex-mono), monospace";
const PLAYFAIR = "var(--font-playfair), serif";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type ListKind = "bookmarks" | "submissions" | "building";

type Props = {
  open: boolean;
  onClose: () => void;
  onShowList: (kind: ListKind) => void;
};

export function ProfileMenu({ open, onClose, onShowList }: Props) {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    setTimeout(() => document.addEventListener("mousedown", onDown), 0);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !session) return null;

  const name = session.user.name ?? "User";
  const email = session.user.email ?? "";
  const initials = getInitials(name);

  const items = [
    { key: "bookmarks" as ListKind,    label: "My bookmarks",   sub: "saved for later",          glyph: "★" },
    { key: "submissions" as ListKind,  label: "My submissions", sub: "pain points I sent",        glyph: "✎" },
    { key: "building" as ListKind,     label: "I'm building",   sub: "actively shipping",         glyph: "▸" },
  ];

  const handleSignOut = async () => {
    onClose();
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, pointerEvents: "none" }}>
      <div
        ref={ref}
        style={{
          position: "absolute",
          top: 70,
          right: 32,
          width: 340,
          background: BG,
          border: `1px solid ${A}`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          pointerEvents: "auto",
          animation: "profilePop 180ms ease-out",
        }}
      >
        {/* identity header */}
        <div style={{
          padding: "22px 22px 20px",
          borderBottom: `1px solid ${B}`,
          display: "flex", alignItems: "center", gap: 14,
          background: "#121212",
        }}>
          <div style={{
            width: 44, height: 44, flexShrink: 0,
            background: A, color: "#0a0a0a",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: MONO, fontSize: 15, fontWeight: 600, letterSpacing: "0.02em",
          }}>
            {initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
            <span style={{
              fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 500,
              fontSize: 18, color: T, lineHeight: 1.1, letterSpacing: "-0.005em",
            }}>
              {name}
            </span>
            <span style={{
              fontFamily: MONO, fontSize: 11, color: MUT, letterSpacing: "0.02em",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {email}
            </span>
          </div>
        </div>

        {/* status strip */}
        <div style={{
          padding: "10px 22px",
          borderBottom: `1px solid ${B}`,
          display: "flex", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: DIM }}>
            ● signed in
          </span>
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: A }}>
            free
          </span>
        </div>

        {/* menu items */}
        <div style={{ padding: "8px 0" }}>
          {items.map((it) => (
            <MenuItem key={it.key} item={it} onClick={() => { onClose(); onShowList(it.key); }} />
          ))}
        </div>

        {/* logout */}
        <div style={{ borderTop: `1px solid ${B}`, padding: 8 }}>
          <LogoutButton onClick={handleSignOut} />
        </div>
      </div>
    </div>
  );
}

function MenuItem({ item, onClick }: { item: { glyph: string; label: string; sub: string }; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", textAlign: "left",
        padding: "12px 22px",
        background: hover ? "rgba(168,255,62,0.06)" : "transparent",
        border: "none",
        borderLeft: `2px solid ${hover ? A : "transparent"}`,
        cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        transition: "all 0.12s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{
          color: hover ? A : MUT, width: 14, textAlign: "center",
          fontFamily: MONO, fontSize: 13, transition: "color 0.12s",
        }}>
          {item.glyph}
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: MONO, fontSize: 12.5, color: T, letterSpacing: "0.02em" }}>
            {item.label}
          </span>
          <span style={{
            fontFamily: MONO, fontSize: 9.5, color: DIM,
            letterSpacing: "0.16em", textTransform: "uppercase",
          }}>
            {item.sub}
          </span>
        </div>
      </div>
      <span style={{ fontFamily: MONO, fontSize: 11, color: hover ? A : MUT, transition: "color 0.12s" }}>
        →
      </span>
    </button>
  );
}

function LogoutButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", textAlign: "left",
        padding: "12px 14px",
        background: hover ? "#1a0a0a" : "transparent",
        border: `1px solid ${hover ? "#3a1a1a" : "transparent"}`,
        color: hover ? "#ff6b6b" : MUT,
        fontFamily: MONO, fontSize: 11.5,
        letterSpacing: "0.16em", textTransform: "uppercase",
        cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        transition: "all 0.12s",
      }}
    >
      <span>↳ Log out</span>
      <span style={{ fontSize: 10, letterSpacing: "0.18em" }}>↗</span>
    </button>
  );
}

export function AvatarButton({ onClick, open }: { onClick: () => void; open: boolean }) {
  const { data: session } = authClient.useSession();
  const [hover, setHover] = useState(false);
  const active = hover || open;

  if (!session) return null;

  const initials = getInitials(session.user.name ?? "U");

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "5px 12px 5px 5px",
        background: "transparent",
        border: `1px solid ${active ? A : B}`,
        cursor: "pointer",
        transition: "border-color 0.15s",
      }}
    >
      <span style={{
        width: 26, height: 26,
        background: active ? A : "#222",
        color: active ? "#0a0a0a" : T,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: MONO, fontSize: 11, fontWeight: 500, letterSpacing: "0.04em",
        transition: "all 0.15s",
      }}>
        {initials}
      </span>
      <span style={{
        fontFamily: MONO, fontSize: 11, letterSpacing: "0.14em",
        color: active ? A : T, textTransform: "uppercase",
        transition: "color 0.15s",
      }}>
        {open ? "▲" : "▼"}
      </span>
    </button>
  );
}
