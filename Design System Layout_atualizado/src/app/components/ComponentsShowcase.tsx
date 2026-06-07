import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Check, X, ChevronDown, Eye, EyeOff, Star } from "lucide-react";

export function ComponentsShowcase() {
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("a");
  const [showPass, setShowPass] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [selected, setSelected] = useState("Semanal");
  const [progress] = useState(67);
  const [rating, setRating] = useState(4);
  const [toastVisible, setToastVisible] = useState(false);

  const selectOptions = ["Diário", "Semanal", "Mensal", "Anual"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--background)", overflowY: "auto", paddingBottom: 40 }}>
      <div style={{ padding: "8px 20px 16px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>Componentes</h1>
        <p style={{ fontSize: 12, color: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }}>Design system · Biblioteca de UI</p>
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Buttons */}
        <Section label="Botões">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Confirmar ação",   bg: "var(--primary)",      color: "var(--background)", border: "none" },
              { label: "Ação secundária",  bg: "var(--secondary)",    color: "var(--foreground)", border: "1px solid var(--border)" },
              { label: "Ação destrutiva",  bg: "rgba(255,71,87,0.12)",color: "#FF4757",            border: "1px solid rgba(255,71,87,0.3)" },
              { label: "Ação de destaque", bg: "rgba(129,140,248,0.12)", color: "#818CF8",         border: "1px solid rgba(129,140,248,0.3)" },
            ].map(b => (
              <motion.button key={b.label} whileTap={{ scale: 0.96 }} style={{ width: "100%", padding: "13px 16px", borderRadius: 14, background: b.bg, color: b.color, border: b.border, fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: "-0.01em" }}>
                {b.label}
              </motion.button>
            ))}
          </div>
        </Section>

        {/* Toggles & Checkboxes */}
        <Section label="Controles">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Notificações push",  val: toggle1, set: setToggle1 },
              { label: "Modo escuro",        val: toggle2, set: setToggle2 },
            ].map(({ label, val, set }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>{label}</span>
                <motion.div
                  onClick={() => set(!val)}
                  style={{ width: 48, height: 26, borderRadius: 13, background: val ? "var(--primary)" : "var(--muted)", cursor: "pointer", position: "relative", flexShrink: 0 }}
                >
                  <motion.div
                    animate={{ x: val ? 24 : 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 26 }}
                    style={{ position: "absolute", top: 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
                  />
                </motion.div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <motion.div
                whileTap={{ scale: 0.88 }}
                onClick={() => setChecked(!checked)}
                style={{ width: 22, height: 22, borderRadius: 7, background: checked ? "var(--primary)" : "transparent", border: checked ? "none" : "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
              >
                {checked && <Check size={13} color="var(--background)" strokeWidth={3} />}
              </motion.div>
              <span style={{ fontSize: 14, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>Lembrar dados de acesso</span>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {["a", "b", "c"].map(v => (
                <div key={v} onClick={() => setRadio(v)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${radio === v ? "var(--primary)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {radio === v && <motion.div layoutId="radio" style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--primary)" }} />}
                  </div>
                  <span style={{ fontSize: 13, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>Opção {v.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Inputs */}
        <Section label="Campos de entrada">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }}>Nome do produto</label>
              <input defaultValue="Água Mineral 500ml" style={{ padding: "12px 14px", borderRadius: 12, background: "var(--input)", border: "1px solid var(--border)", color: "var(--foreground)", fontFamily: "var(--font-sans)", fontSize: 14, outline: "none" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }}>Senha</label>
              <div style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderRadius: 12, background: "var(--input)", border: "1px solid var(--border)", gap: 8 }}>
                <input type={showPass ? "text" : "password"} defaultValue="senha123" style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--foreground)", fontFamily: "var(--font-sans)", fontSize: 14 }} />
                <motion.button whileTap={{ scale: 0.85 }} onClick={() => setShowPass(!showPass)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                  {showPass ? <EyeOff size={15} color="var(--muted-foreground)" /> : <Eye size={15} color="var(--muted-foreground)" />}
                </motion.button>
              </div>
            </div>
            {/* Select */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, position: "relative" }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }}>Período</label>
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectOpen(!selectOpen)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: 12, background: "var(--input)", border: "1px solid var(--border)", cursor: "pointer" }}
              >
                <span style={{ fontSize: 14, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>{selected}</span>
                <motion.div animate={{ rotate: selectOpen ? 180 : 0 }}><ChevronDown size={15} color="var(--muted-foreground)" /></motion.div>
              </motion.div>
              <AnimatePresence>
                {selectOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "var(--popover)", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden", zIndex: 10 }}
                  >
                    {selectOptions.map(opt => (
                      <div key={opt} onClick={() => { setSelected(opt); setSelectOpen(false); }} style={{ padding: "12px 14px", fontSize: 14, fontFamily: "var(--font-sans)", color: selected === opt ? "var(--primary)" : "var(--foreground)", background: selected === opt ? "rgba(0,212,170,0.08)" : "transparent", cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                        {opt}
                        {selected === opt && <Check size={14} color="var(--primary)" />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Section>

        {/* Progress & Rating */}
        <Section label="Progresso e Avaliação">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }}>Meta mensal</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary)", fontFamily: "var(--font-mono)" }}>{progress}%</span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 3, background: "linear-gradient(90deg, #00D4AA, #818CF8)" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>Avaliação do mês</span>
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <motion.button key={s} whileTap={{ scale: 0.85 }} onClick={() => setRating(s)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                    <Star size={20} color={s <= rating ? "#F59E0B" : "var(--border)"} fill={s <= rating ? "#F59E0B" : "transparent"} />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Badges & Tags */}
        <Section label="Badges e status">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              { label: "Ativo",      color: "#00D4AA", bg: "rgba(0,212,170,0.12)" },
              { label: "Pendente",   color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
              { label: "Cancelado",  color: "#FF4757", bg: "rgba(255,71,87,0.12)" },
              { label: "Enviado",    color: "#818CF8", bg: "rgba(129,140,248,0.12)" },
              { label: "Processando",color: "#FF6B35", bg: "rgba(255,107,53,0.12)" },
              { label: "Concluído",  color: "#00D4AA", bg: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.3)" },
            ].map(b => (
              <motion.span key={b.label} whileHover={{ scale: 1.05 }} style={{ padding: "5px 12px", borderRadius: 8, background: b.bg, color: b.color, fontSize: 12, fontWeight: 700, fontFamily: "var(--font-mono)", border: (b as any).border || "none" }}>{b.label}</motion.span>
            ))}
          </div>
        </Section>

        {/* Toast trigger */}
        <Section label="Notificações">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setToastVisible(true); setTimeout(() => setToastVisible(false), 3000); }}
              style={{ padding: "13px 16px", borderRadius: 14, background: "var(--primary)", border: "none", color: "var(--background)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              Disparar notificação de sucesso
            </motion.button>
          </div>
        </Section>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 60, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 60, x: "-50%" }}
            style={{ position: "fixed", bottom: 24, left: "50%", background: "#161A24", border: "1px solid rgba(0,212,170,0.3)", borderRadius: 16, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, minWidth: 280, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 100 }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(0,212,170,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Check size={15} color="#00D4AA" strokeWidth={3} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>Operação realizada!</p>
              <p style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "var(--font-sans)" }}>Estoque atualizado com sucesso</p>
            </div>
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setToastVisible(false)} style={{ background: "none", border: "none", cursor: "pointer", marginLeft: "auto" }}>
              <X size={14} color="var(--muted-foreground)" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontFamily: "var(--font-mono)" }}>{label}</p>
      <div style={{ background: "var(--card)", borderRadius: 20, border: "1px solid var(--border)", padding: "16px" }}>
        {children}
      </div>
    </div>
  );
}
