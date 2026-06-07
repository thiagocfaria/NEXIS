import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Bell, Sun, Moon, Home, Package, Plus, AlertCircle, User } from "lucide-react";

/* ─── shared tokens ─────────────────────────────────────────── */
const T = {
  navy:     "#1B1F5E",
  navySoft: "#2D3280",
  lime:     "#C8FF47",
  limeD:    "#A3D933",
  bgPage:   "#EEF2FA",       // azul acinzentado bem claro
  bgCard:   "#FFFFFF",
  muted:    "#8891B8",
  border:   "rgba(27,31,94,0.09)",
  shadow:   "rgba(27,31,94,0.10)",
  green:    "#22C55E",
};

/* ══════════════════════════════════════════════════════════════
   1 — NEXIS HEADER
══════════════════════════════════════════════════════════════ */
export function NexisHeader() {
  const [dark, setDark] = useState(false);

  return (
    <div
      style={{
        width: 375,
        background: dark ? "#0D1035" : T.bgCard,
        borderRadius: 20,
        border: `1px solid ${T.border}`,
        boxShadow: `0 4px 24px ${T.shadow}`,
        overflow: "hidden",
        transition: "background 0.3s",
      }}
    >
      {/* Status bar mock */}
      <div
        style={{
          height: 44,
          background: dark ? "#0D1035" : T.bgCard,
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.3s",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: dark ? "#E8ECFF" : T.navy, fontFamily: "var(--font-sans)" }}>9:41</span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {/* wifi */}
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
            <path d="M7.5 2.5C9.2 2.5 10.7 3.1 11.8 4.1L13.1 2.8C11.7 1.4 9.7.6 7.5.6S3.3 1.4 1.9 2.8L3.2 4.1C4.3 3.1 5.8 2.5 7.5 2.5Z" fill={dark ? "rgba(232,236,255,.6)" : T.muted}/>
            <path d="M7.5 5.5c1.1 0 2.1.4 2.8 1.1L11.7 5C10.6 3.9 9.1 3.2 7.5 3.2S4.4 3.9 3.3 5L4.7 6.6C5.4 5.9 6.4 5.5 7.5 5.5Z" fill={dark ? "rgba(232,236,255,.75)" : T.muted}/>
            <circle cx="7.5" cy="9.5" r="1.5" fill={dark ? "#E8ECFF" : T.navy}/>
          </svg>
          {/* battery */}
          <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
            <rect x=".5" y=".5" width="18" height="10" rx="2.5" stroke={dark ? "rgba(232,236,255,.4)" : "rgba(27,31,94,.3)"}/>
            <rect x="2" y="2" width="13" height="7" rx="1.5" fill={dark ? "#E8ECFF" : T.navy}/>
            <path d="M20 3.5v4a1.5 1.5 0 000-4Z" fill={dark ? "rgba(232,236,255,.4)" : "rgba(27,31,94,.3)"}/>
          </svg>
        </div>
      </div>

      {/* Header content */}
      <div
        style={{
          padding: "10px 20px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: dark ? "#0D1035" : T.bgCard,
          transition: "background 0.3s",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Mascot mark */}
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 13,
              background: T.navy,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 3px 10px ${T.shadow}`,
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="20" height="20" rx="6" fill="#1B1F5E"/>
              <rect x="6.5" y="6" width="2.8" height="12" rx="1.4" fill="white"/>
              <rect x="14.7" y="6" width="2.8" height="12" rx="1.4" fill="white"/>
              <path d="M6.5 6 L17.5 18" stroke="#C8FF47" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Wordmark + status */}
          <div>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.035em",
                color: dark ? "#E8ECFF" : T.navy,
                fontFamily: "var(--font-sans)",
                lineHeight: 1,
                display: "block",
              }}
            >
              Nexis
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.green,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.07em",
                }}
              >
                IA ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Bell */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 13,
              background: dark ? "rgba(255,255,255,0.06)" : T.bgPage,
              border: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
            }}
          >
            <Bell size={17} color={dark ? "#8891B8" : T.muted} />
            <div
              style={{
                position: "absolute",
                top: 8,
                right: 9,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#FF4757",
                border: `2px solid ${dark ? "#0D1035" : T.bgCard}`,
              }}
            />
          </motion.button>

          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setDark(!dark)}
            style={{
              width: 68,
              height: 36,
              borderRadius: 18,
              background: dark ? "#1E2260" : T.bgPage,
              border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : T.border}`,
              padding: 4,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Track labels */}
            <span
              style={{
                position: "absolute",
                left: dark ? 10 : "auto",
                right: dark ? "auto" : 9,
                fontSize: 8,
                fontWeight: 800,
                color: dark ? T.lime : T.muted,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
                transition: "all 0.3s",
                pointerEvents: "none",
              }}
            >
              {dark ? "ESC" : "LUZ"}
            </span>
            {/* Thumb */}
            <motion.div
              animate={{ x: dark ? 32 : 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                background: dark ? T.lime : T.navy,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                flexShrink: 0,
              }}
            >
              {dark
                ? <Moon size={13} color={T.navy} />
                : <Sun size={13} color="#fff" />
              }
            </motion.div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   2 — BOTTOM NAVIGATION BAR
══════════════════════════════════════════════════════════════ */
const navItems = [
  { id: "home",    Icon: Home,          label: "Início" },
  { id: "products",Icon: Package,       label: "Produtos" },
  { id: "fab",     Icon: Plus,          label: null },        // central FAB
  { id: "alerts",  Icon: AlertCircle,   label: "Alertas",  badge: true },
  { id: "profile", Icon: User,          label: "Perfil" },
];

export function NexisBottomNav() {
  const [active, setActive] = useState("home");
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <div style={{ width: 375, position: "relative", paddingBottom: 28 }}>
      {/* FAB pop-up actions */}
      <AnimatePresence>
        {fabOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFabOpen(false)}
              style={{
                position: "absolute", inset: 0, borderRadius: 20,
                background: "rgba(27,31,94,0.18)", backdropFilter: "blur(3px)", zIndex: 5,
              }}
            />
            {[
              { label: "Nova venda",    color: "#0A9B6E", bg: "#D6F5EC", angle: -130 },
              { label: "Add produto",   color: T.navy,    bg: "#E8EAFF", angle: -90 },
              { label: "Lançar gasto",  color: "#E05B1A", bg: "#FFF0E6", angle: -50 },
            ].map(({ label, color, bg, angle }, i) => {
              const rad = (angle * Math.PI) / 180;
              const r = 72;
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    x: Math.cos(rad) * r,
                    y: Math.sin(rad) * r - 10,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 340, damping: 22, delay: i * 0.04 }}
                  style={{
                    position: "absolute",
                    bottom: 56,
                    left: "50%",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                    transform: "translateX(-50%)",
                  }}
                >
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setFabOpen(false)}
                    style={{
                      width: 48, height: 48, borderRadius: 15, background: bg,
                      border: "none", cursor: "pointer",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Plus size={20} color={color} />
                  </motion.button>
                  <span
                    style={{
                      fontSize: 10, fontWeight: 700, color: T.navy,
                      fontFamily: "var(--font-sans)",
                      background: "rgba(255,255,255,0.95)",
                      padding: "2px 8px", borderRadius: 6,
                      whiteSpace: "nowrap",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.10)",
                    }}
                  >
                    {label}
                  </span>
                </motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Nav bar */}
      <div
        style={{
          width: "100%",
          height: 68,
          borderRadius: 28,
          background: T.bgCard,
          border: `1px solid ${T.border}`,
          boxShadow: `0 8px 28px ${T.shadow}, 0 2px 8px rgba(27,31,94,0.06)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 10px",
          position: "relative",
          zIndex: 20,
        }}
      >
        {navItems.map(({ id, Icon, label, badge }) => {
          const isFab = id === "fab";
          const isActive = active === id && !isFab;

          if (isFab) {
            return (
              <div key={id} style={{ display: "flex", justifyContent: "center", flex: 1 }}>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setFabOpen(!fabOpen)}
                  animate={{
                    rotate: fabOpen ? 45 : 0,
                    background: fabOpen ? T.limeD : T.navy,
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: -22,
                    boxShadow: `0 6px 20px rgba(27,31,94,0.35)`,
                  }}
                >
                  <Plus size={24} color={fabOpen ? T.navy : "#fff"} strokeWidth={2.5} />
                </motion.button>
              </div>
            );
          }

          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.84 }}
              onClick={() => setActive(id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 0",
                position: "relative",
              }}
            >
              {/* Active pill background */}
              {isActive && (
                <motion.div
                  layoutId="navPill"
                  style={{
                    position: "absolute",
                    top: 4,
                    width: 40,
                    height: 40,
                    borderRadius: 13,
                    background: "#EEF2FA",
                  }}
                />
              )}

              <div style={{ position: "relative" }}>
                <Icon
                  size={21}
                  color={isActive ? T.navy : T.muted}
                  strokeWidth={isActive ? 2.2 : 1.7}
                />
                {badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: -2,
                      right: -3,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#FF4757",
                      border: "1.5px solid #fff",
                    }}
                  />
                )}
              </div>

              {label && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? T.navy : T.muted,
                    fontFamily: "var(--font-sans)",
                    lineHeight: 1,
                    position: "relative",
                  }}
                >
                  {label}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
