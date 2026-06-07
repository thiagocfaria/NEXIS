import { motion } from "motion/react";
import { ArrowLeft, Bell, Sun, Moon } from "lucide-react";
import { T } from "../tokens";
import { ReactNode, useState } from "react";

/* ── Mascot SVG ─────────────────────────────────────────────── */
export function NexisMascot({ size = 36 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.35, background: T.navy, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 3px 10px rgba(27,31,94,0.28)`, flexShrink: 0 }}>
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" fill="#1B1F5E"/>
        <rect x="6.5" y="6" width="2.8" height="12" rx="1.4" fill="white"/>
        <rect x="14.7" y="6" width="2.8" height="12" rx="1.4" fill="white"/>
        <path d="M6.5 6 L17.5 18" stroke="#C8FF47" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

/* ── Home Header (logo + bell + theme toggle) ───────────────── */
export function HomeHeader({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  return (
    <div style={{
      padding: `10px ${T.px}px 14px`,
      background: dark ? "#0D1035" : T.card,
      borderBottom: `1px solid ${T.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      transition: "background 0.3s",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <NexisMascot />
        <div>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.035em", color: dark ? "#E8ECFF" : T.navy, fontFamily: "var(--font-sans)", lineHeight: 1, display: "block" }}>Nexis</span>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: "50%", background: T.online, flexShrink: 0 }}
            />
            <span style={{ fontSize: 10, fontWeight: 700, color: T.online, fontFamily: "var(--font-mono)", letterSpacing: "0.07em" }}>IA ONLINE</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <motion.button whileTap={{ scale: 0.88 }} style={{ width: 40, height: 40, borderRadius: 13, background: dark ? "rgba(255,255,255,0.06)" : T.bg, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
          <Bell size={17} color={T.muted} />
          <div style={{ position: "absolute", top: 8, right: 9, width: 8, height: 8, borderRadius: "50%", background: T.red, border: `2px solid ${dark ? "#0D1035" : T.card}` }} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.92 }} onClick={onToggleDark} style={{ width: 68, height: 36, borderRadius: 18, background: dark ? "#1E2260" : T.bg, border: `1px solid ${T.border}`, padding: 4, cursor: "pointer", display: "flex", alignItems: "center", position: "relative" }}>
          <motion.div animate={{ x: dark ? 32 : 0 }} transition={{ type: "spring", stiffness: 380, damping: 28 }} style={{ width: 28, height: 28, borderRadius: 14, background: dark ? T.lime : T.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {dark ? <Moon size={13} color={T.navy} /> : <Sun size={13} color="#fff" />}
          </motion.div>
          <motion.span animate={{ opacity: dark ? 0 : 1 }} style={{ position: "absolute", right: 9, fontSize: 8, fontWeight: 800, color: T.muted, fontFamily: "var(--font-mono)" }}>LUZ</motion.span>
        </motion.button>
      </div>
    </div>
  );
}

/* ── Back Header (for detail screens) ──────────────────────── */
export function BackHeader({ title, onBack, right, statusLabel }: {
  title: string; onBack: () => void; right?: ReactNode; statusLabel?: string;
}) {
  return (
    <div style={{
      padding: `10px ${T.px}px 14px`,
      background: T.card,
      borderBottom: `1px solid ${T.border}`,
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}>
      <motion.button whileTap={{ scale: 0.88 }} onClick={onBack} style={{ width: 38, height: 38, borderRadius: 12, background: T.bg, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
        <ArrowLeft size={17} color={T.navy} />
      </motion.button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: T.navy, fontFamily: "var(--font-sans)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>{title}</p>
        {statusLabel && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: "50%", background: T.online }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: T.online, fontFamily: "var(--font-mono)" }}>{statusLabel}</span>
          </div>
        )}
      </div>
      {right}
    </div>
  );
}

/* ── Simple Tab Header ──────────────────────────────────────── */
export function TabHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div style={{ padding: `12px ${T.px}px 14px`, background: T.card, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <p style={{ fontSize: 20, fontWeight: 800, color: T.navy, fontFamily: "var(--font-sans)", letterSpacing: "-0.03em" }}>{title}</p>
      {right}
    </div>
  );
}
