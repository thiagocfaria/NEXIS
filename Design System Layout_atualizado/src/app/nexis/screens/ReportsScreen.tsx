import { motion } from "motion/react";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { T, NavigateFn } from "../tokens";
import { TabHeader } from "../components/NexisHeader";
import { BottomNav } from "../components/BottomNav";
import { ScreenBody, SectionHeader } from "../components/UIKit";

const DATA = {
  "Hoje":   [
    { t: "8h", v: 320, d: 80 }, { t: "10h", v: 640, d: 120 }, { t: "12h", v: 980, d: 200 },
    { t: "14h", v: 1400, d: 280 }, { t: "16h", v: 2100, d: 380 }, { t: "18h", v: 4280, d: 1140 },
  ],
  "Semana": [
    { t: "Seg", v: 1200, d: 480 }, { t: "Ter", v: 1890, d: 620 }, { t: "Qua", v: 980, d: 310 },
    { t: "Qui", v: 2400, d: 740 }, { t: "Sex", v: 3100, d: 890 }, { t: "Sáb", v: 4280, d: 1140 }, { t: "Dom", v: 2600, d: 540 },
  ],
  "Mês":    [
    { t: "S1", v: 9800, d: 2100 }, { t: "S2", v: 12400, d: 3100 }, { t: "S3", v: 11200, d: 2800 }, { t: "S4", v: 15060, d: 3340 },
  ],
};

const METRICS_BY_PERIOD: Record<string, { label: string; value: string; delta: string; up: boolean }[]> = {
  "Hoje":   [
    { label: "Vendas",       value: "R$ 4.280",  delta: "+12%", up: true  },
    { label: "Lucro bruto",  value: "R$ 2.400",  delta: "+9%",  up: true  },
    { label: "Lucro líquido",value: "R$ 3.140",  delta: "+18%", up: true  },
    { label: "Despesas",     value: "R$ 1.140",  delta: "-3%",  up: false },
  ],
  "Semana": [
    { label: "Vendas",       value: "R$ 16.450", delta: "+8%",  up: true  },
    { label: "Lucro bruto",  value: "R$ 7.800",  delta: "+6%",  up: true  },
    { label: "Lucro líquido",value: "R$ 5.920",  delta: "+11%", up: true  },
    { label: "Despesas",     value: "R$ 4.680",  delta: "+2%",  up: false },
  ],
  "Mês":    [
    { label: "Vendas",       value: "R$ 48.460", delta: "+15%", up: true  },
    { label: "Lucro bruto",  value: "R$ 21.200", delta: "+12%", up: true  },
    { label: "Lucro líquido",value: "R$ 14.880", delta: "+19%", up: true  },
    { label: "Despesas",     value: "R$ 9.340",  delta: "+4%",  up: false },
  ],
};

const TOP_PRODUCTS = [
  { name: "Água Mineral 500ml",     revenue: "R$ 980",  units: 392, pct: 92 },
  { name: "Refrigerante Cola 2L",   revenue: "R$ 712",  units: 80,  pct: 67 },
  { name: "Pão de Forma",           revenue: "R$ 558",  units: 90,  pct: 52 },
  { name: "Biscoito Cream Cracker", revenue: "R$ 324",  units: 72,  pct: 31 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: T.radius.md, padding: "10px 14px", boxShadow: T.shadowMd }}>
      <p style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontFamily: "var(--font-sans)" }}>{label}</p>
      <p style={{ fontSize: 13, fontWeight: 700, color: T.navy, fontFamily: "var(--font-mono)" }}>R$ {payload[0]?.value?.toLocaleString()}</p>
      {payload[1] && <p style={{ fontSize: 12, color: T.orange, fontFamily: "var(--font-mono)" }}>-R$ {payload[1]?.value?.toLocaleString()}</p>}
    </div>
  );
};

type Period = "Hoje" | "Semana" | "Mês";

export function ReportsScreen({ navigate }: { navigate: NavigateFn }) {
  const [period, setPeriod] = useState<Period>("Semana");
  const data    = DATA[period];
  const metrics = METRICS_BY_PERIOD[period];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <TabHeader title="Relatórios" />

      <ScreenBody>
        {/* Period tabs */}
        <div style={{ display: "flex", gap: 6, background: T.card, borderRadius: T.radius.lg, padding: 4, border: `1px solid ${T.border}`, marginBottom: 18, boxShadow: T.shadow }}>
          {(["Hoje", "Semana", "Mês"] as Period[]).map(p => (
            <motion.button key={p} whileTap={{ scale: 0.95 }} onClick={() => setPeriod(p)} style={{ flex: 1, padding: "9px 0", borderRadius: T.radius.md, border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, background: period === p ? T.navy : "transparent", color: period === p ? "#fff" : T.muted, transition: "all 0.2s" }}>
              {p}
            </motion.button>
          ))}
        </div>

        {/* Metrics grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {metrics.map((m, i) => (
            <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ background: T.card, borderRadius: T.radius.lg, border: `1px solid ${T.border}`, padding: "14px", boxShadow: T.shadow }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                {m.up ? <ArrowUpRight size={13} color={T.green} /> : <ArrowDownRight size={13} color={T.orange} />}
                <span style={{ fontSize: 10, fontWeight: 700, color: m.up ? T.green : T.orange, fontFamily: "var(--font-mono)" }}>{m.delta}</span>
              </div>
              <p style={{ fontSize: 16, fontWeight: 800, color: T.fg, letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 3 }}>{m.value}</p>
              <p style={{ fontSize: 11, color: T.muted }}>{m.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div style={{ background: T.card, borderRadius: T.radius.xl, border: `1px solid ${T.border}`, padding: "16px 12px 10px", marginBottom: 20, boxShadow: T.shadow }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, paddingLeft: 4, paddingRight: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.fg }}>Vendas vs Despesas</span>
            <div style={{ display: "flex", gap: 12 }}>
              {[{ label: "Vendas", color: T.navy }, { label: "Despesas", color: T.orange }].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                  <span style={{ fontSize: 10, color: T.muted }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={data} margin={{ top: 4, right: 0, left: -26, bottom: 0 }}>
              <defs>
                <linearGradient id="rep-gSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.navy}   stopOpacity={0.18} />
                  <stop offset="95%" stopColor={T.navy}   stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rep-gExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.orange} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={T.orange} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: T.muted }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="v" stroke={T.navy}   strokeWidth={2} fill="url(#rep-gSales)" dot={false} activeDot={{ r: 4, fill: T.navy }} />
              <Area type="monotone" dataKey="d" stroke={T.orange} strokeWidth={2} fill="url(#rep-gExp)"   dot={false} activeDot={{ r: 4, fill: T.orange }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top products */}
        <SectionHeader label="Mais vendidos" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TOP_PRODUCTS.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }} style={{ background: T.card, borderRadius: T.radius.lg, border: `1px solid ${T.border}`, padding: "13px 16px", boxShadow: T.shadow }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 7, background: "#ECEEFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: T.navyMd, fontFamily: "var(--font-mono)", flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.fg }}>{p.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.navy, fontFamily: "var(--font-mono)" }}>{p.revenue}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1, height: 4, background: T.bg, borderRadius: 2, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${p.pct}%` }} transition={{ delay: 0.2 + i * 0.06, duration: 0.55 }} style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${T.navy}, ${T.navyLt})` }} />
                </div>
                <span style={{ fontSize: 11, color: T.muted, fontFamily: "var(--font-mono)", minWidth: 36, textAlign: "right" }}>{p.units} un.</span>
              </div>
            </motion.div>
          ))}
        </div>
      </ScreenBody>

      <BottomNav active="reports" navigate={navigate} />
    </div>
  );
}
