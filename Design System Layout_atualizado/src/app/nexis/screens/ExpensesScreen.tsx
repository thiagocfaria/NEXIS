import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Plus, X, TrendingDown, CheckCircle } from "lucide-react";
import { T, NavigateFn } from "../tokens";
import { TabHeader } from "../components/NexisHeader";
import { BottomNav } from "../components/BottomNav";
import { FormField, SelectField, PrimaryButton, SecondaryButton, ScreenBody, SectionHeader } from "../components/UIKit";

const CATEGORIES = ["Aluguel", "Energia elétrica", "Água", "Internet", "Fornecedor", "Mão de obra", "Embalagens", "Outros"];

const EXPENSES_DATA = [
  { id: 1, desc: "Aluguel do espaço",     cat: "Aluguel",            value: 1200.00, date: "01/06", status: "pago" },
  { id: 2, desc: "Energia elétrica",      cat: "Energia elétrica",   value: 287.40,  date: "05/06", status: "pago" },
  { id: 3, desc: "Fornecedor Bebidas",    cat: "Fornecedor",         value: 840.00,  date: "07/06", status: "pago" },
  { id: 4, desc: "Internet fibra",        cat: "Internet",           value: 99.90,   date: "10/06", status: "pendente" },
  { id: 5, desc: "Embalagens a granel",   cat: "Embalagens",        value: 145.00,  date: "12/06", status: "pendente" },
];

const totalPago    = EXPENSES_DATA.filter(e => e.status === "pago").reduce((s, e) => s + e.value, 0);
const totalPendente = EXPENSES_DATA.filter(e => e.status === "pendente").reduce((s, e) => s + e.value, 0);

export function ExpensesScreen({ navigate }: { navigate: NavigateFn }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ desc: "", value: "", cat: CATEGORIES[0], date: "", status: "pendente" });
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const valid = form.desc.trim() && parseFloat(form.value) > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <TabHeader
        title="Despesas"
        right={
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setShowForm(!showForm); setSaved(false); }} style={{ width: 38, height: 38, borderRadius: 12, background: showForm ? T.red : T.navy, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {showForm ? <X size={17} color="#fff" /> : <Plus size={18} color="#fff" />}
          </motion.button>
        }
      />

      <ScreenBody>
        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {[
            { label: "Pagas este mês",    value: `R$ ${totalPago.toFixed(2).replace(".", ",")}`,    color: T.green,  bg: T.greenBg },
            { label: "Pendentes",         value: `R$ ${totalPendente.toFixed(2).replace(".", ",")}`, color: T.orange, bg: T.orangeBg },
          ].map(m => (
            <div key={m.label} style={{ background: T.card, borderRadius: T.radius.lg, border: `1px solid ${T.border}`, padding: "14px", boxShadow: T.shadow }}>
              <div style={{ width: 28, height: 28, borderRadius: 9, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <TrendingDown size={14} color={m.color} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 800, color: T.fg, letterSpacing: "-0.02em", marginBottom: 2 }}>{m.value}</p>
              <p style={{ fontSize: 11, color: T.muted }}>{m.label}</p>
            </div>
          ))}
        </div>

        {/* New expense form */}
        <AnimatePresence>
          {showForm && !saved && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden", marginBottom: 20 }}
            >
              <div style={{ background: T.card, borderRadius: T.radius.xl, border: `1px solid ${T.border}`, padding: "18px", boxShadow: T.shadowMd }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 14 }}>Nova despesa</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <FormField label="Descrição" placeholder="Ex: Conta de energia" value={form.desc} onChange={e => set("desc")(e.target.value)} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <FormField label="Valor" type="number" placeholder="0,00" step="0.01" value={form.value} onChange={e => set("value")(e.target.value)} suffix="R$" />
                    <FormField label="Data" type="date" value={form.date} onChange={e => set("date")(e.target.value)} />
                  </div>
                  <SelectField label="Categoria" options={CATEGORIES} value={form.cat} onChange={set("cat")} />
                  <div style={{ display: "flex", gap: 8 }}>
                    {["pendente", "pago"].map(s => (
                      <motion.button key={s} whileTap={{ scale: 0.93 }} onClick={() => set("status")(s)} style={{ flex: 1, padding: "10px", borderRadius: T.radius.md, border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, background: form.status === s ? T.navy : T.bg, color: form.status === s ? "#fff" : T.muted }}>
                        {s === "pago" ? "✓ Pago" : "Pendente"}
                      </motion.button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: T.muted }}>A despesa só será salva após clicar em confirmar.</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <SecondaryButton onClick={() => setShowForm(false)}>Cancelar</SecondaryButton>
                    <div style={{ flex: 1 }}>
                      <PrimaryButton fullWidth disabled={!valid} onClick={() => { setSaved(true); setTimeout(() => { setShowForm(false); setSaved(false); }, 1800); }}>
                        Confirmar
                      </PrimaryButton>
                    </div>
                  </div>
                  <AnimatePresence>
                    {saved && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: T.radius.md, background: T.greenBg }}>
                        <CheckCircle size={15} color={T.green} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: T.green }}>Despesa registrada!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List */}
        <SectionHeader label="Despesas recentes" />
        <div style={{ background: T.card, borderRadius: T.radius.xl, border: `1px solid ${T.border}`, overflow: "hidden", boxShadow: T.shadow }}>
          {EXPENSES_DATA.map((e, i) => (
            <motion.div key={e.id} whileTap={{ backgroundColor: T.bg }} style={{ padding: "14px 16px", borderBottom: i < EXPENSES_DATA.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: e.status === "pago" ? T.greenBg : T.orangeBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <TrendingDown size={15} color={e.status === "pago" ? T.green : T.orange} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: T.fg, marginBottom: 2 }}>{e.desc}</p>
                <p style={{ fontSize: 11, color: T.muted }}>{e.cat} · {e.date}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: T.fg, letterSpacing: "-0.02em" }}>R$ {e.value.toFixed(2).replace(".", ",")}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: e.status === "pago" ? T.green : T.orange, background: e.status === "pago" ? T.greenBg : T.orangeBg, padding: "1px 7px", borderRadius: 5, fontFamily: "var(--font-mono)" }}>
                  {e.status === "pago" ? "PAGO" : "PEND."}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </ScreenBody>

      <BottomNav active="expenses" navigate={navigate} />
    </div>
  );
}
