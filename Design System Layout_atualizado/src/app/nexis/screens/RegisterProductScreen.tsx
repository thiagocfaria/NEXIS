import { motion } from "motion/react";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { T, NavigateFn } from "../tokens";
import { BackHeader } from "../components/NexisHeader";
import { FormField, SelectField, PrimaryButton, SecondaryButton, ScreenBody } from "../components/UIKit";

const CATEGORIAS = ["Bebidas", "Alimentos", "Higiene", "Limpeza", "Eletrônicos", "Outros"];
const UNIDADES = ["unidade", "kg", "litro", "caixa", "pacote", "dúzia"];

export function RegisterProductScreen({ navigate }: { navigate: NavigateFn }) {
  const [form, setForm] = useState({ nome: "", categoria: CATEGORIAS[0], unidade: UNIDADES[0], custo: "", preco: "", estoqueAtual: "", estoqueMin: "" });
  const [success, setSuccess] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const margem = form.custo && form.preco
    ? (((parseFloat(form.preco) - parseFloat(form.custo)) / parseFloat(form.custo)) * 100).toFixed(0)
    : null;

  const valid = form.nome.trim() && parseFloat(form.preco) > 0;

  if (success) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg, alignItems: "center", justifyContent: "center", padding: `0 ${T.px}px` }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: T.purpleBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle size={36} color={T.purple} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: T.navy, letterSpacing: "-0.025em" }}>Produto cadastrado!</h2>
          <p style={{ fontSize: 14, color: T.muted }}>{form.nome}</p>
          <div style={{ display: "flex", gap: 10 }}>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("products")} style={{ padding: "13px 20px", borderRadius: T.radius.lg, background: T.bg, color: T.navy, border: `1px solid ${T.border}`, fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Ver produtos</motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => navigate("home")} style={{ padding: "13px 24px", borderRadius: T.radius.lg, background: T.navy, color: "#fff", border: "none", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Início</motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <BackHeader title="Cadastrar produto" onBack={() => navigate("products")} />

      <ScreenBody>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FormField label="Nome do produto" placeholder="Ex: Água Mineral 500ml" value={form.nome} onChange={e => set("nome")(e.target.value)} />
          <SelectField label="Categoria" options={CATEGORIAS} value={form.categoria} onChange={set("categoria")} />
          <SelectField label="Unidade de medida" options={UNIDADES} value={form.unidade} onChange={set("unidade")} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <FormField label="Custo unitário" type="number" placeholder="0,00" step="0.01" value={form.custo} onChange={e => set("custo")(e.target.value)} suffix="R$" />
            <FormField label="Preço de venda" type="number" placeholder="0,00" step="0.01" value={form.preco} onChange={e => set("preco")(e.target.value)} suffix="R$" />
          </div>

          {/* Margem preview */}
          {margem !== null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "10px 14px", borderRadius: T.radius.md, background: parseFloat(margem) > 0 ? T.greenBg : T.redBg, border: `1px solid ${parseFloat(margem) > 0 ? T.green : T.red}22` }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: parseFloat(margem) > 0 ? T.green : T.red }}>
                Margem estimada: {margem}%
              </span>
            </motion.div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <FormField label="Estoque atual" type="number" placeholder="0" value={form.estoqueAtual} onChange={e => set("estoqueAtual")(e.target.value)} suffix={form.unidade} hint="Quantidade disponível" />
            <FormField label="Estoque mínimo" type="number" placeholder="0" value={form.estoqueMin} onChange={e => set("estoqueMin")(e.target.value)} suffix={form.unidade} hint="Alerta quando atingir" />
          </div>

          <p style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            O produto só será salvo após clicar em "Salvar produto".
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            <PrimaryButton fullWidth disabled={!valid} onClick={() => setSuccess(true)}>Salvar produto</PrimaryButton>
            <SecondaryButton fullWidth onClick={() => navigate("products")}>Cancelar</SecondaryButton>
          </div>
        </div>
      </ScreenBody>
    </div>
  );
}
