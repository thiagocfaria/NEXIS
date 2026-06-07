import { motion } from "motion/react";
import { Mic, ShoppingCart, DollarSign, Package, TrendingDown, TrendingUp, AlertCircle, Target } from "lucide-react";
import { useState } from "react";
import { T, NavigateFn } from "../tokens";
import { HomeHeader } from "../components/NexisHeader";
import { BottomNav } from "../components/BottomNav";
import { SummaryCard, ActivityItem, SectionHeader, ScreenBody } from "../components/UIKit";

const CHIPS = ["Quanto vendi hoje?", "Produtos com estoque baixo", "Registrar venda", "Cadastrar produto"];

const METRICS = [
  { label: "Vendas",        value: "R$ 4.280", delta: "+12%", up: true,  Icon: ShoppingCart, ac: T.navy,   ab: "#ECEEFF" },
  { label: "Lucro líquido", value: "R$ 3.140", delta: "+18%", up: true,  Icon: DollarSign,   ac: T.green,  ab: T.greenBg },
  { label: "Despesas",      value: "R$ 1.140", delta: "-3%",  up: false, Icon: TrendingDown,  ac: T.orange, ab: T.orangeBg },
  { label: "Estoque",       value: "247 itens", delta: "+5",  up: true,  Icon: Package,       ac: T.purple, ab: T.purpleBg },
];

const ACTIVITIES = [
  { Icon: TrendingUp,  label: "Venda registrada",  sub: "Água Mineral 500ml · 12 un.",  time: "5 min",  ic: T.green,  ib: T.greenBg },
  { Icon: AlertCircle, label: "Estoque crítico",    sub: "Detergente Neutro · 3 un.",    time: "22 min", ic: T.orange, ib: T.orangeBg },
  { Icon: Target,      label: "Meta atingida",      sub: "R$ 4.280 em vendas hoje",      time: "1 h",    ic: T.purple, ib: T.purpleBg },
];

export function HomeScreen({ navigate }: { navigate: NavigateFn }) {
  const [dark, setDark] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <HomeHeader dark={dark} onToggleDark={() => setDark(!dark)} />

      <ScreenBody>
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }} style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 4, fontWeight: 500 }}>Olá, Lucas 👋</p>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: T.navy, letterSpacing: "-0.025em", lineHeight: 1.2 }}>
            O que você quer<br />fazer hoje?
          </h1>
        </motion.div>

        {/* Nexis chat card */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 22 }}
          onClick={() => navigate("chat")}
          style={{ background: T.navy, borderRadius: T.radius.xl, padding: "18px", position: "relative", overflow: "hidden", boxShadow: `0 8px 28px rgba(27,31,94,0.28)`, marginBottom: 20, cursor: "pointer" }}
        >
          <div style={{ position: "absolute", top: -28, right: -18, width: 90, height: 90, borderRadius: "50%", background: "rgba(200,255,71,0.13)", filter: "blur(18px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -20, left: 8, width: 70, height: 70, borderRadius: "50%", background: "rgba(255,217,61,0.08)", filter: "blur(14px)", pointerEvents: "none" }} />

          {/* card label */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(200,255,71,0.15)", border: "1px solid rgba(200,255,71,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L8.5 5H13L9.5 7.5L11 12L7 9.5L3 12L4.5 7.5L1 5H5.5L7 1Z" fill="#C8FF47"/>
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.95)" }}>Falar com Nexis</span>
            <span style={{ marginLeft: "auto", fontSize: 9, fontWeight: 700, color: T.lime, background: "rgba(200,255,71,0.12)", border: "1px solid rgba(200,255,71,0.28)", padding: "2px 8px", borderRadius: 6, fontFamily: "var(--font-mono)" }}>IA ATIVA</span>
          </div>

          {/* input mock */}
          <div style={{ borderRadius: T.radius.md, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.13)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ flex: 1, fontSize: 13, color: "rgba(255,255,255,0.38)" }}>Digite um comando ou pergunta…</span>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: T.lime, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 10px rgba(200,255,71,0.4)" }}>
              <Mic size={16} color={T.navy} strokeWidth={2.2} />
            </div>
          </div>

          {/* chips */}
          <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 2 }}>
            {CHIPS.map(chip => (
              <motion.button key={chip} whileTap={{ scale: 0.93 }} onClick={e => { e.stopPropagation(); navigate("chat"); }} style={{ padding: "6px 12px", borderRadius: 10, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.72)", fontSize: 11, whiteSpace: "nowrap", cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                {chip}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Metrics */}
        <SectionHeader label="Resumo de hoje" action="Ver tudo" onAction={() => navigate("reports")} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {METRICS.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.05 }}>
              <SummaryCard label={m.label} value={m.value} delta={m.delta} up={m.up} accentColor={m.ac} accentBg={m.ab} icon={<m.Icon size={15} color={m.ac} strokeWidth={2} />} />
            </motion.div>
          ))}
        </div>

        {/* Activity */}
        <SectionHeader label="Atividade recente" />
        <div style={{ background: T.card, borderRadius: T.radius.xl, border: `1px solid ${T.border}`, overflow: "hidden", boxShadow: T.shadow }}>
          {ACTIVITIES.map((a, i) => (
            <ActivityItem key={a.label} icon={<a.Icon size={16} color={a.ic} strokeWidth={2} />} label={a.label} sub={a.sub} time={a.time} iconColor={a.ic} iconBg={a.ib} isLast={i === ACTIVITIES.length - 1} />
          ))}
        </div>
      </ScreenBody>

      <BottomNav active="home" navigate={navigate} />
    </div>
  );
}
