"use client";

type TagProps = {
  children: React.ReactNode;
  variant?: "solid" | "ghost";
};

export function Tag({ children, variant = "solid" }: TagProps) {
  return (
    <span
      style={{
        fontFamily: "var(--font-ibm-plex-mono), monospace",
        fontSize: 10,
        letterSpacing: "0.18em",
        padding: "4px 9px",
        textTransform: "uppercase",
        border: "1px solid var(--forge-border)",
        color:
          variant === "solid"
            ? "var(--forge-text)"
            : "var(--forge-muted)",
        background:
          variant === "solid" ? "#222222" : "transparent",
      }}
    >
      {children}
    </span>
  );
}
