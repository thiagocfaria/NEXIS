import { motion } from "motion/react";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

const weekData = [
  { day: "Seg", vendas: 1200, despesas: 480 },
  { day: "Ter", vendas: 1890, despesas: 620 },
  { day: "Qua", vendas: 980,  despesas: 310 },
  { day: "Qui", vendas: 2400, despesas: 740 },
  { day: "Sex", vendas: 3100, despesas: 890 },
  { day: "Sáb", vendas: 4280, despesas: 1140 },
  { day: "Dom", vendas: 2600, despesas: 540 },
];

const periods = ["7 dias", "30 dias", "3 meses", "1 ano"];

const topProducts = [
  { name: "Água Mineral 500ml",  revenue: "R$ 980",  units: 392, pct: 92 },
  { name: "Refrigerante Cola 2L",revenue: "R$ 712",  units: 80,  pct: 67 },
  { name: "Pão de Forma",        revenue: "R$ 558",  units: 90,  pct: 52 },
  { name: "Biscoito Cream Cracker",revenue:"R$ 324", units: 72,  pct: 31 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, padding: "10px 14px" }}>
      <p style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "var(--font-sans)", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#00D4AA", fontFamily: "var(--font-mono)" }}>R$ {payload[0]?.value?.toLocaleString()}</p>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#FF4757", fontFamily: "var(--font-mono)" }}>-R$ {payload[1]?.value?.toLocaleString()}</p>
    </div>
  );
};

export function ReportsScreen() {
  const [period, setPeriod] = useState("7 dias");

  const totalSales = weekData.reduce((s, d) => s + d.vendas, 0);
  const totalExp = weekData.reduce((s, d) => s + d.despesas, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--background)", overflowY: "auto" }}>
      <div style={{ padding: "8px 20px 16px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>Relatórios</h1>
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 20, paddingBottom: 100 }}>
        {/* Period Selector */}
        <div style={{ display: "flex", gap: 6, background: "var(--card)", borderRadius: 14, padding: 4, border: "1px solid var(--border)" }}>
          {periods.map(p => (
            <motion.button
              key={p}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPeriod(p)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 10, border: "none", cursor: "pointer",
                background: period === p ? "var(--primary)" : "transparent",
                color: period === p ? "var(--background)" : "var(--muted-foreground)",
                fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, transition: "all 0.2s",
              }}
            >
              {p}
            </motion.button>
          ))}
        </div>

        {/* Summary row */}
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "Receita total", value: `R$ ${totalSales.toLocaleString()}`, delta: "+18%", up: true },
            { label: "Despesas",      value: `R$ ${totalExp.toLocaleString()}`,   delta: "-5%",  up: false },
          ].map(m => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ flex: 1, padding: "14px 14px", background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)" }}
            >
              <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 6, fontFamily: "var(--font-sans)" }}>{m.label}</p>
              <p style={{ fontSize: 17, fontWeight: 700, color: "var(--foreground)", fontFamily: "var(--font-sans)", marginBottom: 4 }}>{m.value}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                {m.up ? <ArrowUpRight size={13} color="#00D4AA" /> : <ArrowDownRight size={13} color="#FF4757" />}
                <span style={{ fontSize: 11, fontWeight: 700, color: m.up ? "#00D4AA" : "#FF4757", fontFamily: "var(--font-mono)" }}>{m.delta}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", padding: "18px 14px 10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingLeft: 4, paddingRight: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TrendingUp size={15} color="var(--primary)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>Receita vs Despesas</span>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: "#00D4AA" }} />
                <span style={{ fontSize: 10, color: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }}>Vendas</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: "#FF4757" }} />
                <span style={{ fontSize: 10, color: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }}>Despesas</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={weekData} margin={{ top: 5, right: 0, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="rpt-gradSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00D4AA" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rpt-gradExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4757" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF4757" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#8891A8", fontFamily: "var(--font-sans)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#8891A8", fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="vendas"   stroke="#00D4AA" strokeWidth={2} fill="url(#rpt-gradSales)" dot={false} activeDot={{ r: 4, fill: "#00D4AA" }} />
              <Area type="monotone" dataKey="despesas" stroke="#FF4757" strokeWidth={2} fill="url(#rpt-gradExp)"   dot={false} activeDot={{ r: 4, fill: "#FF4757" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top products */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontFamily: "var(--font-mono)" }}>Top produtos</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {topProducts.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                style={{ padding: "14px 16px", background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 7, background: "rgba(129,140,248,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#818CF8", fontFamily: "var(--font-mono)", flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>{p.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--primary)", fontFamily: "var(--font-mono)" }}>{p.revenue}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p.pct}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.6 }}
                      style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #00D4AA, #818CF8)" }}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", minWidth: 40, textAlign: "right" }}>{p.units} un.</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
