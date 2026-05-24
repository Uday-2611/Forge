"use client";

import { useState, useEffect, useMemo, CSSProperties } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

/* ------------------------------------------------------------------ */
/* tokens                                                               */
/* ------------------------------------------------------------------ */
const A    = "var(--forge-accent)";
const BG   = "var(--forge-bg)";
const SURF = "var(--forge-surface)";
const B    = "var(--forge-border)";
const T    = "var(--forge-text)";
const MUT  = "var(--forge-muted)";
const DIM  = "var(--forge-dim)";
const PLAYFAIR = "var(--font-playfair), serif";
const MONO     = "var(--font-ibm-plex-mono), monospace";

/* ------------------------------------------------------------------ */
/* ascii rain data                                                      */
/* ------------------------------------------------------------------ */
const ASCII_LINES = [
  "▸ scraping r/startups · thread #48,217",
  "  pain detected · score 8.7",
  "  → newsletter sponsor CRM",
  "▸ scraping HN · thread #48,218",
  "  pain detected · score 6.4",
  "  → bench-science iPad ELN",
  "▸ scraping r/freelance · thread #48,219",
  "  pain detected · score 7.6",
  "  → invoice escalation cadence",
  "▸ user submission @maren",
  "  pain detected · score 7.1",
  "  → customer interview synth",
  "▸ scraping r/ADHD · thread #48,221",
  "  pain detected · score 7.3",
  "  → anti-streak habit tracker",
  "▸ scraping r/personalfinance",
  "  pain detected · score 9.0",
  "  → estate paperwork vault",
  "▸ scraping r/therapists",
  "  pain detected · score 8.4",
  "  → SOAP-first note app",
  "▸ scraping r/Etsy · thread #48,224",
  "  pain detected · score 8.1",
  "  → makers' shelf inventory",
  "▸ scraping HN · thread #48,225",
  "  pain detected · score 7.9",
  "  → GitHub triage context",
];

/* ------------------------------------------------------------------ */
/* atoms                                                                */
/* ------------------------------------------------------------------ */
function Mono({
  children, size = 11, color = MUT, track = 0.04, upper = false, style = {},
}: {
  children: React.ReactNode; size?: number; color?: string;
  track?: number; upper?: boolean; style?: CSSProperties;
}) {
  return (
    <span style={{ fontFamily: MONO, fontSize: size, color, letterSpacing: `${track}em`, textTransform: upper ? "uppercase" : "none", ...style }}>
      {children}
    </span>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const map = {
    tl: { top: 20, left: 20,   content: "┌" },
    tr: { top: 20, right: 20,  content: "┐" },
    bl: { bottom: 20, left: 20,  content: "└" },
    br: { bottom: 20, right: 20, content: "┘" },
  };
  const { content, ...style } = map[pos];
  return (
    <span style={{ position: "absolute", color: DIM, fontFamily: MONO, fontSize: 14, lineHeight: 1, ...style }}>
      {content}
    </span>
  );
}

function CornerPlus({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const m: Record<string, CSSProperties> = {
    tl: { top: 20,    left: 20  },
    tr: { top: 20,    right: 20 },
    bl: { bottom: 20, left: 20  },
    br: { bottom: 20, right: 20 },
  };
  return (
    <span style={{ position: "absolute", color: DIM, fontFamily: MONO, fontSize: 14, ...m[pos] }}>+</span>
  );
}

/* ------------------------------------------------------------------ */
/* LEFT PANEL                                                           */
/* ------------------------------------------------------------------ */
function LeftPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 800);
    return () => clearInterval(id);
  }, []);

  const visible = useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => ASCII_LINES[(tick + i) % ASCII_LINES.length]);
  }, [tick]);

  return (
    <div style={{ flex: "1 1 0", position: "relative", overflow: "hidden", background: "#0a0a0a", borderRight: `1px solid ${B}`, padding: "40px 48px", display: "flex", flexDirection: "column" }}>
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />

      {/* top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 60 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 500, fontSize: 26, letterSpacing: "-0.01em", color: T }}>
            Forge<span style={{ color: A }}>.</span>
          </span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="blink-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: A, display: "inline-block" }} />
          <Mono size={10} color={MUT} track={0.2} upper>terminal · live</Mono>
        </div>
      </div>

      {/* editorial quote */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1, pointerEvents: "none" }}>
        <Mono size={10} color={A} track={0.22} upper style={{ display: "block", marginBottom: 24 }}>● Manifesto · §1</Mono>
        <h1 style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(36px, 4.4vw, 56px)", lineHeight: 1.1, margin: 0, color: T, letterSpacing: "-0.012em", maxWidth: 540 }}>
          The best products begin as someone else&apos;s{" "}
          <span style={{ color: A }}>frustration</span> —
          stated badly, in public, at 2am.
        </h1>
        <p style={{ marginTop: 28, maxWidth: 480, fontFamily: MONO, fontSize: 13, lineHeight: 1.7, color: "#a8a8a8" }}>
          We turn that frustration into a brief. Sign in to save ideas, submit your own pain,
          and see which problems other founders are already building toward.
        </p>
      </div>

      {/* ascii rain — background */}
      <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "flex-end", padding: "100px 48px 100px 0", pointerEvents: "none", opacity: 0.32 }}>
        <div style={{
          fontFamily: MONO, fontSize: 10, lineHeight: 1.7, color: MUT,
          whiteSpace: "pre", textAlign: "left",
          maskImage: "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 30%, #000 70%, transparent)",
        }}>
          {visible.map((l, i) => (
            <div key={`${tick}-${i}`} style={{ color: l.startsWith("▸") ? A : (l.startsWith("  →") ? T : MUT), opacity: l.startsWith("▸") ? 0.9 : 0.55 }}>
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* footer stats */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", gap: 18 }}>
          {[["1,284","ideas"],["48k","threads"],["2,847","builders"]].map(([n, l]) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Mono size={16} color={T} track={-0.02} style={{ fontVariantNumeric: "tabular-nums" }}>{n}</Mono>
              <Mono size={9} color={DIM} track={0.2} upper>{l}</Mono>
            </div>
          ))}
        </div>
        <Mono size={10} color={DIM} track={0.18} upper>v0.4 · 2026</Mono>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RIGHT PANEL                                                          */
/* ------------------------------------------------------------------ */
function Grid() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      backgroundImage: `linear-gradient(${B} 1px, transparent 1px), linear-gradient(90deg, ${B} 1px, transparent 1px)`,
      backgroundSize: "48px 48px", opacity: 0.18,
      maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 70%)",
      WebkitMaskImage: "radial-gradient(ellipse at center, #000 30%, transparent 70%)",
    }} />
  );
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ animation: "spin 0.9s linear infinite" }}>
      <circle cx="7" cy="7" r="5.5" stroke={DIM} strokeWidth="1.2" fill="none" />
      <path d="M7 1.5 A 5.5 5.5 0 0 1 12.5 7" stroke={A} strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function RightPanel() {
  const [hover, setHover] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleSignIn = async () => {
    setBusy(true);
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/feed" });
    } catch {
      setBusy(false);
    }
  };

  return (
    <div style={{ flex: "1 1 0", display: "flex", alignItems: "center", justifyContent: "center", padding: 48, position: "relative" }}>
      <Grid />

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        <Mono size={10} color={A} track={0.22} upper style={{ display: "block", marginBottom: 22 }}>● Sign in · §0</Mono>

        <h2 style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 400, fontSize: 44, lineHeight: 1.08, margin: "0 0 18px", color: T, letterSpacing: "-0.015em" }}>
          Enter the<br />
          <span style={{ color: MUT }}>pain point</span><br />
          terminal<span style={{ color: A }}>.</span>
        </h2>

        <p style={{ fontFamily: MONO, fontSize: 12.5, lineHeight: 1.7, color: "#a8a8a8", margin: "0 0 36px" }}>
          One account. One auth method. We don&apos;t store passwords because we never see them.
          Forge uses Google sign-in only — and asks for nothing beyond your email.
        </p>

        <button
          onClick={handleSignIn}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          disabled={busy}
          style={{
            width: "100%",
            background: hover && !busy ? A : "transparent",
            color: hover && !busy ? "#0a0a0a" : T,
            border: `1px solid ${hover && !busy ? A : "#3A3A3A"}`,
            padding: "18px 22px", fontFamily: MONO, fontSize: 13, letterSpacing: "0.12em",
            textTransform: "uppercase", cursor: busy ? "wait" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
            transition: "all 0.18s",
          }}>
          {busy ? (
            <>
              <Spinner />
              <span>Authenticating…</span>
            </>
          ) : (
            <>
              <GoogleG />
              <span>Continue with Google</span>
              <span style={{ marginLeft: "auto", color: hover ? "#0a0a0a" : A }}>→</span>
            </>
          )}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "32px 0" }}>
          <div style={{ height: 1, background: B, flex: 1 }} />
          <Mono size={9} color={DIM} track={0.2} upper>only sign-in method</Mono>
          <div style={{ height: 1, background: B, flex: 1 }} />
        </div>

        {/* permissions */}
        <div style={{ background: SURF, border: `1px solid ${B}`, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          <Mono size={9} color={DIM} track={0.22} upper>What we read · what we don&apos;t</Mono>
          {[
            { ok: true,  t: "Your email address"               },
            { ok: true,  t: "Your display name"                },
            { ok: false, t: "Your contacts, calendar, drive"   },
            { ok: false, t: "Anything else, ever"              },
          ].map((p) => (
            <div key={p.t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: p.ok ? A : "#444", fontFamily: MONO, fontSize: 11, width: 12 }}>{p.ok ? "▸" : "×"}</span>
              <Mono size={11.5} color={p.ok ? T : "#666"} track={0.02}>{p.t}</Mono>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <Mono size={10} color={DIM} track={0.16} upper>
            New here?{" "}
            <Link href="/" style={{ color: A, textDecoration: "none" }}>Read the manifesto →</Link>
          </Mono>
          <Mono size={9} color={DIM} track={0.18} upper>terms · privacy</Mono>
        </div>
      </div>

      <CornerPlus pos="tl" />
      <CornerPlus pos="tr" />
      <CornerPlus pos="bl" />
      <CornerPlus pos="br" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                 */
/* ------------------------------------------------------------------ */
export default function LoginPage() {
  return (
    <div style={{ background: BG, color: T, minHeight: "100vh", display: "flex" }}>
      <LeftPanel />
      <RightPanel />
    </div>
  );
}
