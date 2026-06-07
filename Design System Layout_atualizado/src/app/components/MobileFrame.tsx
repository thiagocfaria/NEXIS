import { ReactNode } from "react";

export function MobileFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--muted-foreground)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        {label}
      </span>
      <div
        style={{
          width: 375,
          minHeight: 812,
          background: "var(--background)",
          borderRadius: 40,
          border: "1px solid rgba(255,255,255,0.1)",
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset",
        }}
      >
        {/* Status bar */}
        <div style={{ height: 44, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>9:41</span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 16, height: 10, borderRadius: 2, border: "1px solid rgba(255,255,255,0.5)", position: "relative" }}>
              <div style={{ position: "absolute", inset: 2, borderRadius: 1, background: "var(--foreground)", width: "70%" }} />
            </div>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
              <path d="M7.5 2.5C9.2 2.5 10.7 3.2 11.8 4.3L13.2 2.9C11.7 1.4 9.7 0.5 7.5 0.5C5.3 0.5 3.3 1.4 1.8 2.9L3.2 4.3C4.3 3.2 5.8 2.5 7.5 2.5Z" fill="rgba(255,255,255,0.7)"/>
              <path d="M7.5 5.5C8.6 5.5 9.6 5.9 10.4 6.7L11.8 5.3C10.6 4.1 9.1 3.5 7.5 3.5C5.9 3.5 4.4 4.1 3.2 5.3L4.6 6.7C5.4 5.9 6.4 5.5 7.5 5.5Z" fill="rgba(255,255,255,0.7)"/>
              <circle cx="7.5" cy="9.5" r="1.5" fill="rgba(255,255,255,0.9)"/>
            </svg>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
