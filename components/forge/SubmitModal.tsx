"use client";

import { useState, useEffect } from "react";

type SubmitModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SubmitModal({ open, onClose }: SubmitModalProps) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setText("");
      setSubmitted(false);
    }
  }, [open]);

  if (!open) return null;

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const ready = words >= 6;

  return (
    <div onClick={onClose} style={overlayStyle()}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--forge-bg)",
          border: "1px solid var(--forge-border)",
          width: "min(640px, calc(100vw - 48px))",
          position: "relative",
        }}
      >
        <div
          style={{
            padding: "18px 28px",
            borderBottom: "1px solid var(--forge-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
            SUBMIT · NEW PAIN POINT
          </span>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid var(--forge-border)",
              color: "var(--forge-text)",
              padding: "4px 8px",
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

        {submitted ? (
          <div
            style={{ padding: "60px 40px", textAlign: "center" as const }}
          >
            <div
              style={{
                fontFamily: "var(--font-ibm-plex-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.22em",
                color: "var(--forge-accent)",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              ● Received
            </div>
            <p
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontStyle: "italic",
                fontSize: 24,
                lineHeight: 1.3,
                color: "var(--forge-text)",
                margin: "0 auto 22px",
                maxWidth: 480,
              }}
            >
              Your pain is being structured. You&apos;ll see it surface in the
              feed within the hour.
            </p>
            <button onClick={onClose} style={outlinedBtnStyle()}>
              Back to feed
            </button>
          </div>
        ) : (
          <>
            <div style={{ padding: "32px 28px 18px" }}>
              <h2
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: 28,
                  lineHeight: 1.2,
                  margin: "0 0 24px",
                  color: "var(--forge-text)",
                }}
              >
                What problem keeps surfacing in your life?
              </h2>

              <textarea
                autoFocus
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Describe something that frustrates you, or a problem you wish had a solution…"
                style={{
                  width: "100%",
                  minHeight: 200,
                  background: "#0a0a0a",
                  border: "1px solid var(--forge-border)",
                  color: "var(--forge-text)",
                  padding: 18,
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                  fontSize: 14,
                  lineHeight: 1.6,
                  resize: "vertical",
                  outline: "none",
                  fontStyle: text ? "normal" : "italic",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--forge-accent)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--forge-border)")
                }
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 10,
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
                  &nbsp;&nbsp;AI will structure this into a pain point with
                  score, target user, and matching signals.
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-ibm-plex-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.04em",
                    color: "var(--forge-muted)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {words.toString().padStart(3, "0")} words
                </span>
              </div>
            </div>

            <div style={{ padding: "0 28px 28px" }}>
              <button
                disabled={!ready}
                onClick={() => setSubmitted(true)}
                style={{
                  width: "100%",
                  background: ready ? "var(--forge-accent)" : "#1f1f1f",
                  color: ready ? "var(--forge-accent-fg)" : "var(--forge-dim)",
                  border: "none",
                  padding: "16px",
                  fontFamily: "var(--font-ibm-plex-mono), monospace",
                  fontSize: 13,
                  letterSpacing: "0.18em",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  cursor: ready ? "pointer" : "not-allowed",
                  transition: "background 0.15s",
                }}
              >
                {ready ? "Submit →" : "Keep typing…"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
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
