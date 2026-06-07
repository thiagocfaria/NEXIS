import { motion } from "motion/react";
import { useState } from "react";
import {
  Package, ArrowDownCircle, TrendingUp, AlertTriangle,
  MessageCircle, ChevronRight, Bell, Search,
  TrendingDown, DollarSign, Layers, ShoppingCart
} from "lucide-react";

const actions = [
  { icon: Package,       label: "Adicionar ao estoque",     sub: "Registre novas entradas",       color: "#00D4AA", bg: "rgba(0,212,170,0.12)" },
  { icon: ArrowDownCircle, label: "Dar baixa no estoque",   sub: "Registre saídas e vendas",      color: "#818CF8", bg: "rgba(129,140,248,0.12)" },
  { icon: TrendingUp,    label: "Aumentar o estoque",       sub: "Ajuste quantidades manualmente", color: "#FF6B35", bg: "rgba(255,107,53,0.12)" },
  { icon: AlertTriangle, label: "Solucionar gasto do negócio", sub: "Registre despesas",          color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  { icon: MessageCircle, label: "Chat por texto simples",   sub: "Mensagens e suporte",           color: "#EC4899", bg: "rgba(236,72,153,0.12)" },
];

const metrics = [
  { label: "Vendas hoje",   value: "R$ 4.280",  delta: "+12%", up: true,  icon: ShoppingCart, color: "#00D4AA" },
  { label: "Despesas",      value: "R$ 1.140",  delta: "-3%",  up: false, icon: TrendingDown, color: "#FF4757" },
  { label: "Lucro líquido", value: "R$ 3.140",  delta: "+18%", up: true,  icon: DollarSign,   color: "#818CF8" },
  { label: "Em estoque",    value: "247 itens",  delta: "+5",   up: true,  icon: Layers,       color: "#FF6B35" },
];

const monthMetrics = [
  { label: "Vendas no mês",    value: "R$ 38.460", sub: "18 vendas realizadas" },
  { label: "Lucro bruto",      value: "R$ 14.220", sub: "Veja detalhes do lucro" },
  { label: "Despesas",         value: "R$ 9.340",  sub: "Controle de despesas" },
  { label: "Lucro líquido",    value: "R$ 4.880",  sub: "Lucro líquido do mês" },
];

export function HomeScreen() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--background)", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ padding: "8px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 2, fontFamily: "var(--font-sans)" }}>Bom dia, Lucas 👋</p>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", fontFamily: "var(--font-sans)", lineHeight: 1.2 }}>Hoje no negócio</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <motion.button whileTap={{ scale: 0.9 }} style={{ width: 38, height: 38, borderRadius: 12, background: "var(--card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Search size={16} color="var(--muted-foreground)" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} style={{ width: 38, height: 38, borderRadius: 12, background: "var(--card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }}>
            <Bell size={16} color="var(--muted-foreground)" />
            <div style={{ position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: "50%", background: "#FF4757", border: "1.5px solid var(--background)" }} />
          </motion.button>
        </div>
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 24, paddingBottom: 100 }}>
        {/* Quick Actions */}
        <section>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontFamily: "var(--font-mono)" }}>Ações rápidas</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {actions.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, type: "spring", stiffness: 280, damping: 22 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    background: "var(--card)",
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={a.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)", marginBottom: 1, fontFamily: "var(--font-sans)" }}>{a.label}</p>
                    <p style={{ fontSize: 12, color: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }}>{a.sub}</p>
                  </div>
                  <ChevronRight size={16} color="var(--muted-foreground)" />
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, borderRadius: "0 2px 2px 0", background: a.color, opacity: 0.7 }} />
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Today Metrics */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Hoje</p>
            <span style={{ fontSize: 11, color: "var(--primary)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>Ver relatório →</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.07, type: "spring", stiffness: 260, damping: 22 }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: "14px 14px",
                    background: "var(--card)",
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={15} color={m.color} />
                    </div>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: m.up ? "#00D4AA" : "#FF4757",
                      background: m.up ? "rgba(0,212,170,0.12)" : "rgba(255,71,87,0.12)",
                      padding: "2px 6px",
                      borderRadius: 6,
                      fontFamily: "var(--font-mono)",
                    }}>{m.delta}</span>
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "var(--foreground)", fontFamily: "var(--font-sans)", lineHeight: 1.1, marginBottom: 2 }}>{m.value}</p>
                  <p style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }}>{m.label}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Month Overview */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Este mês</p>
            <span style={{ fontSize: 11, color: "var(--primary)", fontFamily: "var(--font-sans)", fontWeight: 600 }}>Junho 2026 →</span>
          </div>
          <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", overflow: "hidden" }}>
            {monthMetrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                style={{
                  padding: "16px 18px",
                  borderBottom: i < monthMetrics.length - 1 ? "1px solid var(--border)" : "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 2, fontFamily: "var(--font-sans)" }}>{m.label}</p>
                  <p style={{ fontSize: 17, fontWeight: 700, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>{m.value}</p>
                </div>
                <ChevronRight size={15} color="var(--muted-foreground)" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Low stock alert */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            padding: "16px 18px",
            background: "rgba(245,158,11,0.08)",
            borderRadius: 16,
            border: "1px solid rgba(245,158,11,0.25)",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertTriangle size={16} color="#F59E0B" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#F59E0B", marginBottom: 2, fontFamily: "var(--font-sans)" }}>2 produtos acabando</p>
            <p style={{ fontSize: 12, color: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }}>Adicione itens ao estoque agora para evitar ruptura</p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Nav */}
      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

const navItems = [
  { id: "home",     icon: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",  label: "Início" },
  { id: "stock",    icon: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8L6 7h12l-2-4z", label: "Estoque" },
  { id: "sales",    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14H11v-2h2v2zm0-4H11V7h2v5z", label: "Vendas" },
  { id: "reports",  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", label: "Relatórios" },
];

function BottomNav({ active, onChange }: { active: string; onChange: (v: string) => void }) {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
      width: 375,
      padding: "12px 24px 28px",
      background: "rgba(13,15,20,0.95)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid var(--border)",
      display: "flex",
      justifyContent: "space-around",
      zIndex: 50,
    }}>
      {navItems.map((item) => {
        const isActive = active === item.id;
        return (
          <motion.button
            key={item.id}
            onClick={() => onChange(item.id)}
            whileTap={{ scale: 0.85 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "4px 10px" }}
          >
            <motion.div
              animate={{ scale: isActive ? 1.15 : 1 }}
              style={{
                width: 42, height: 42, borderRadius: 14,
                background: isActive ? "rgba(0,212,170,0.15)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth={isActive ? 2.2 : 1.8} stroke={isActive ? "var(--primary)" : "var(--muted-foreground)"}>
                <path d={item.icon} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, color: isActive ? "var(--primary)" : "var(--muted-foreground)", fontFamily: "var(--font-sans)" }}>{item.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
