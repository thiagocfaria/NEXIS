import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Search, Plus, ChevronRight, AlertTriangle } from "lucide-react";
import { T, NavigateFn } from "../tokens";
import { TabHeader } from "../components/NexisHeader";
import { BottomNav } from "../components/BottomNav";
import { ScreenBody } from "../components/UIKit";

const ALL_PRODUCTS = [
  { id: 1, name: "Água Mineral 500ml",     cat: "Bebidas",   qty: 120, min: 30,  price: 2.50,  cost: 1.20, active: true },
  { id: 2, name: "Refrigerante Cola 2L",   cat: "Bebidas",   qty: 8,   min: 20,  price: 8.90,  cost: 5.20, active: true },
  { id: 3, name: "Pão de Forma",           cat: "Alimentos", qty: 45,  min: 15,  price: 6.20,  cost: 3.80, active: true },
  { id: 4, name: "Detergente Neutro",      cat: "Limpeza",   qty: 3,   min: 10,  price: 3.40,  cost: 1.90, active: true },
  { id: 5, name: "Shampoo 400ml",          cat: "Higiene",   qty: 62,  min: 20,  price: 14.90, cost: 8.20, active: true },
  { id: 6, name: "Biscoito Cream Cracker", cat: "Alimentos", qty: 18,  min: 15,  price: 4.50,  cost: 2.30, active: true },
  { id: 7, name: "Sabão em Pó 1kg",        cat: "Limpeza",   qty: 0,   min: 5,   price: 11.90, cost: 7.00, active: false },
];

type Filter = "Todos" | "Estoque baixo" | "Inativos";

function StatusBadge({ qty, min, active }: { qty: number; min: number; active: boolean }) {
  if (!active) return <span style={{ fontSize: 10, fontWeight: 700, color: T.muted, background: "#F6F8FF", padding: "3px 8px", borderRadius: 6, fontFamily: "var(--font-mono)" }}>INATIVO</span>;
  if (qty <= 0) return <span style={{ fontSize: 10, fontWeight: 700, color: T.red, background: T.redBg, padding: "3px 8px", borderRadius: 6, fontFamily: "var(--font-mono)" }}>SEM ESTOQUE</span>;
  if (qty <= min) return <span style={{ fontSize: 10, fontWeight: 700, color: T.orange, background: T.orangeBg, padding: "3px 8px", borderRadius: 6, fontFamily: "var(--font-mono)" }}>BAIXO</span>;
  return <span style={{ fontSize: 10, fontWeight: 700, color: T.green, background: T.greenBg, padding: "3px 8px", borderRadius: 6, fontFamily: "var(--font-mono)" }}>OK</span>;
}

export function ProductsScreen({ navigate }: { navigate: NavigateFn }) {
  const [query, setQuery]   = useState("");
  const [filter, setFilter] = useState<Filter>("Todos");

  const filtered = ALL_PRODUCTS.filter(p => {
    const matchQ = p.name.toLowerCase().includes(query.toLowerCase());
    const matchF = filter === "Todos" ? true : filter === "Estoque baixo" ? p.qty <= p.min && p.active : !p.active;
    return matchQ && matchF;
  });

  const lowCount = ALL_PRODUCTS.filter(p => p.qty <= p.min && p.active).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <TabHeader
        title="Produtos"
        right={
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("register-product")} style={{ width: 38, height: 38, borderRadius: 12, background: T.navy, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Plus size={18} color="#fff" />
          </motion.button>
        }
      />

      <ScreenBody noPad>
        <div style={{ padding: `14px ${T.px}px 0` }}>
          {/* Search */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.card, borderRadius: T.radius.lg, border: `1px solid ${T.border}`, padding: "11px 14px", marginBottom: 12, boxShadow: T.shadow }}>
            <Search size={15} color={T.muted} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar produto…" style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: T.fg, fontFamily: "var(--font-sans)" }} />
          </div>

          {/* Alert banner */}
          {lowCount > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate("low-stock")} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: T.radius.md, background: T.orangeBg, border: `1px solid rgba(224,91,26,0.2)`, marginBottom: 12, cursor: "pointer" }}>
              <AlertTriangle size={15} color={T.orange} />
              <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: T.orange }}>{lowCount} produto{lowCount > 1 ? "s" : ""} com estoque baixo</span>
              <ChevronRight size={14} color={T.orange} />
            </motion.div>
          )}

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {(["Todos", "Estoque baixo", "Inativos"] as Filter[]).map(f => (
              <motion.button key={f} whileTap={{ scale: 0.93 }} onClick={() => setFilter(f)} style={{ padding: "7px 14px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", background: filter === f ? T.navy : T.card, color: filter === f ? "#fff" : T.muted, boxShadow: T.shadow, transition: "all 0.2s" }}>
                {f}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product list */}
        <div style={{ padding: `0 ${T.px}px`, display: "flex", flexDirection: "column", gap: 8, paddingBottom: 88 }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => {
              const margin = (((p.price - p.cost) / p.cost) * 100).toFixed(0);
              const pct = Math.min((p.qty / (p.min * 3)) * 100, 100);
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: T.card, borderRadius: T.radius.lg, border: `1px solid ${T.border}`, padding: "14px 16px", cursor: "pointer", boxShadow: T.shadow, opacity: p.active ? 1 : 0.6 }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: T.fg, marginBottom: 2 }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: T.muted }}>{p.cat} · R$ {p.price.toFixed(2)} · Margem {margin}%</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
                      <StatusBadge qty={p.qty} min={p.min} active={p.active} />
                      <ChevronRight size={14} color={T.muted} />
                    </div>
                  </div>
                  {/* stock bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ flex: 1, height: 4, background: T.bg, borderRadius: 2, overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.15 + i * 0.04, duration: 0.5 }}
                        style={{ height: "100%", borderRadius: 2, background: p.qty <= 0 ? T.red : p.qty <= p.min ? T.orange : T.green }}
                      />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: T.fg, fontFamily: "var(--font-mono)", minWidth: 28, textAlign: "right" }}>{p.qty}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0", color: T.muted, fontSize: 14 }}>
              Nenhum produto encontrado
            </div>
          )}
        </div>
      </ScreenBody>

      <BottomNav active="products" navigate={navigate} />
    </div>
  );
}
