"use client";

import { PainPoint } from "@/lib/data";
import { Card } from "./Card";

type FeedProps = {
  items: PainPoint[];
  onOpen: (p: PainPoint) => void;
};

export function Feed({ items, onOpen }: FeedProps) {
  return (
    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "8px 32px 80px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16,
      }}
    >
      {items.map((p) => (
        <Card key={p.id} p={p} onOpen={onOpen} />
      ))}
      {items.length === 0 && (
        <div
          style={{
            gridColumn: "1 / -1",
            padding: "80px 0",
            textAlign: "center",
            fontFamily: "var(--font-playfair), serif",
            fontStyle: "italic",
            fontSize: 22,
            color: "var(--forge-muted)",
          }}
        >
          No pain found in this slice of the internet.
        </div>
      )}
    </div>
  );
}
