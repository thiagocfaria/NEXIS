import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Home, Package, Plus, TrendingDown, BarChart2, ShoppingCart, MessageSquare, X } from "lucide-react";
import { T, NavigateFn, Screen } from "../tokens";

const NAV_ITEMS: { id: Screen | "__fab__"; Icon: any; label: string | null; badge?: boolean }[] = [
  { id: "home",     Icon: Home,        label: "Início" },
  { id: "products", Icon: Package,     label: "Produtos" },
  { id: "__fab__",  Icon: Plus,        label: null },
  { id: "expenses", Icon: TrendingDown, label: "Despesas" },
  { id: "reports",  Icon: BarChart2,   label: "Relatórios" },
];

const FAB_ACTIONS: { label: string; screen: Screen; color: string; bg: string; Icon: any }[] = [
  { label: "Registrar venda",   screen: "register-sale",     color: T.green,  bg: T.greenBg,  Icon: ShoppingCart },
  { label: "Registrar compra",  screen: "register-purchase", color: T.navyMd, bg: "#ECEEFF",  Icon: Package },
  { label: "Nova despesa",      screen: "expenses",          color: T.orange, bg: T.orangeBg, Icon: TrendingDown },
  { label: "Cadastrar produto", screen: "register-product",  color: T.purple, bg: T.purpleBg, Icon: Package },
  { label: "Falar com Nexis",   screen: "chat",              color: T.navy,   bg: "#ECEEFF",  Icon: MessageSquare },
];

export function BottomNav({ active, navigate }: { active: Screen; navigate: NavigateFn }) {
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <>
      {/* Bottom sheet overlay */}
      <AnimatePresence>
        {fabOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFabOpen(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(27,31,94,0.22)", backdropFilter: "blur(4px)", zIndex: 40 }}
            />
            <motion.div
              initial={{ y: 320 }}
              animate={{ y: 0 }}
              exit={{ y: 320 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: T.card, borderRadius: "28px 28px 0 0", padding: "16px 20px 90px", zIndex: 50, boxShadow: "0 -4px 32px rgba(27,31,94,0.13)" }}
            >
              <div style={{ width: 40, height: 4, borderRadius: 2, background: T.border, margin: "0 auto 18px" }} />
              <p style={{ fontSize: 11, fontWeight: 700, color: T.muted, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 10 }}>Ação rápida</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {FAB_ACTIONS.map(({ label, screen, color, bg, Icon }) => (
                  <motion.button
                    key={label}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setFabOpen(false); navigate(screen); }}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderRadius: T.radius.lg, background: T.bg, border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 13, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={18} color={color} />
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: T.navy, fontFamily: "var(--font-sans)" }}>{label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Nav bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 72,
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(20px)",
        borderTop: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-around",
        padding: "0 8px", zIndex: 30,
      }}>
        {NAV_ITEMS.map(({ id, Icon, label }) => {
          const isFab   = id === "__fab__";
          const isActive = !isFab && active === id;

          if (isFab) return (
            <div key="fab" style={{ display: "flex", justifyContent: "center", flex: 1 }}>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setFabOpen(!fabOpen)}
                animate={{ rotate: fabOpen ? 45 : 0, background: fabOpen ? T.limeD : T.navy }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                style={{ width: 52, height: 52, borderRadius: 17, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4, boxShadow: `0 5px 18px rgba(27,31,94,0.30)` }}
              >
                <Plus size={22} color={fabOpen ? T.navy : "#fff"} strokeWidth={2.5} />
              </motion.button>
            </div>
          );

          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.84 }}
              onClick={() => { setFabOpen(false); navigate(id as Screen); }}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "8px 4px", position: "relative" }}
            >
              {isActive && (
                <motion.div
                  layoutId="navActiveBg"
                  style={{ position: "absolute", top: 5, width: 38, height: 36, borderRadius: 12, background: "#ECEEFF" }}
                />
              )}
              <div style={{ position: "relative", zIndex: 1 }}>
                <Icon size={20} color={isActive ? T.navy : T.muted} strokeWidth={isActive ? 2.2 : 1.7} />
              </div>
              {label && <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? T.navy : T.muted, fontFamily: "var(--font-sans)", position: "relative", zIndex: 1 }}>{label}</span>}
            </motion.button>
          );
        })}
      </div>
    </>
  );
}
