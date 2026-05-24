"use client";

import { useState, useEffect, useMemo, useRef, CSSProperties } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

/* ------------------------------------------------------------------ */
/* tokens                                                               */
/* ------------------------------------------------------------------ */
const A = "var(--forge-accent)";
const BG = "var(--forge-bg)";
const SURF = "var(--forge-surface)";
const B = "var(--forge-border)";
const T = "var(--forge-text)";
const MUT = "var(--forge-muted)";
const DIM = "var(--forge-dim)";
const PLAYFAIR = "var(--font-playfair), serif";
const MONO = "var(--font-ibm-plex-mono), monospace";

/* ------------------------------------------------------------------ */
/* ticker data                                                           */
/* ------------------------------------------------------------------ */
const TICKER_LINES = [
  { src: "r/startups",         txt: "wasting 11h/week reconciling stripe and bank", score: 9.2 },
  { src: "Hacker News",        txt: "every bench-science tool is stuck in 2003",     score: 6.4 },
  { src: "r/Etsy",             txt: "out of mailers at midnight, again",              score: 8.1 },
  { src: "r/ADHD",             txt: "habit apps punish me for missing one day",       score: 7.3 },
  { src: "r/freelance",        txt: "client owes me $8k, what's the script?",         score: 7.6 },
  { src: "r/therapists",       txt: "SimplePractice is too much, Notion too little",  score: 8.4 },
  { src: "Hacker News",        txt: "issue triage as a stranger to my own users",     score: 7.9 },
  { src: "r/Substack",         txt: "lost a $4k sponsor, forgot to send invoice",     score: 8.7 },
  { src: "r/personalfinance",  txt: "dad passed. where do I start with accounts?",   score: 9.0 },
  { src: "r/discordapp",       txt: "policy lives in pinned messages from 2022",      score: 6.8 },
  { src: "User Submitted",     txt: "47 interview transcripts I'll never re-read",    score: 7.1 },
  { src: "r/FirstTimeHomeBuyer", txt: "14 PDFs named 'final_v2'",                    score: 8.6 },
];

/* ------------------------------------------------------------------ */
/* atoms                                                                */
/* ------------------------------------------------------------------ */
function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 500, fontSize: size, letterSpacing: "-0.01em", color: T }}>
      Forge<span style={{ color: A }}>.</span>
    </span>
  );
}

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

function SectionLabel({ children, num }: { children: React.ReactNode; num: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 30 }}>
      <Mono size={10} color={A} track={0.22} upper>● {num}</Mono>
      <div style={{ height: 1, background: B, flex: 1 }} />
      <Mono size={10} color={DIM} track={0.22} upper>{children}</Mono>
    </div>
  );
}

function BlinkDot() {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span className="blink-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: A, display: "inline-block" }} />
      <Mono size={10} color={MUT} track={0.2} upper>scraping</Mono>
    </span>
  );
}

function CornerCrosses() {
  const s: CSSProperties = { position: "absolute", color: DIM, fontFamily: "monospace", fontSize: 14 };
  return (
    <>
      <span style={{ ...s, top: 12, left: 12 }}>+</span>
      <span style={{ ...s, top: 12, right: 12 }}>+</span>
      <span style={{ ...s, bottom: 12, left: 12 }}>+</span>
      <span style={{ ...s, bottom: 12, right: 12 }}>+</span>
    </>
  );
}

function sectionWrap(): CSSProperties {
  return { maxWidth: 1280, margin: "0 auto", padding: "96px 32px" };
}

function primaryBtn(): CSSProperties {
  return {
    background: A, color: "#0a0a0a", padding: "14px 22px",
    fontFamily: MONO, fontSize: 12, letterSpacing: "0.18em", fontWeight: 500,
    textTransform: "uppercase", textDecoration: "none", display: "inline-block",
    transition: "transform 0.15s",
  };
}

function ghostBtn(): CSSProperties {
  return {
    background: "transparent", border: `1px solid ${B}`, color: T,
    padding: "13px 20px", fontFamily: MONO, fontSize: 12,
    letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none",
    display: "inline-block",
  };
}

/* ------------------------------------------------------------------ */
/* HERO                                                                 */
/* ------------------------------------------------------------------ */
function TopBar() {
  const { data: session } = authClient.useSession();
  return (
    <div style={{ borderBottom: `1px solid ${B}`, padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1280, margin: "0 auto" }}>
      <Wordmark size={22} />
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <BlinkDot />
        <Mono size={10} color={DIM} track={0.2} upper>v0.4 — week 21, 2026</Mono>
        {session ? (
          <button
            onClick={() => authClient.signOut()}
            style={{ background: "transparent", border: `1px solid ${B}`, color: MUT, fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", padding: "5px 12px" }}>
            {session.user.name} · sign out
          </button>
        ) : (
          <button
            onClick={() => authClient.signIn.social({ provider: "google" })}
            style={{ background: "transparent", border: `1px solid ${B}`, color: T, fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", padding: "5px 12px" }}>
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}

function LiveTicker() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1400);
    return () => clearInterval(id);
  }, []);

  const lines = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => TICKER_LINES[(tick + i) % TICKER_LINES.length]);
  }, [tick]);

  return (
    <div style={{ background: SURF, border: `1px solid ${B}`, padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 14, borderBottom: `1px solid ${B}`, marginBottom: 18 }}>
        <Mono size={10} color={A} track={0.2} upper>● live · pain stream</Mono>
        <Mono size={10} color={DIM} track={0.2} upper style={{ fontVariantNumeric: "tabular-nums" }}>{(15234 + tick * 3).toLocaleString()} today</Mono>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {lines.map((l, i) => {
          const opacity = i === 0 ? 0.35 : 1 - (i - 1) * 0.08;
          const isNew = i === 1;
          return (
            <div key={`${tick}-${i}`} style={{ opacity, display: "flex", flexDirection: "column", gap: 4, transition: "opacity 0.6s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Mono size={9} color={isNew ? A : DIM} track={0.2} upper>{isNew ? "▸ " : "  "}{l.src}</Mono>
                <Mono size={11} color={l.score >= 8 ? A : T} track={0.02} style={{ fontVariantNumeric: "tabular-nums" }}>{l.score.toFixed(1)}</Mono>
              </div>
              <span style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontSize: 13, color: T, lineHeight: 1.35 }}>
                &ldquo;{l.txt}&rdquo;
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 80, background: `linear-gradient(to bottom, transparent, ${SURF})`, pointerEvents: "none" }} />
    </div>
  );
}

function Hero() {
  return (
    <section style={{ borderBottom: `1px solid ${B}`, position: "relative", overflow: "hidden" }}>
      <TopBar />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "100px 32px 80px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 64, alignItems: "center", minHeight: "calc(100vh - 64px)" }}>
        <div>
          <Mono size={10} color={A} track={0.24} upper style={{ display: "block", marginBottom: 28 }}>
            ● Live · indexing 48,217 threads
          </Mono>
          <h1 style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(48px, 7vw, 92px)", lineHeight: 1.02, margin: 0, letterSpacing: "-0.018em", color: T }}>
            Problems worth<br />
            <span>building </span>
            <span style={{ color: A }}>—</span><br />
            <span style={{ color: MUT }}>sourced from</span><br />
            <em>the open internet.</em>
          </h1>

          <p style={{ marginTop: 36, maxWidth: 540, fontFamily: MONO, fontSize: 14, lineHeight: 1.7, color: "#bdbdbd" }}>
            Forge listens to Reddit, Hacker News, and the founders who submit directly —
            then structures the chaos into pain points scored by signal, sized by build difficulty,
            and matched to a tech stack you can ship from this weekend.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 44, alignItems: "center", flexWrap: "wrap" }}>
            <Link href="/feed"
              style={primaryBtn()}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(2px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}>
              Enter the feed →
            </Link>
            <Link href="/login" style={ghostBtn()}>Sign in</Link>
            <Mono size={10} color={DIM} track={0.18} upper style={{ marginLeft: 18 }}>
              free · no credit card · 1,284 ideas waiting
            </Mono>
          </div>
        </div>

        <LiveTicker />
      </div>
      <CornerCrosses />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* MANIFESTO                                                            */
/* ------------------------------------------------------------------ */
function Manifesto() {
  return (
    <section style={sectionWrap()}>
      <SectionLabel num="01">What is Forge</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 64, alignItems: "start" }}>
        <h2 style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(34px, 4.4vw, 56px)", lineHeight: 1.12, margin: 0, letterSpacing: "-0.012em", color: T }}>
          A discovery engine for problems
          <span style={{ color: MUT }}> the internet keeps complaining about</span>
          <span style={{ color: A }}>.</span>{" "}
          We read the threads so you can build the answer.
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 12 }}>
          <Mono size={10} color={DIM} track={0.22} upper>The thesis</Mono>
          <p style={{ fontFamily: MONO, fontSize: 13, lineHeight: 1.75, color: "#bdbdbd", margin: 0 }}>
            Every weekend, a million people complain in public about software that doesn&apos;t exist yet.
            Forge turns those complaints into a ranked, structured queue — so the next thing you build
            is something a stranger already wants.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* THE NEED                                                             */
/* ------------------------------------------------------------------ */
function TheNeed() {
  const rows = [
    { k: "Builders pick the wrong fight",  v: "We start projects that excite us, not projects users have begged for in public threads for the last three years." },
    { k: "Signal is fragmented",           v: "Pain is scattered across r/startups, HN, niche subreddits, and Substacks. No one tool aggregates it." },
    { k: "Brief-to-code takes weeks",      v: "By the time a founder articulates a problem, picks a stack, and writes the spec, the moment is gone." },
  ];
  return (
    <section style={{ ...sectionWrap(), borderTop: `1px solid ${B}` }}>
      <SectionLabel num="02">Why this needed to exist</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, border: `1px solid ${B}` }}>
        {rows.map((r, i) => (
          <div key={i} style={{ padding: "32px 28px", borderRight: i < rows.length - 1 ? `1px solid ${B}` : "none", display: "flex", flexDirection: "column", gap: 16 }}>
            <Mono size={26} color={A} track={-0.02} style={{ fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {String(i + 1).padStart(2, "0")}
            </Mono>
            <h3 style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 400, fontSize: 22, lineHeight: 1.25, margin: 0, color: T }}>{r.k}</h3>
            <p style={{ fontFamily: MONO, fontSize: 12.5, lineHeight: 1.7, color: "#a8a8a8", margin: 0 }}>{r.v}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CAPABILITIES                                                         */
/* ------------------------------------------------------------------ */
function SubmitViz() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 4), 1100);
    return () => clearInterval(id);
  }, []);
  const lines = [
    `> typing…`,
    `> "my newsletter sponsors fall through a CRM crack"`,
    `> structuring · score: 8.7 · solo · creator`,
    `> ✓ published to feed`,
  ];
  return (
    <div style={{ width: "100%", textAlign: "left", fontFamily: MONO, fontSize: 11, lineHeight: 1.9, color: MUT }}>
      {lines.map((l, i) => (
        <div key={i} style={{ color: i === phase ? A : (i < phase ? T : DIM), opacity: i <= phase ? 1 : 0.4, transition: "color 0.4s, opacity 0.4s" }}>{l}</div>
      ))}
    </div>
  );
}

function SaveViz() {
  const stars = [
    { t: "Therapists hand-write SOAP notes",      on: true  },
    { t: "Newsletter sponsor pipeline CRM",         on: true  },
    { t: "Estate paperwork vault",                  on: false },
    { t: "Bench-science ELN for the iPad",          on: true  },
  ];
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 9 }}>
      {stars.map((s, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "6px 10px", background: s.on ? "rgba(168,255,62,0.06)" : "transparent", border: `1px solid ${s.on ? "rgba(168,255,62,0.25)" : B}` }}>
          <Mono size={10.5} color={T} track={0.02} style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{s.t}</Mono>
          <span style={{ color: s.on ? A : DIM, fontSize: 13, lineHeight: 1 }}>{s.on ? "★" : "☆"}</span>
        </div>
      ))}
    </div>
  );
}

function FilterViz() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % 4), 1200);
    return () => clearInterval(id);
  }, []);
  const groups = [["Finance", "Creator", "Healthcare", "Dev"], ["Weekend", "Solo", "Team"], ["pain≥7", "pain≥8", "pain≥9"]];
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
      {groups.map((g, gi) => (
        <div key={gi} style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {g.map((t, i) => {
            const on = (gi === 0 && i === active % g.length) || (gi === 1 && i === (active + 1) % g.length) || (gi === 2 && i === 0 && active % 2 === 0);
            return (
              <span key={t} style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.06em", padding: "3px 8px", border: `1px solid ${on ? A : B}`, background: on ? A : "transparent", color: on ? "#0a0a0a" : MUT, textTransform: "uppercase", transition: "all 0.3s" }}>{t}</span>
            );
          })}
        </div>
      ))}
      <div style={{ marginTop: 6, paddingTop: 10, borderTop: `1px solid ${B}`, display: "flex", justifyContent: "space-between" }}>
        <Mono size={9} color={DIM} track={0.18} upper>matches</Mono>
        <Mono size={11} color={A} track={0} style={{ fontVariantNumeric: "tabular-nums" }}>{(48 + active * 7).toString().padStart(3, "0")}</Mono>
      </div>
    </div>
  );
}

function StackViz() {
  const rows = [["framework", "next.js · 14"], ["db", "postgres + drizzle"], ["auth", "better-auth"], ["ai", "openai · gpt-4o"], ["deploy", "vercel · edge"], ["build", "weekend · solo"]];
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
      {rows.map(([k, v], i) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 5, borderBottom: i < rows.length - 1 ? `1px dashed ${B}` : "none" }}>
          <Mono size={10} color={DIM} track={0.16} upper>{k}</Mono>
          <Mono size={10.5} color={i === 5 ? A : T} track={0.02}>{v}</Mono>
        </div>
      ))}
    </div>
  );
}

function CapCard({ num, title, copy, viz }: { num: number; title: string; copy: string; viz: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ background: SURF, border: `1px solid ${hover ? A : B}`, padding: "28px 30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, transition: "border-color 0.2s", minHeight: 220 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Mono size={10} color={DIM} track={0.2} upper>0{num} · capability</Mono>
        <h3 style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 400, fontSize: 24, lineHeight: 1.18, margin: 0, color: T }}>{title}</h3>
        <p style={{ fontFamily: MONO, fontSize: 12.5, lineHeight: 1.7, color: "#a8a8a8", margin: 0 }}>{copy}</p>
      </div>
      <div style={{ background: "#0a0a0a", border: `1px solid ${B}`, padding: 16, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
        {viz}
      </div>
    </div>
  );
}

function Capabilities() {
  const items = [
    { title: "Submit your own pain",          copy: "Type a frustration. AI structures it into a scored, tagged, source-linked pain point and adds it to the feed.", viz: <SubmitViz /> },
    { title: "Save ideas worth returning to", copy: "Star a problem and it lands in your Reading Room — a private dashboard of ideas you might build next.",          viz: <SaveViz />   },
    { title: "Filter by what you can ship",   copy: "Slice by industry, build difficulty, pain score, sourcing platform — surface only the problems your stack can solve.", viz: <FilterViz /> },
    { title: "Get a suggested stack",         copy: "Every idea ships with a recommended tech stack — DB, auth, deploy, AI dependency — sized to weekend, solo, or team.", viz: <StackViz />   },
  ];
  return (
    <section style={{ ...sectionWrap(), borderTop: `1px solid ${B}` }}>
      <SectionLabel num="03">What you can do here</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {items.map((it, i) => <CapCard key={i} num={i + 1} {...it} />)}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* GLOBE                                                                */
/* ------------------------------------------------------------------ */
function Globe() {
  const [t, setT] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const loop = () => { setT((x) => x + 0.005); rafRef.current = requestAnimationFrame(loop); };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const R = 180, cx = 220, cy = 220;

  const meridians = Array.from({ length: 8 }, (_, i) => {
    const phi = (i / 8) * Math.PI + t;
    const rx = Math.abs(Math.cos(phi)) * R;
    return (
      <ellipse key={`m${i}`} cx={cx} cy={cy} rx={rx} ry={R} fill="none" stroke={B} strokeWidth="0.8"
        transform={`rotate(18 ${cx} ${cy})`} opacity={Math.cos(phi) > 0 ? 1 : 0.35} />
    );
  });

  const parallels = Array.from({ length: 6 }, (_, i) => (
    <ellipse key={`p${i}`} cx={cx} cy={cy} rx={R} ry={((i + 1) / 7) * R} fill="none" stroke={B} strokeWidth="0.8" transform={`rotate(18 ${cx} ${cy})`} />
  ));

  const points = [
    { lat: 0.4,  lon: -1.2, label: "r/startups", big: true  },
    { lat: -0.2, lon:  0.6, label: "HN",          big: true  },
    { lat:  0.9, lon:  1.4, label: "r/ADHD",      big: false },
    { lat: -0.6, lon: -2.4, label: "r/Etsy",      big: false },
    { lat:  0.15,lon:  2.6, label: "Substack",    big: false },
    { lat: -0.9, lon: -0.4, label: "r/freelance", big: false },
    { lat:  0.7, lon: -2.0, label: "r/therapists",big: false },
    { lat: -0.3, lon:  2.0, label: "User",         big: false },
  ];

  return (
    <div style={{ position: "relative", aspectRatio: "1 / 1", width: "100%", maxWidth: 480, marginLeft: "auto" }}>
      <svg viewBox="0 0 440 440" style={{ width: "100%", height: "100%", display: "block" }}>
        <circle cx={cx} cy={cy} r={R + 22} fill="none" stroke={B} strokeWidth="0.6" strokeDasharray="2 6" />
        <circle cx={cx} cy={cy} r={R}      fill="none" stroke={B} strokeWidth="1.2" />
        {parallels}
        {meridians}
        <ellipse cx={cx} cy={cy} rx={R} ry={6} fill="none" stroke={A} strokeWidth="0.6" transform={`rotate(18 ${cx} ${cy})`} opacity="0.25" />
        {points.map((p, i) => {
          const lon = p.lon + t * 0.6;
          const x3 = Math.cos(p.lat) * Math.sin(lon);
          const z3 = Math.cos(p.lat) * Math.cos(lon);
          const y3 = Math.sin(p.lat);
          const visible = z3 > -0.15;
          const px = cx + x3 * R;
          const py = cy - y3 * R;
          const r = p.big ? 4 : 2.5;
          const opacity = visible ? (z3 > 0 ? 1 : 0.4) : 0;
          return (
            <g key={i} opacity={opacity}>
              <circle cx={px} cy={py} r={r + 4} fill={A} opacity={0.15} />
              <circle cx={px} cy={py} r={r} fill={A} />
              {p.big && visible && z3 > 0.4 && (
                <text x={px + 10} y={py + 3} fontFamily="IBM Plex Mono, monospace" fontSize="9" fill={MUT} letterSpacing="1">{p.label.toUpperCase()}</text>
              )}
            </g>
          );
        })}
        <line x1={cx - 8} y1={cy} x2={cx + 8} y2={cy} stroke={DIM} strokeWidth="0.6" />
        <line x1={cx} y1={cy - 8} x2={cx} y2={cy + 8} stroke={DIM} strokeWidth="0.6" />
      </svg>
      <div style={{ position: "absolute", bottom: 0, left: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        <Mono size={9} color={DIM} track={0.2} upper>signal origin map</Mono>
        <Mono size={9} color={MUT} track={0.12} upper>rot · {(t % (Math.PI * 2)).toFixed(2)} rad</Mono>
      </div>
      <div style={{ position: "absolute", top: 0, right: 0, display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
        <Mono size={9} color={A} track={0.2} upper>● tracking</Mono>
        <Mono size={9} color={MUT} track={0.12} upper>8 platforms</Mono>
      </div>
    </div>
  );
}

function GlobeSection() {
  return (
    <section style={{ ...sectionWrap(), borderTop: `1px solid ${B}` }}>
      <SectionLabel num="04">Where the pain comes from</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 64, alignItems: "center" }}>
        <div>
          <h2 style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(30px, 3.8vw, 48px)", lineHeight: 1.15, margin: "0 0 28px", color: T, letterSpacing: "-0.01em" }}>
            48,217 threads — across six platforms, scraped continuously, distilled into one feed.
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, borderTop: `1px solid ${B}` }}>
            {[["Reddit","32,481","58%"],["Hacker News","8,209","24%"],["User Submitted","4,127","12%"],["X / Twitter","2,001","4%"],["Substack notes","892","1.5%"],["Indie Hackers","507","0.5%"]].map(([src, n, pct], i) => (
              <div key={src} style={{ padding: "14px 4px", borderBottom: `1px solid ${B}`, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Mono size={11} color={i === 0 ? A : T} track={0.04}>{src}</Mono>
                <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                  <Mono size={10} color={DIM} track={0} style={{ fontVariantNumeric: "tabular-nums" }}>{n}</Mono>
                  <Mono size={10} color={MUT} track={0.12}>{pct}</Mono>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Globe />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* ASCII MARQUEE                                                        */
/* ------------------------------------------------------------------ */
function AsciiMarquee() {
  const phrases = ["PROBLEMS WORTH BUILDING", "★", "SOURCED FROM THE OPEN INTERNET", "★", "1,284 PAIN POINTS INDEXED", "★", "ENTER THE FEED", "★"];
  const text = Array(8).fill(phrases.join("    ·    ")).join("    ·    ");
  return (
    <div style={{ borderTop: `1px solid ${B}`, borderBottom: `1px solid ${B}`, overflow: "hidden", padding: "26px 0", background: "#0a0a0a" }}>
      <div className="marquee" style={{ whiteSpace: "nowrap", fontFamily: PLAYFAIR, fontStyle: "italic", fontSize: 56, letterSpacing: "-0.01em", color: T }}>
        {text}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* NEWSLETTER                                                           */
/* ------------------------------------------------------------------ */
function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  return (
    <section style={{ ...sectionWrap(), borderTop: `1px solid ${B}` }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <Mono size={10} color={A} track={0.22} upper style={{ display: "block", marginBottom: 16 }}>● weekly dispatch</Mono>
          <h2 style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(34px, 4.2vw, 52px)", lineHeight: 1.12, margin: 0, color: T, letterSpacing: "-0.012em" }}>
            The seven<br />highest-pain ideas<br />
            <span style={{ color: MUT }}>delivered Sunday at 9am.</span>
          </h2>
          <p style={{ fontFamily: MONO, fontSize: 13, lineHeight: 1.7, color: "#a8a8a8", margin: "26px 0 0", maxWidth: 440 }}>
            One email a week. The week&apos;s most-discussed problems, the recommended stack to ship each one,
            and a single editorial pick. No tracking pixels. Unsubscribe in one click.
          </p>
        </div>

        <div>
          {done ? (
            <div style={{ border: `1px solid ${A}`, padding: 32, background: "rgba(168,255,62,0.04)" }}>
              <Mono size={10} color={A} track={0.22} upper style={{ display: "block", marginBottom: 14 }}>● subscribed</Mono>
              <p style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontSize: 22, lineHeight: 1.3, margin: 0, color: T }}>
                You&apos;re on the dispatch list. Sunday morning, expect the seven problems the internet was loudest about this week.
              </p>
            </div>
          ) : (
            <div style={{ border: `1px solid ${B}`, padding: 32, background: SURF }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
                <Mono size={10} color={DIM} track={0.22} upper>subscribe</Mono>
                <Mono size={10} color={DIM} track={0.12}>3,247 readers</Mono>
              </div>
              <div style={{ display: "flex", borderBottom: `1px solid ${B}`, paddingBottom: 4 }}>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@founder.dev"
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: T, fontFamily: MONO, fontSize: 14, padding: "10px 0" }}
                />
                <button onClick={() => valid && setDone(true)} disabled={!valid}
                  style={{ background: "transparent", border: "none", color: valid ? A : DIM, fontFamily: MONO, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", cursor: valid ? "pointer" : "not-allowed", padding: "0 4px" }}>
                  subscribe →
                </button>
              </div>
              <div style={{ display: "flex", gap: 18, marginTop: 22, flexWrap: "wrap" }}>
                {[["52","weekly issues"],["7","ideas per dispatch"],["0","tracking pixels"]].map(([n, l]) => (
                  <div key={l} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Mono size={20} color={T} track={-0.02} style={{ fontVariantNumeric: "tabular-nums" }}>{n}</Mono>
                    <Mono size={9} color={DIM} track={0.18} upper>{l}</Mono>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FOOTER                                                               */
/* ------------------------------------------------------------------ */
function FootCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <Mono size={10} color={DIM} track={0.22} upper style={{ display: "block", marginBottom: 16 }}>{title}</Mono>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {links.map((l) => (
          <a key={l} href="#" onClick={(e) => e.preventDefault()}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = A; const arrow = e.currentTarget.querySelector<HTMLSpanElement>(".arrow"); if (arrow) { arrow.style.opacity = "1"; arrow.style.marginLeft = "10px"; } }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = T; const arrow = e.currentTarget.querySelector<HTMLSpanElement>(".arrow"); if (arrow) { arrow.style.opacity = "0"; arrow.style.marginLeft = "6px"; } }}
            style={{ fontFamily: MONO, fontSize: 13, color: T, textDecoration: "none", display: "flex", alignItems: "center", transition: "color 0.15s" }}>
            {l}
            <span className="arrow" style={{ color: A, marginLeft: 6, opacity: 0, transition: "all 0.18s" }}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function LandingFooter() {
  return (
    <footer style={{ borderTop: `1px solid ${B}`, background: "#0a0a0a" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 32px 36px" }}>
        <div style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontWeight: 400, fontSize: "clamp(80px, 18vw, 220px)", lineHeight: 1, letterSpacing: "-0.04em", color: T, marginBottom: 60 }}>
          Forge<span style={{ color: A }}>.</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, paddingBottom: 48, borderBottom: `1px solid ${B}` }}>
          <div>
            <Mono size={10} color={DIM} track={0.22} upper style={{ display: "block", marginBottom: 14 }}>● what this is</Mono>
            <p style={{ fontFamily: MONO, fontSize: 12.5, lineHeight: 1.75, color: "#9a9a9a", margin: 0, maxWidth: 360 }}>
              Forge is independent and reader-supported. We don&apos;t sell your data, we don&apos;t run ads,
              and we don&apos;t pretend AI is magic. We just read a lot of threads.
            </p>
          </div>
          <FootCol title="Product" links={["Feed", "Submit", "Reading Room", "Tech stacks"]} />
          <FootCol title="Company" links={["Manifesto", "Changelog", "Press", "Contact"]}   />
          <FootCol title="Social"  links={["Twitter / X", "Hacker News", "GitHub", "Discord"]} />
        </div>

        <div style={{ paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 18 }}>
          <Mono size={10} color={DIM} track={0.18} upper>© 2026 Forge Labs · built in public · v0.4.2</Mono>
          <div style={{ display: "flex", gap: 22 }}>
            {["Privacy", "Terms", "RSS"].map((l) => (
              <a key={l} href="#" onClick={(e) => e.preventDefault()}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = A)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = MUT)}
                style={{ fontFamily: MONO, fontSize: 10, color: MUT, letterSpacing: "0.18em", textDecoration: "none", textTransform: "uppercase", transition: "color 0.15s" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                 */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
  return (
    <div style={{ background: BG, color: T, minHeight: "100vh" }}>
      <Hero />
      <Manifesto />
      <TheNeed />
      <Capabilities />
      <GlobeSection />
      <AsciiMarquee />
      <Newsletter />
      <LandingFooter />
    </div>
  );
}
