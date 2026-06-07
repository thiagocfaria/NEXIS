import { motion } from "motion/react";
import { Mic, TrendingUp, AlertCircle, Target, ShoppingCart, DollarSign, Package, TrendingDown, ChevronRight } from "lucide-react";

/* ─── tokens ─────────────────────────────────────────────────── */
const T = {
  navy:    "#1B1F5E",
  navyMd:  "#2D3280",
  lime:    "#C8FF47",
  bg:      "#EEF2FA",
  card:    "#FFFFFF",
  muted:   "#8891B8",
  border:  "rgba(27,31,94,0.07)",
  shadow:  "0 2px 16px rgba(27,31,94,0.08), 0 1px 4px rgba(27,31,94,0.04)",
  shadowMd:"0 4px 24px rgba(27,31,94,0.10), 0 1px 6px rgba(27,31,94,0.05)",
};

const chips = [
  "Quanto vendi hoje?",
  "Produtos com estoque baixo",
  "Registrar venda",
  "Cadastrar produto",
];

const metrics = [
  { label: "Vendas",        value: "R$ 4.280", delta: "+12%", up: true,  icon: ShoppingCart, accent: "#1B1F5E", accentBg: "#ECEEFF" },
  { label: "Lucro líquido", value: "R$ 3.140", delta: "+18%", up: true,  icon: DollarSign,   accent: "#0A9B6E", accentBg: "#E6F9F2" },
  { label: "Despesas",      value: "R$ 1.140", delta: "-3%",  up: false, icon: TrendingDown,  accent: "#E05B1A", accentBg: "#FEF0E8" },
  { label: "Estoque",       value: "247 itens", delta: "+5",  up: true,  icon: Package,       accent: "#7B3FE4", accentBg: "#F0EAFF" },
];

const activities = [
  { icon: TrendingUp,   label: "Venda registrada",  sub: "Água Mineral 500ml · 12 un.",  time: "5 min",  iconColor: "#0A9B6E", iconBg: "#E6F9F2" },
  { icon: AlertCircle,  label: "Estoque crítico",    sub: "Detergente Neutro · 3 un.",    time: "22 min", iconColor: "#E05B1A", iconBg: "#FEF0E8" },
  { icon: Target,       label: "Meta atingida",      sub: "R$ 4.280 em vendas hoje",      time: "1 h",    iconColor: "#7B3FE4", iconBg: "#F0EAFF" },
];

/* ═══════════════════════════════════════════════════════════════
   NexisHomeContent — 375 px, light mode
═══════════════════════════════════════════════════════════════ */
export function NexisHomeContent() {
  return (
    <div
      style={{
        width: 375,
        background: T.bg,
        borderRadius: 28,
        overflow: "hidden",
        border: `1px solid ${T.border}`,
        boxShadow: T.shadowMd,
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* ── inner scroll area ─────────────────────────────── */}
      <div
        style={{
          padding: "28px 20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >

        {/* 1 ── SAUDAÇÃO ───────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <p
            style={{
              fontSize: 14,
              color: T.muted,
              marginBottom: 4,
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            Olá, Lucas 👋
          </p>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: T.navy,
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
            }}
          >
            O que você quer<br />fazer hoje?
          </h1>
        </motion.div>

        {/* 2 ── CARD "FALAR COM NEXIS" ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 22 }}
          style={{
            background: T.navy,
            borderRadius: 22,
            padding: "20px",
            position: "relative",
            overflow: "hidden",
            boxShadow: `0 8px 28px rgba(27,31,94,0.28)`,
          }}
        >
          {/* decorative glows */}
          <div style={{ position: "absolute", top: -28, right: -18, width: 90, height: 90, borderRadius: "50%", background: "rgba(200,255,71,0.13)", filter: "blur(18px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -20, left: 8, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,217,61,0.08)", filter: "blur(14px)", pointerEvents: "none" }} />

          {/* label row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            {/* mini mascot mark */}
            <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="3.5" height="16" rx="1.75" fill="white"/>
                <polygon points="6.5,4 10,4 21,20 17.5,20" fill="#C8FF47"/>
                <rect x="17.5" y="4" width="3.5" height="16" rx="1.75" fill="white"/>
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.95)", letterSpacing: "0.01em" }}>Falar com Nexis</span>
            <span style={{
              marginLeft: "auto",
              fontSize: 9,
              fontWeight: 700,
              color: T.lime,
              background: "rgba(200,255,71,0.12)",
              border: "1px solid rgba(200,255,71,0.28)",
              padding: "2px 8px",
              borderRadius: 6,
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
            }}>IA</span>
          </div>

          {/* input mock */}
          <div style={{
            borderRadius: 14,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.13)",
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}>
            <span style={{ flex: 1, fontSize: 13, color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-sans)" }}>
              Digite um comando ou pergunta…
            </span>
            {/* mic button */}
            <motion.div
              whileTap={{ scale: 0.88 }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 11,
                background: T.lime,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                cursor: "pointer",
                boxShadow: `0 2px 10px rgba(200,255,71,0.4)`,
              }}
            >
              <Mic size={16} color={T.navy} strokeWidth={2.2} />
            </motion.div>
          </div>

          {/* suggestion chips */}
          <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 2 }}>
            {chips.map(chip => (
              <motion.button
                key={chip}
                whileTap={{ scale: 0.93 }}
                style={{
                  padding: "6px 12px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.72)",
                  fontSize: 11,
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                {chip}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 3 ── GRID DE MÉTRICAS ───────────────────────────── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Resumo de hoje</p>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.navyMd, fontFamily: "var(--font-sans)" }}>Ver tudo →</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14 + i * 0.06, type: "spring", stiffness: 280, damping: 22 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    background: T.card,
                    borderRadius: 18,
                    border: `1px solid ${T.border}`,
                    padding: "14px 14px 12px",
                    cursor: "pointer",
                    boxShadow: T.shadow,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                  }}
                >
                  {/* icon + delta row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: m.accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={15} color={m.accent} strokeWidth={2} />
                    </div>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: m.up ? "#0A9B6E" : "#E05B1A",
                      background: m.up ? "#E6F9F2" : "#FEF0E8",
                      padding: "2px 7px",
                      borderRadius: 6,
                      fontFamily: "var(--font-mono)",
                      letterSpacing: "0.02em",
                    }}>
                      {m.delta}
                    </span>
                  </div>
                  {/* value */}
                  <p style={{ fontSize: 17, fontWeight: 800, color: T.navy, letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 3 }}>
                    {m.value}
                  </p>
                  {/* label */}
                  <p style={{ fontSize: 11, color: T.muted, fontFamily: "var(--font-sans)", fontWeight: 500 }}>
                    {m.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 4 ── ATIVIDADE RECENTE ──────────────────────────── */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Atividade recente</p>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.navyMd, fontFamily: "var(--font-sans)" }}>Ver tudo →</span>
          </div>

          <div style={{
            background: T.card,
            borderRadius: 20,
            border: `1px solid ${T.border}`,
            overflow: "hidden",
            boxShadow: T.shadow,
          }}>
            {activities.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.28 + i * 0.07 }}
                  whileTap={{ scale: 0.99, background: "#F6F8FF" }}
                  style={{
                    padding: "14px 16px",
                    borderBottom: i < activities.length - 1
                      ? `1px solid ${T.border}`
                      : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                  }}
                >
                  {/* icon */}
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: a.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={16} color={a.iconColor} strokeWidth={2} />
                  </div>

                  {/* text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: T.navy, marginBottom: 2, lineHeight: 1.2 }}>
                      {a.label}
                    </p>
                    <p style={{ fontSize: 11, color: T.muted, fontFamily: "var(--font-sans)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {a.sub}
                    </p>
                  </div>

                  {/* time + chevron */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, color: T.muted, fontFamily: "var(--font-mono)" }}>{a.time}</span>
                    <ChevronRight size={13} color={T.muted} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
