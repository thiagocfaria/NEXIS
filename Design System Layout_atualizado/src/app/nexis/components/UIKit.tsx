import { motion } from "motion/react";
import { ReactNode, InputHTMLAttributes } from "react";
import { T } from "../tokens";

/* ── Primary Button ─────────────────────────────────────────── */
export function PrimaryButton({ children, onClick, fullWidth, disabled }: {
  children: ReactNode; onClick?: () => void; fullWidth?: boolean; disabled?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={disabled ? undefined : onClick}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: "15px 24px",
        borderRadius: T.radius.lg,
        background: disabled ? "#D0D4E8" : T.navy,
        color: disabled ? T.muted : "#fff",
        border: "none",
        fontFamily: "var(--font-sans)",
        fontSize: 15,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: "-0.01em",
        boxShadow: disabled ? "none" : `0 4px 16px rgba(27,31,94,0.28)`,
        transition: "background 0.2s",
      }}
    >
      {children}
    </motion.button>
  );
}

/* ── Secondary Button ───────────────────────────────────────── */
export function SecondaryButton({ children, onClick, fullWidth }: {
  children: ReactNode; onClick?: () => void; fullWidth?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: "14px 24px",
        borderRadius: T.radius.lg,
        background: "transparent",
        color: T.navy,
        border: `1.5px solid ${T.border}`,
        fontFamily: "var(--font-sans)",
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        letterSpacing: "-0.01em",
        boxShadow: T.shadow,
        backgroundColor: T.card,
      }}
    >
      {children}
    </motion.button>
  );
}

/* ── Form Field ─────────────────────────────────────────────── */
interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  suffix?: string;
}
export function FormField({ label, hint, suffix, ...rest }: FormFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, fontFamily: "var(--font-sans)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", background: T.card, borderRadius: T.radius.md, border: `1px solid ${T.border}`, overflow: "hidden", boxShadow: T.shadow }}>
        <input
          {...rest}
          style={{
            flex: 1,
            padding: "13px 14px",
            background: "none",
            border: "none",
            outline: "none",
            fontSize: 15,
            fontFamily: "var(--font-sans)",
            color: T.fg,
            ...rest.style,
          }}
        />
        {suffix && (
          <span style={{ padding: "0 14px 0 0", fontSize: 14, fontWeight: 600, color: T.muted, fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>{suffix}</span>
        )}
      </div>
      {hint && <p style={{ fontSize: 11, color: T.muted, fontFamily: "var(--font-sans)" }}>{hint}</p>}
    </div>
  );
}

/* ── Select Field ───────────────────────────────────────────── */
export function SelectField({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: T.muted, fontFamily: "var(--font-sans)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {label}
      </label>
      <div style={{ background: T.card, borderRadius: T.radius.md, border: `1px solid ${T.border}`, boxShadow: T.shadow, overflow: "hidden" }}>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: "100%", padding: "13px 14px", background: "none", border: "none", outline: "none", fontSize: 15, fontFamily: "var(--font-sans)", color: T.fg, cursor: "pointer", appearance: "none" }}
        >
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}

/* ── Summary Card ───────────────────────────────────────────── */
export function SummaryCard({ label, value, delta, up, icon, accentColor, accentBg }: {
  label: string; value: string; delta: string; up: boolean;
  icon: ReactNode; accentColor: string; accentBg: string;
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      style={{ background: T.card, borderRadius: T.radius.lg, border: `1px solid ${T.border}`, padding: "14px", cursor: "pointer", boxShadow: T.shadow }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {icon}
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: up ? T.green : T.orange, background: up ? T.greenBg : T.orangeBg, padding: "2px 7px", borderRadius: 6, fontFamily: "var(--font-mono)" }}>{delta}</span>
      </div>
      <p style={{ fontSize: 17, fontWeight: 800, color: T.fg, letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 3 }}>{value}</p>
      <p style={{ fontSize: 11, color: T.muted, fontWeight: 500 }}>{label}</p>
    </motion.div>
  );
}

/* ── Activity Item ──────────────────────────────────────────── */
export function ActivityItem({ icon, label, sub, time, iconColor, iconBg, isLast }: {
  icon: ReactNode; label: string; sub: string; time: string;
  iconColor: string; iconBg: string; isLast?: boolean;
}) {
  return (
    <motion.div
      whileTap={{ backgroundColor: T.cardAlt }}
      style={{ padding: "14px 16px", borderBottom: isLast ? "none" : `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
    >
      <div style={{ width: 38, height: 38, borderRadius: 12, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: T.fg, marginBottom: 2, lineHeight: 1.2 }}>{label}</p>
        <p style={{ fontSize: 11, color: T.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: T.muted, fontFamily: "var(--font-mono)" }}>{time}</span>
      </div>
    </motion.div>
  );
}

/* ── AI Draft Card ──────────────────────────────────────────── */
export function AIDraftCard({ title, lines, onConfirm, onEdit }: {
  title: string; lines: { label: string; value: string }[];
  onConfirm: () => void; onEdit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ background: T.card, borderRadius: T.radius.xl, border: `1.5px solid rgba(27,31,94,0.12)`, padding: "16px", boxShadow: T.shadowMd, margin: "8px 0" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.online }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: T.navy, fontFamily: "var(--font-sans)" }}>Nexis entendeu: {title}</span>
      </div>
      <div style={{ background: T.bg, borderRadius: T.radius.md, padding: "12px 14px", marginBottom: 12 }}>
        {lines.map(l => (
          <div key={l.label} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
            <span style={{ fontSize: 12, color: T.muted }}>{l.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.fg }}>{l.value}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: T.muted, marginBottom: 12, lineHeight: 1.5 }}>
        Confira os dados. O registro só será salvo depois de confirmar.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <motion.button whileTap={{ scale: 0.95 }} onClick={onConfirm} style={{ flex: 1, padding: "12px", borderRadius: T.radius.md, background: T.navy, color: "#fff", border: "none", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          ✓ Confirmar e salvar
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={onEdit} style={{ padding: "12px 16px", borderRadius: T.radius.md, background: T.bg, color: T.navy, border: `1px solid ${T.border}`, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          Editar
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── Section Header ─────────────────────────────────────────── */
export function SectionHeader({ label, action, onAction }: { label: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>{label}</p>
      {action && <span onClick={onAction} style={{ fontSize: 11, fontWeight: 600, color: T.navyMd, fontFamily: "var(--font-sans)", cursor: "pointer" }}>{action} →</span>}
    </div>
  );
}

/* ── Stat Row ───────────────────────────────────────────────── */
export function StatRow({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
      <span style={{ fontSize: 13, color: T.muted, fontFamily: "var(--font-sans)" }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: accent || T.fg, fontFamily: "var(--font-sans)" }}>{value}</span>
    </div>
  );
}

/* ── Screen Wrapper (scrollable content area) ───────────────── */
export function ScreenBody({ children, noPad }: { children: ReactNode; noPad?: boolean }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: T.bg, padding: noPad ? 0 : `16px ${T.px}px 24px` }}>
      {children}
    </div>
  );
}

/* ── Divider ────────────────────────────────────────────────── */
export function Divider() {
  return <div style={{ height: 1, background: T.border, margin: "4px 0" }} />;
}

/* ── Empty State ────────────────────────────────────────────── */
export function EmptyState({ icon, message }: { icon: ReactNode; message: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", gap: 12 }}>
      <div style={{ width: 56, height: 56, borderRadius: 18, background: T.card, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <p style={{ fontSize: 14, color: T.muted, textAlign: "center", lineHeight: 1.5 }}>{message}</p>
    </div>
  );
}
