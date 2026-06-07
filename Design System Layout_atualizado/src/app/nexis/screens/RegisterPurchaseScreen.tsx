import { motion } from "motion/react";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { T, NavigateFn } from "../tokens";
import { BackHeader } from "../components/NexisHeader";
import { FormField, SelectField, PrimaryButton, SecondaryButton, ScreenBody } from "../components/UIKit";

const PRODUCTS = ["Água Mineral 500ml", "Refrigerante Cola 2L", "Pão de Forma", "Detergente Neutro", "Shampoo 400ml", "Biscoito Cream Cracker"];

export function RegisterPurchaseScreen({ navigate }: { navigate: NavigateFn }) {
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [qty, setQty]         = useState("12");
  const [custo, setCusto]     = useState("1.80");
  const [unPkg, setUnPkg]     = useState("1");
  const [success, setSuccess] = useState(false);

  const totalUnits = parseInt(qty || "0") * parseInt(unPkg || "1");
  const totalCost  = (parseFloat(qty || "0") * parseFloat(custo || "0")).toFixed(2);
  const unitCost   = totalUnits > 0 ? (parseFloat(totalCost) / totalUnits).toFixed(2) : "0.00";

  const valid = product && parseFloat(totalCost) > 0;

  if (success) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg, alignItems: "center", justifyContent: "center", padding: `0 ${T.px}px` }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: "#ECEEFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle size={36} color={T.navyMd} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: T.navy, letterSpacing: "-0.025em" }}>Compra registrada!</h2>
          <p style={{ fontSize: 14, color: T.muted }}>+{totalUnits} unidades de {product}</p>
          <p style={{ fontSize: 13, color: T.muted }}>Total pago: R$ {totalCost}</p>
          <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("home")} style={{ padding: "14px 32px", borderRadius: T.radius.lg, background: T.navy, color: "#fff", border: "none", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
            Voltar ao início
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <BackHeader title="Registrar compra" onBack={() => navigate("home")} />

      <ScreenBody>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <SelectField label="Produto" options={PRODUCTS} value={product} onChange={setProduct} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <FormField label="Quantidade comprada" type="number" placeholder="0" value={qty} onChange={e => setQty(e.target.value)} suffix="emb." hint="Número de embalagens" />
            <FormField label="Un. por embalagem" type="number" placeholder="1" value={unPkg} onChange={e => setUnPkg(e.target.value)} suffix="un" hint="Ex: 12 unidades/caixa" />
          </div>

          <FormField label="Custo por embalagem" type="number" placeholder="0,00" step="0.01" value={custo} onChange={e => setCusto(e.target.value)} suffix="R$" />

          {/* Calculated summary */}
          <div style={{ background: T.card, borderRadius: T.radius.lg, border: `1px solid ${T.border}`, padding: "16px", boxShadow: T.shadow, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Total de unidades",   value: `${totalUnits} unidades` },
              { label: "Custo por unidade",   value: `R$ ${unitCost}` },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: T.muted }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: T.fg }}>{r.value}</span>
              </div>
            ))}
            <div style={{ height: 1, background: T.border }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: T.muted }}>Total da compra</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: T.navy, letterSpacing: "-0.025em" }}>R$ {totalCost}</span>
            </div>
          </div>

          <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            O estoque será atualizado e a despesa registrada apenas após confirmar.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            <PrimaryButton fullWidth disabled={!valid} onClick={() => setSuccess(true)}>Confirmar entrada</PrimaryButton>
            <SecondaryButton fullWidth onClick={() => navigate("home")}>Cancelar</SecondaryButton>
          </div>
        </div>
      </ScreenBody>
    </div>
  );
}
