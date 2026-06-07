import "../styles/fonts.css";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { T, Screen } from "./nexis/tokens";
import { HomeScreen }             from "./nexis/screens/HomeScreen";
import { ChatScreen }             from "./nexis/screens/ChatScreen";
import { RegisterSaleScreen }     from "./nexis/screens/RegisterSaleScreen";
import { RegisterProductScreen }  from "./nexis/screens/RegisterProductScreen";
import { RegisterPurchaseScreen } from "./nexis/screens/RegisterPurchaseScreen";
import { ProductsScreen }         from "./nexis/screens/ProductsScreen";
import { ExpensesScreen }         from "./nexis/screens/ExpensesScreen";
import { LowStockScreen }         from "./nexis/screens/LowStockScreen";
import { ReportsScreen }          from "./nexis/screens/ReportsScreen";

/* ── Status bar ────────────────────────────────────────────── */
function StatusBar() {
  return (
    <div style={{ height: 44, background: T.card, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: T.navy, fontFamily: "var(--font-sans)" }}>9:41</span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <path d="M8 2C9.8 2 11.4 2.7 12.5 3.8L13.8 2.5C12.3 1 10.3.2 8 .2S3.7 1 2.2 2.5L3.5 3.8C4.6 2.7 6.2 2 8 2Z" fill={T.muted}/>
          <path d="M8 5C9.2 5 10.2 5.4 11 6.2L12.3 4.9C11.1 3.8 9.6 3 8 3S4.9 3.8 3.7 4.9L5 6.2C5.8 5.4 6.8 5 8 5Z" fill={T.muted}/>
          <circle cx="8" cy="9" r="1.6" fill={T.navy}/>
        </svg>
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none">
          <rect x=".5" y=".5" width="19" height="10" rx="2.5" stroke={`rgba(27,31,94,.25)`}/>
          <rect x="2" y="2" width="13" height="7" rx="1.5" fill={T.navy}/>
          <path d="M21 3.8v3.4a1.7 1.7 0 000-3.4Z" fill={`rgba(27,31,94,.3)`}/>
        </svg>
      </div>
    </div>
  );
}

/* ── Screen renderer ────────────────────────────────────────── */
function ScreenContent({ screen, navigate }: { screen: Screen; navigate: (s: Screen) => void }) {
  switch (screen) {
    case "home":              return <HomeScreen navigate={navigate} />;
    case "chat":              return <ChatScreen navigate={navigate} />;
    case "register-sale":     return <RegisterSaleScreen navigate={navigate} />;
    case "register-product":  return <RegisterProductScreen navigate={navigate} />;
    case "register-purchase": return <RegisterPurchaseScreen navigate={navigate} />;
    case "products":          return <ProductsScreen navigate={navigate} />;
    case "expenses":          return <ExpensesScreen navigate={navigate} />;
    case "low-stock":         return <LowStockScreen navigate={navigate} />;
    case "reports":           return <ReportsScreen navigate={navigate} />;
  }
}

/* ── Phone frame ────────────────────────────────────────────── */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 375,
      height: 812,
      borderRadius: 44,
      background: T.bg,
      overflow: "hidden",
      position: "relative",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.05) inset",
      display: "flex",
      flexDirection: "column",
    }}>
      <StatusBar />
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

/* ── Screen map for nav legend ──────────────────────────────── */
const SCREEN_LABELS: Record<Screen, string> = {
  "home":              "Home",
  "chat":              "Chat IA",
  "register-sale":     "Reg. Venda",
  "register-product":  "Cadastrar Produto",
  "register-purchase": "Reg. Compra",
  "products":          "Produtos",
  "expenses":          "Despesas",
  "low-stock":         "Estoque Baixo",
  "reports":           "Relatórios",
};

/* ── App ────────────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen]   = useState<Screen>("home");
  const [history, setHistory] = useState<Screen[]>(["home"]);

  function navigate(s: Screen) {
    setScreen(s);
    setHistory(h => [...h, s]);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0D1035 0%, #1a1060 50%, #0a0820 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 28,
      padding: "40px 24px",
      fontFamily: "var(--font-sans)",
    }}>
      {/* Header label */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: T.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="6" fill="#1B1F5E"/>
            <rect x="6.5" y="6" width="2.8" height="12" rx="1.4" fill="white"/>
            <rect x="14.7" y="6" width="2.8" height="12" rx="1.4" fill="white"/>
            <path d="M6.5 6 L17.5 18" stroke="#C8FF47" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#E8ECFF", letterSpacing: "-0.025em", lineHeight: 1 }}>Nexis</p>
          <p style={{ fontSize: 10, color: "rgba(200,255,71,0.7)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>PROTÓTIPO NAVEGÁVEL · {SCREEN_LABELS[screen].toUpperCase()}</p>
        </div>
      </motion.div>

      {/* Phone */}
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.08, type: "spring", stiffness: 240, damping: 26 }}>
        <PhoneFrame>
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.18 }}
              style={{ position: "absolute", inset: 0 }}
            >
              <ScreenContent screen={screen} navigate={navigate} />
            </motion.div>
          </AnimatePresence>
        </PhoneFrame>
      </motion.div>

      {/* Quick navigation pills */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", maxWidth: 500 }}>
        {(Object.keys(SCREEN_LABELS) as Screen[]).map(s => (
          <motion.button
            key={s}
            whileTap={{ scale: 0.93 }}
            onClick={() => navigate(s)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 600,
              background: screen === s ? T.lime : "rgba(255,255,255,0.08)",
              color: screen === s ? T.navy : "rgba(255,255,255,0.65)",
              transition: "all 0.18s",
            }}
          >
            {SCREEN_LABELS[s]}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
