import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Mic, Keyboard, Sun, Moon, Home, Grid, Bell,
  User, Plus, X, Zap, Package, BarChart2,
  MessageSquare, Settings, ChevronRight, TrendingUp,
  ShoppingCart, AlertCircle, ArrowUpRight
} from "lucide-react";

/* ─── palette ───────────────────────────────────────── */
const C = {
  navy:   "#1B1F5E",
  navyMd: "#2D3280",
  lime:   "#C8FF47",
  limeD:  "#A3D933",
  yellow: "#FFD93D",
  bg:     "#F0F4FF",
  bgCard: "#FFFFFF",
  muted:  "#8891B8",
  border: "rgba(27,31,94,0.08)",
  shadow: "rgba(27,31,94,0.12)",
};

/* ─── quick-action FAB items ────────────────────────── */
const fabActions = [
  { icon: Package,     label: "Estoque",   color: C.navy,   bg: "#E8EAFF" },
  { icon: ShoppingCart,label: "Venda",     color: "#0A9B6E",bg: "#D6F5EC" },
  { icon: BarChart2,   label: "Relatório", color: "#7B3FE4",bg: "#EDE8FF" },
  { icon: MessageSquare,label:"Suporte",   color: "#E05B1A",bg: "#FFF0E6" },
];

/* ─── recent activity ───────────────────────────────── */
const activities = [
  { icon: TrendingUp,   label: "Venda registrada",     sub: "Água Mineral 500ml · 12 un.",  time: "5 min",  color: "#0A9B6E", bg: "#D6F5EC" },
  { icon: AlertCircle,  label: "Estoque crítico",       sub: "Detergente · 3 unidades",       time: "22 min", color: "#E05B1A", bg: "#FFF0E6" },
  { icon: ArrowUpRight, label: "Meta atingida",         sub: "R$ 4.280 em vendas hoje",       time: "1 h",    color: "#7B3FE4", bg: "#EDE8FF" },
];

/* ─── suggestion chips ──────────────────────────────── */
const chips = [
  "Quanto vendi hoje?",
  "Produtos com estoque baixo",
  "Lançar despesa",
  "Gerar relatório semanal",
];

export function NexisHome() {
  const [dark, setDark]         = useState(false);
  const [fabOpen, setFabOpen]   = useState(false);
  const [voiceActive, setVoice] = useState(false);
  const [navTab, setNavTab]     = useState("home");
  const [inputFocus, setInputFocus] = useState(false);

  const bg      = dark ? "#0D1035" : C.bg;
  const card    = dark ? "#161A4A" : C.bgCard;
  const fg      = dark ? "#E8ECFF" : C.navy;
  const fgMuted = dark ? "#6B75B8" : C.muted;
  const border  = dark ? "rgba(255,255,255,0.07)" : C.border;
  const shadow  = dark ? "rgba(0,0,0,0.35)" : C.shadow;

  return (
    <div style={{ position: "relative", height: "100%", background: bg, display: "flex", flexDirection: "column", transition: "background 0.3s", overflow: "hidden" }}>

      {/* ── Status-safe top spacer already given by MobileFrame ── */}

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <div style={{ padding: "4px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo + mascot */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Mascot SVG — simplified robot based on the image */}
          <div style={{ width: 36, height: 36, borderRadius: 10, background: dark ? "#1E2260" : "#1B1F5E", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: `0 2px 8px ${shadow}` }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="3.5" height="16" rx="1.75" fill="white"/>
              <polygon points="6.5,4 10,4 21,20 17.5,20" fill="#C8FF47"/>
              <rect x="17.5" y="4" width="3.5" height="16" rx="1.75" fill="white"/>
            </svg>
          </div>
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: dark ? "#E8ECFF" : C.navy, fontFamily: "var(--font-sans)", letterSpacing: "-0.03em", lineHeight: 1 }}>Nexis</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.lime }} />
              <span style={{ fontSize: 10, color: fgMuted, fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>IA ONLINE</span>
            </div>
          </div>
        </motion.div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Notification */}
          <motion.button whileTap={{ scale: 0.88 }} style={{ width: 36, height: 36, borderRadius: 11, background: card, border: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative", boxShadow: `0 2px 8px ${shadow}` }}>
            <Bell size={15} color={fgMuted} />
            <div style={{ position: "absolute", top: 7, right: 8, width: 6, height: 6, borderRadius: "50%", background: "#FF4757", border: `1.5px solid ${bg}` }} />
          </motion.button>
          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setDark(!dark)}
            style={{ width: 62, height: 32, borderRadius: 16, background: dark ? C.navy : "#E4E8FF", border: `1px solid ${border}`, display: "flex", alignItems: "center", padding: "3px", cursor: "pointer", position: "relative", boxShadow: `0 2px 8px ${shadow}` }}
          >
            <motion.div
              animate={{ x: dark ? 30 : 0 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              style={{ width: 26, height: 26, borderRadius: 13, background: dark ? C.lime : C.navy, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
            >
              {dark ? <Moon size={13} color={C.navy} /> : <Sun size={13} color="#fff" />}
            </motion.div>
            <motion.span
              animate={{ x: dark ? -30 : 0, opacity: dark ? 0 : 1 }}
              style={{ position: "absolute", right: 8, fontSize: 9, fontWeight: 700, color: fgMuted, fontFamily: "var(--font-mono)" }}
            >LIGHT</motion.span>
          </motion.button>
        </div>
      </div>

      {/* ── GREETING ───────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} style={{ padding: "0 20px 18px" }}>
        <p style={{ fontSize: 13, color: fgMuted, fontFamily: "var(--font-sans)", marginBottom: 2 }}>Olá, Lucas 👋</p>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: fg, fontFamily: "var(--font-sans)", letterSpacing: "-0.02em", lineHeight: 1.15 }}>O que você quer<br/>fazer hoje?</h2>
      </motion.div>

      {/* ── SCROLLABLE BODY ─────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px", display: "flex", flexDirection: "column", gap: 18, paddingBottom: 110 }}>

        {/* ── NEXIS CHAT COMPONENT ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13, type: "spring", stiffness: 260, damping: 22 }}
          style={{
            borderRadius: 24,
            background: dark ? "linear-gradient(135deg, #1E2260 0%, #252A70 100%)" : "linear-gradient(135deg, #1B1F5E 0%, #2D3280 100%)",
            padding: "20px",
            boxShadow: `0 8px 32px ${dark ? "rgba(0,0,0,0.5)" : "rgba(27,31,94,0.22)"}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative glow */}
          <div style={{ position: "absolute", top: -30, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(200,255,71,0.12)", filter: "blur(20px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -20, left: 10, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,217,61,0.08)", filter: "blur(16px)", pointerEvents: "none" }} />

          {/* Label */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(200,255,71,0.15)", border: "1px solid rgba(200,255,71,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={13} color={C.lime} fill={C.lime} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans)", letterSpacing: "0.02em" }}>Falar com Nexis</span>
            <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, color: C.lime, fontFamily: "var(--font-mono)", background: "rgba(200,255,71,0.1)", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(200,255,71,0.25)" }}>IA ATIVA</span>
          </div>

          {/* Input area */}
          <motion.div
            animate={{ boxShadow: inputFocus ? `0 0 0 2px ${C.lime}` : "0 0 0 1px rgba(255,255,255,0.1)" }}
            style={{ borderRadius: 16, background: "rgba(255,255,255,0.07)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}
          >
            <input
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              placeholder="Digite um comando ou pergunta…"
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "rgba(255,255,255,0.9)", fontFamily: "var(--font-sans)", fontSize: 14, caretColor: C.lime }}
            />
            {/* Keyboard icon */}
            <motion.button whileTap={{ scale: 0.85 }} style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(255,255,255,0.08)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <Keyboard size={14} color="rgba(255,255,255,0.6)" />
            </motion.button>
            {/* Mic button */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={() => setVoice(!voiceActive)}
              animate={{ background: voiceActive ? C.lime : "rgba(200,255,71,0.15)" }}
              style={{ width: 36, height: 36, borderRadius: 11, border: `1px solid ${voiceActive ? C.lime : "rgba(200,255,71,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, position: "relative" }}
            >
              <Mic size={15} color={voiceActive ? C.navy : C.lime} />
              {/* pulse rings when active */}
              {voiceActive && (
                <>
                  <motion.div animate={{ scale: [1, 1.7], opacity: [0.4, 0] }} transition={{ duration: 1.2, repeat: Infinity }} style={{ position: "absolute", width: 36, height: 36, borderRadius: 11, border: `1.5px solid ${C.lime}`, pointerEvents: "none" }} />
                  <motion.div animate={{ scale: [1, 2.2], opacity: [0.25, 0] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} style={{ position: "absolute", width: 36, height: 36, borderRadius: 11, border: `1px solid ${C.lime}`, pointerEvents: "none" }} />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Suggestion chips */}
          <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 2 }}>
            {chips.map(chip => (
              <motion.button
                key={chip}
                whileTap={{ scale: 0.94 }}
                style={{ padding: "6px 12px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)", fontSize: 11, fontFamily: "var(--font-sans)", fontWeight: 500, whiteSpace: "nowrap", cursor: "pointer" }}
              >
                {chip}
              </motion.button>
            ))}
          </div>

          {/* Hint row */}
          <p style={{ marginTop: 12, fontSize: 10, color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
            Você pode executar <strong style={{ color: "rgba(200,255,71,0.7)" }}>qualquer ação</strong> do app por voz ou texto — vendas, estoque, relatórios e mais.
          </p>
        </motion.div>

        {/* ── METRICS ROW ──────────────────────────────────────── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: fgMuted, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Resumo de hoje</p>
            <span style={{ fontSize: 11, color: C.navy, fontFamily: "var(--font-sans)", fontWeight: 600, opacity: dark ? 0.7 : 1 }}>Ver tudo →</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Vendas",       value: "R$ 4.280", delta: "+12%", up: true,  accent: C.navy },
              { label: "Lucro líquido",value: "R$ 3.140", delta: "+18%", up: true,  accent: "#0A9B6E" },
              { label: "Despesas",     value: "R$ 1.140", delta: "-3%",  up: false, accent: "#E05B1A" },
              { label: "Em estoque",   value: "247 itens", delta: "+5",  up: true,  accent: "#7B3FE4" },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.06 }}
                whileTap={{ scale: 0.96 }}
                style={{ padding: "14px", background: card, borderRadius: 18, border: `1px solid ${border}`, cursor: "pointer", boxShadow: `0 2px 12px ${shadow}` }}
              >
                <div style={{ width: 8, height: 8, borderRadius: 3, background: m.accent, marginBottom: 10 }} />
                <p style={{ fontSize: 18, fontWeight: 800, color: fg, fontFamily: "var(--font-sans)", lineHeight: 1, marginBottom: 4 }}>{m.value}</p>
                <p style={{ fontSize: 11, color: fgMuted, fontFamily: "var(--font-sans)", marginBottom: 6 }}>{m.label}</p>
                <span style={{ fontSize: 10, fontWeight: 700, color: m.up ? "#0A9B6E" : "#E05B1A", background: m.up ? "#D6F5EC" : "#FFF0E6", padding: "2px 7px", borderRadius: 6, fontFamily: "var(--font-mono)" }}>{m.delta}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── ACTIVITY FEED ─────────────────────────────────────── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: fgMuted, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Atividade recente</p>
          </div>
          <div style={{ background: card, borderRadius: 20, border: `1px solid ${border}`, overflow: "hidden", boxShadow: `0 2px 12px ${shadow}` }}>
            {activities.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ padding: "14px 16px", borderBottom: i < activities.length - 1 ? `1px solid ${border}` : "none", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} color={a.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: fg, fontFamily: "var(--font-sans)", marginBottom: 1 }}>{a.label}</p>
                    <p style={{ fontSize: 11, color: fgMuted, fontFamily: "var(--font-sans)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.sub}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{ fontSize: 10, color: fgMuted, fontFamily: "var(--font-mono)" }}>{a.time}</span>
                    <ChevronRight size={13} color={fgMuted} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── FAB OVERLAY ─────────────────────────────────────────── */}
      <AnimatePresence>
        {fabOpen && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFabOpen(false)}
              style={{ position: "absolute", inset: 0, background: dark ? "rgba(0,0,0,0.55)" : "rgba(27,31,94,0.3)", backdropFilter: "blur(4px)", zIndex: 40 }}
            />
            {/* radial actions */}
            {fabActions.map((a, i) => {
              const Icon = a.icon;
              const angle = -90 + i * 30 - 45; // spread above center
              const rad = (angle * Math.PI) / 180;
              const r = 88;
              const x = Math.cos(rad) * r;
              const y = Math.sin(rad) * r;
              return (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                  animate={{ opacity: 1, x, y, scale: 1 }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                  transition={{ type: "spring", stiffness: 340, damping: 22, delay: i * 0.04 }}
                  style={{ position: "absolute", bottom: 56, left: "50%", transform: "translateX(-50%)", zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}
                >
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setFabOpen(false)}
                    style={{ width: 52, height: 52, borderRadius: 16, background: a.bg, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.18)" }}
                  >
                    <Icon size={22} color={a.color} />
                  </motion.button>
                  <span style={{ fontSize: 10, fontWeight: 700, color: dark ? "#E8ECFF" : C.navy, fontFamily: "var(--font-sans)", background: dark ? "rgba(13,16,53,0.9)" : "rgba(255,255,255,0.95)", padding: "2px 8px", borderRadius: 6, whiteSpace: "nowrap" }}>{a.label}</span>
                </motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* ── FLOATING BOTTOM NAV ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        style={{
          position: "absolute",
          bottom: 20,
          left: 16,
          right: 16,
          height: 66,
          borderRadius: 26,
          background: dark ? "rgba(22,26,74,0.97)" : "rgba(255,255,255,0.97)",
          backdropFilter: "blur(24px)",
          border: `1px solid ${border}`,
          boxShadow: `0 8px 32px ${shadow}, 0 2px 8px ${shadow}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          paddingLeft: 12,
          paddingRight: 12,
          zIndex: 60,
        }}
      >
        {/* Left items */}
        {[
          { id: "home", icon: Home, label: "Início" },
          { id: "grid", icon: Grid, label: "Apps" },
        ].map(item => {
          const Icon = item.icon;
          const active = navTab === item.id;
          return (
            <motion.button key={item.id} whileTap={{ scale: 0.84 }} onClick={() => setNavTab(item.id)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "6px 10px", borderRadius: 14, flex: 1 }}
            >
              <motion.div animate={{ scale: active ? 1.12 : 1 }}>
                <Icon size={20} color={active ? C.navy : fgMuted} strokeWidth={active ? 2.2 : 1.8} />
              </motion.div>
              {active && <motion.div layoutId="navDot" style={{ width: 4, height: 4, borderRadius: 2, background: C.navy }} />}
            </motion.button>
          );
        })}

        {/* Central FAB */}
        <div style={{ position: "relative", display: "flex", justifyContent: "center", flex: 1 }}>
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setFabOpen(!fabOpen)}
            animate={{ rotate: fabOpen ? 45 : 0, background: fabOpen ? C.limeD : C.navy }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            style={{
              width: 54, height: 54, borderRadius: 17, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 20px ${C.navy}55`,
              marginTop: -20,
            }}
          >
            {fabOpen
              ? <X size={22} color={C.navy} strokeWidth={2.5} />
              : <Plus size={22} color="#fff" strokeWidth={2.5} />
            }
          </motion.button>
        </div>

        {/* Right items */}
        {[
          { id: "bell",    icon: Bell,     label: "Alertas" },
          { id: "profile", icon: User,     label: "Perfil" },
        ].map(item => {
          const Icon = item.icon;
          const active = navTab === item.id;
          return (
            <motion.button key={item.id} whileTap={{ scale: 0.84 }} onClick={() => setNavTab(item.id)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "6px 10px", borderRadius: 14, flex: 1, position: "relative" }}
            >
              <Icon size={20} color={active ? C.navy : fgMuted} strokeWidth={active ? 2.2 : 1.8} />
              {item.id === "bell" && <div style={{ position: "absolute", top: 4, right: 10, width: 7, height: 7, borderRadius: "50%", background: "#FF4757", border: `1.5px solid ${dark ? "#161A4A" : "#fff"}` }} />}
              {active && <motion.div layoutId="navDot" style={{ width: 4, height: 4, borderRadius: 2, background: C.navy }} />}
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
