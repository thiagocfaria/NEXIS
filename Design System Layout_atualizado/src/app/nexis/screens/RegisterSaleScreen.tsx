import { motion } from "motion/react";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { T, NavigateFn } from "../tokens";
import { BackHeader } from "../components/NexisHeader";
import { FormField, SelectField, PrimaryButton, SecondaryButton, ScreenBody } from "../components/UIKit";

const PRODUCTS = ["Água Mineral 500ml", "Refrigerante Cola 2L", "Pão de Forma", "Detergente Neutro", "Shampoo 400ml", "Biscoito Cream Cracker"];
const STOCK: Record<string, number> = { "Água Mineral 500ml": 120, "Refrigerante Cola 2L": 8, "Pão de Forma": 45, "Detergente Neutro": 3, "Shampoo 400ml": 62, "Biscoito Cream Cracker": 18 };

export function RegisterSaleScreen({ navigate }: { navigate: NavigateFn }) {
  const [product, setProduct]   = useState(PRODUCTS[0]);
  const [qty, setQty]           = useState("1");
  const [price, setPrice]       = useState("2.50");
  const [success, setSuccess]   = useState(false);

  const total   = (parseFloat(qty || "0") * parseFloat(price || "0")).toFixed(2);
  const stock   = STOCK[product] ?? 0;
  const hasStock = parseInt(qty || "0") <= stock;

  if (success) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg, alignItems: "center", justifyContent: "center", padding: `0 ${T.px}px` }}>
        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: T.greenBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle size={36} color={T.green} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: T.navy, letterSpacing: "-0.025em" }}>Venda registrada!</h2>
          <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.5 }}>R$ {total} · {qty} × {product}</p>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("home")} style={{ marginTop: 8, padding: "14px 32px", borderRadius: T.radius.lg, background: T.navy, color: "#fff", border: "none", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Voltar ao início
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <BackHeader title="Registrar venda" onBack={() => navigate("home")} />

      <ScreenBody>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SelectField label="Produto" options={PRODUCTS} value={product} onChange={v => { setProduct(v); setPrice(v === "Água Mineral 500ml" ? "2.50" : v === "Refrigerante Cola 2L" ? "8.90" : "6.20"); }} />

          {/* Estoque badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: T.radius.md, background: stock <= 5 ? T.redBg : T.greenBg, border: `1px solid ${stock <= 5 ? T.red : T.green}22` }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: stock <= 5 ? T.red : T.green }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: stock <= 5 ? T.red : T.green }}>
              {stock <= 5 ? `⚠ Estoque baixo: ${stock} unidades disponíveis` : `${stock} unidades em estoque`}
            </span>
          </div>

          <FormField label="Quantidade" type="number" placeholder="0" min="1" max={String(stock)} value={qty} onChange={e => setQty(e.target.value)} suffix="un" />
          <FormField label="Preço unitário" type="number" placeholder="0,00" step="0.01" value={price} onChange={e => setPrice(e.target.value)} suffix="R$" />

          {/* Total card */}
          <div style={{ background: T.card, borderRadius: T.radius.lg, border: `1px solid ${T.border}`, padding: "16px", boxShadow: T.shadow }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: T.muted }}>Total da venda</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: T.navy, letterSpacing: "-0.03em" }}>R$ {total}</span>
            </div>
            {!hasStock && parseInt(qty || "0") > 0 && (
              <p style={{ marginTop: 8, fontSize: 12, color: T.red, fontWeight: 600 }}>⚠ Quantidade maior que o estoque disponível</p>
            )}
          </div>

          <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.5, padding: "4px 0" }}>
            Os dados serão salvos apenas após clicar em "Confirmar venda". O estoque será atualizado automaticamente.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            <PrimaryButton fullWidth disabled={!hasStock || !parseFloat(total)} onClick={() => setSuccess(true)}>
              Confirmar venda
            </PrimaryButton>
            <SecondaryButton fullWidth onClick={() => navigate("home")}>Cancelar</SecondaryButton>
          </div>
        </div>
      </ScreenBody>
    </div>
  );
}
