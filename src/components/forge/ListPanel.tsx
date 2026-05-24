"use client";

import { useEffect, useState } from "react";
import type { PainPoint } from "@/lib/data";
import { getSavedPainPoints, getBuildingPainPoints, getSubmittedPainPoints } from "@/lib/actions";
import { Card } from "./Card";

const A = "var(--forge-accent)";
const BG = "var(--forge-bg)";
const B = "var(--forge-border)";
const T = "var(--forge-text)";
const MUT = "var(--forge-muted)";
const DIM = "var(--forge-dim)";
const MONO = "var(--font-ibm-plex-mono), monospace";
const PLAYFAIR = "var(--font-playfair), serif";

export type ListKind = "bookmarks" | "submissions" | "building";

const CONFIG: Record<ListKind, { title: string; sub: string; glyph: string; empty: string }> = {
  bookmarks: {
    title: "Your bookmarked pain",
    sub: "ideas you saved for later",
    glyph: "★",
    empty: "Nothing saved yet. Star a pain point from the feed to bookmark it.",
  },
  submissions: {
    title: "Pain you've submitted",
    sub: "problems you sent into the queue",
    glyph: "✎",
    empty: "You haven't submitted anything yet. Hit \"Submit Pain Point\" in the nav.",
  },
  building: {
    title: "What you're building",
    sub: "problems you've claimed and are shipping against",
    glyph: "▸",
    empty: "Not building anything yet. Open a pain point and click \"I'm building this\".",
  },
};

const FETCHERS: Record<ListKind, () => Promise<PainPoint[]>> = {
  bookmarks: getSavedPainPoints,
  building: getBuildingPainPoints,
  submissions: getSubmittedPainPoints,
};

type Props = {
  kind: ListKind | null;
  onClose: () => void;
  onOpenDetail: (p: PainPoint) => void;
};

export function ListPanel({ kind, onClose, onOpenDetail }: Props) {
  const [items, setItems] = useState<PainPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!kind) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [kind, onClose]);

  useEffect(() => {
    if (!kind) {
      setItems([]);
      return;
    }
    setLoading(true);
    FETCHERS[kind]()
      .then(setItems)
      .finally(() => setLoading(false));
  }, [kind]);

  if (!kind) return null;

  const config = CONFIG[kind];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(5,5,5,0.78)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "32px 0",
        overflowY: "auto",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: BG, border: `1px solid ${B}`,
          width: "min(720px, calc(100vw - 48px))",
          maxHeight: "calc(100vh - 64px)", overflowY: "auto",
        }}
      >
        {/* sticky header */}
        <div style={{
          position: "sticky", top: 0, background: BG, zIndex: 2,
          padding: "22px 32px",
          borderBottom: `1px solid ${B}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ color: A, fontSize: 16 }}>{config.glyph}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: DIM }}>
                {kind.toUpperCase()}
              </span>
              <span style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontSize: 20, color: T, lineHeight: 1 }}>
                {config.title}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: `1px solid ${B}`, color: T,
              padding: "6px 10px", fontFamily: MONO, fontSize: 12,
              letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer",
            }}
          >
            CLOSE · ESC
          </button>
        </div>

        {/* sub label */}
        <div style={{ padding: "18px 32px", borderBottom: `1px solid ${B}` }}>
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.04em", color: MUT }}>
            {config.sub} · {loading ? "—" : items.length} total
          </span>
        </div>

        {/* content */}
        {loading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <EmptyState message={config.empty} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 1, padding: "1px" }}>
            {items.map((p) => (
              <Card key={p.id} p={p} onOpen={(item) => { onOpenDetail(item); onClose(); }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{
      padding: "80px 32px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
    }}>
      <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: DIM }}>
        Loading...
      </span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{
      padding: "80px 32px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 22,
    }}>
      <div style={{
        width: 48, height: 48, border: `1px solid ${B}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: DIM, fontFamily: MONO, fontSize: 20,
      }}>
        ○
      </div>
      <p style={{
        fontFamily: PLAYFAIR, fontStyle: "italic",
        fontSize: 18, color: MUT, textAlign: "center",
        maxWidth: 420, lineHeight: 1.5, margin: 0,
      }}>
        {message}
      </p>
    </div>
  );
}
