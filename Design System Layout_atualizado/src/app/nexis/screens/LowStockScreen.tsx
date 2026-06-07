import { motion } from "motion/react";
import { AlertTriangle, ShoppingCart } from "lucide-react";
import { T, NavigateFn } from "../tokens";
import { BackHeader } from "../components/NexisHeader";
import { ScreenBody, SectionHeader } from "../components/UIKit";

const LOW_PRODUCTS = [
  { id: 2, name: "Refrigerante Cola 2L",   cat: "Bebidas",  qty: 8,  min: 20,  status: "low" as const },
  { id: 4, name: "Detergente Neutro",       cat: "Limpeza",  qty: 3,  min: 10,  status: "critical" as const },
  { id: 7, name: "Sabão em Pó 1kg",         cat: "Limpeza",  qty: 0,  min: 5,   status: "empty" as const },
];

const STATUS = {
  low:      { label: "BAIXO",        color: T.orange, bg: T.orangeBg },
  critical: { label: "CRÍTICO",      color: T.red,    bg: T.redBg },
  empty:    { label: "SEM ESTOQUE",  color: T.red,    bg: T.redBg },
};

export function LowStockScreen({ navigate }: { navigate: NavigateFn }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <BackHeader title="Estoque baixo" onBack={() => navigate("products")} />

      <ScreenBody>
        {/* Alert banner */}
        <div style={{ background: T.orangeBg, borderRadius: T.radius.lg, border: `1px solid rgba(224,91,26,0.2)`, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(224,91,26,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertTriangle size={18} color={T.orange} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: T.orange, marginBottom: 2 }}>{LOW_PRODUCTS.length} produtos precisam de reposição</p>
            <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.4 }}>Reabasteça antes de acabar para evitar perda de vendas.</p>
          </div>
        </div>

        <SectionHeader label="Produtos abaixo do mínimo" />

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {LOW_PRODUCTS.map((p, i) => {
            const s = STATUS[p.status];
            const pct = p.min > 0 ? Math.max((p.qty / p.min) * 100, 0) : 0;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                style={{ background: T.card, borderRadius: T.radius.lg, border: `1.5px solid ${s.color}25`, padding: "16px", boxShadow: T.shadow }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: T.fg, marginBottom: 3 }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: T.muted }}>{p.cat}</p>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: s.color, background: s.bg, padding: "3px 8px", borderRadius: 6, fontFamily: "var(--font-mono)" }}>{s.label}</span>
                </div>

                {/* Stock comparison */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                  {[
                    { label: "Estoque atual",  value: p.qty,  color: s.color },
                    { label: "Estoque mínimo", value: p.min,  color: T.muted },
                  ].map(item => (
                    <div key={item.label} style={{ background: T.bg, borderRadius: T.radius.md, padding: "10px 12px" }}>
                      <p style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>{item.label}</p>
                      <p style={{ fontSize: 20, fontWeight: 800, color: item.color, letterSpacing: "-0.025em" }}>{item.value}</p>
                      <p style={{ fontSize: 10, color: T.muted }}>unidades</p>
                    </div>
                  ))}
                </div>

                {/* progress bar */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ height: 6, background: T.bg, borderRadius: 3, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.6 }}
                      style={{ height: "100%", borderRadius: 3, background: s.color }}
                    />
                  </div>
                  <p style={{ fontSize: 10, color: T.muted, marginTop: 4 }}>{pct.toFixed(0)}% do mínimo recomendado</p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("register-purchase")}
                  style={{ width: "100%", padding: "13px", borderRadius: T.radius.md, background: T.navy, color: "#fff", border: "none", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <ShoppingCart size={16} color="#fff" />
                  Comprar mais
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </ScreenBody>
    </div>
  );
}
