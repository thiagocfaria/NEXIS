import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Search, Filter, Plus, Package, TrendingDown, AlertTriangle, ChevronRight } from "lucide-react";

const categories = ["Todos", "Bebidas", "Alimentos", "Higiene", "Limpeza"];

const products = [
  { id: 1, name: "Água Mineral 500ml",    cat: "Bebidas",   qty: 120, min: 30,  price: "R$ 2,50",  status: "ok" },
  { id: 2, name: "Refrigerante Cola 2L",  cat: "Bebidas",   qty: 8,   min: 20,  price: "R$ 8,90",  status: "low" },
  { id: 3, name: "Pão de Forma",          cat: "Alimentos", qty: 45,  min: 15,  price: "R$ 6,20",  status: "ok" },
  { id: 4, name: "Detergente Neutro",     cat: "Limpeza",   qty: 3,   min: 10,  price: "R$ 3,40",  status: "critical" },
  { id: 5, name: "Shampoo 400ml",         cat: "Higiene",   qty: 62,  min: 20,  price: "R$ 14,90", status: "ok" },
  { id: 6, name: "Biscoito Cream Cracker",cat: "Alimentos", qty: 18,  min: 15,  price: "R$ 4,50",  status: "ok" },
];

const statusConfig = {
  ok:       { label: "OK",       color: "#00D4AA", bg: "rgba(0,212,170,0.12)" },
  low:      { label: "Baixo",    color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  critical: { label: "Crítico",  color: "#FF4757", bg: "rgba(255,71,87,0.12)" },
};

export function StockScreen() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [query, setQuery] = useState("");

  const filtered = products.filter(p =>
    (activeCategory === "Todos" || p.cat === activeCategory) &&
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--background)", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ padding: "8px 20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>Estoque</h1>
          <motion.button whileTap={{ scale: 0.9 }} style={{ width: 38, height: 38, borderRadius: 12, background: "var(--primary)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Plus size={18} color="var(--background)" />
          </motion.button>
        </div>

        {/* Search */}
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--card)", borderRadius: 12, border: "1px solid var(--border)", padding: "10px 14px" }}>
            <Search size={14} color="var(--muted-foreground)" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar produto..."
              style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}
            />
          </div>
          <motion.button whileTap={{ scale: 0.9 }} style={{ width: 42, height: 42, borderRadius: 12, background: "var(--card)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Filter size={15} color="var(--muted-foreground)" />
          </motion.button>
        </div>
      </div>

      {/* Summary chips */}
      <div style={{ padding: "0 20px 16px", display: "flex", gap: 8 }}>
        {[
          { icon: Package,     label: "247 itens",  color: "#818CF8" },
          { icon: TrendingDown,label: "2 baixos",   color: "#F59E0B" },
          { icon: AlertTriangle,label: "1 crítico", color: "#FF4757" },
        ].map((chip) => {
          const Icon = chip.icon;
          return (
            <div key={chip.label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "var(--card)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <Icon size={13} color={chip.color} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>{chip.label}</span>
            </div>
          );
        })}
      </div>

      {/* Category tabs */}
      <div style={{ paddingLeft: 20, paddingBottom: 16, display: "flex", gap: 8, overflowX: "auto" }}>
        {categories.map(cat => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.92 }}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "7px 14px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: "nowrap",
              background: activeCategory === cat ? "var(--primary)" : "var(--card)",
              color: activeCategory === cat ? "var(--background)" : "var(--muted-foreground)",
              transition: "all 0.2s",
            }}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Product list */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 8, paddingBottom: 100 }}>
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => {
            const s = statusConfig[p.status as keyof typeof statusConfig];
            const pct = Math.min((p.qty / (p.min * 4)) * 100, 100);
            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: "14px 16px", background: "var(--card)", borderRadius: 16, border: "1px solid var(--border)", cursor: "pointer" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)", fontFamily: "var(--font-sans)", marginBottom: 2 }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }}>{p.cat} · {p.price}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: s.color, background: s.bg, padding: "3px 8px", borderRadius: 6, fontFamily: "var(--font-mono)" }}>{s.label}</span>
                    <ChevronRight size={14} color="var(--muted-foreground)" />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                      style={{ height: "100%", borderRadius: 2, background: s.color }}
                    />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground)", fontFamily: "var(--font-mono)", minWidth: 32, textAlign: "right" }}>{p.qty}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
