import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Mic, Send, ChevronRight } from "lucide-react";
import { T, NavigateFn } from "../tokens";
import { BackHeader } from "../components/NexisHeader";
import { AIDraftCard } from "../components/UIKit";

type Message = { id: number; role: "user" | "ai"; text: string; draft?: boolean };

const INITIAL: Message[] = [
  { id: 1, role: "ai",   text: "Olá! Sou a Nexis, sua assistente financeira. Como posso ajudar você hoje? Posso registrar vendas, consultar estoque, gerar relatórios e muito mais." },
  { id: 2, role: "user", text: "Quero registrar uma venda de 5 caixas de Água Mineral por R$ 12,50 cada." },
  { id: 3, role: "ai",   text: "Entendi! Encontrei o produto no seu estoque. Veja o rascunho abaixo — confira os dados antes de confirmar.", draft: true },
];

const DRAFT_LINES = [
  { label: "Produto",       value: "Água Mineral 500ml" },
  { label: "Quantidade",    value: "5 unidades" },
  { label: "Preço unitário",value: "R$ 12,50" },
  { label: "Total",         value: "R$ 62,50" },
  { label: "Estoque atual", value: "120 → 115 unidades" },
];

const SUGGESTIONS = ["Quanto vendi hoje?", "Produtos com estoque baixo", "Qual meu lucro esta semana?", "Cadastrar produto novo"];

export function ChatScreen({ navigate }: { navigate: NavigateFn }) {
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput]       = useState("");
  const [showDraft, setShowDraft] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [voiceActive, setVoice]   = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function send() {
    if (!input.trim()) return;
    const msg: Message = { id: Date.now(), role: "user", text: input.trim() };
    const reply: Message = { id: Date.now() + 1, role: "ai", text: "Anotado! Posso te ajudar com isso. Quer que eu prepare um rascunho para confirmar?" };
    setMessages(prev => [...prev, msg, reply]);
    setInput("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: T.bg }}>
      <BackHeader
        title="Falar com Nexis"
        onBack={() => navigate("home")}
        statusLabel="IA ATIVA"
        right={
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate("register-sale")} style={{ padding: "7px 12px", borderRadius: 10, background: T.bg, border: `1px solid ${T.border}`, fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: T.navyMd, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            Registrar <ChevronRight size={12} />
          </motion.button>
        }
      />

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: `16px ${T.px}px 8px`, display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Suggestion chips (top) */}
        <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4 }}>
          {SUGGESTIONS.map(s => (
            <motion.button key={s} whileTap={{ scale: 0.93 }} onClick={() => setInput(s)} style={{ padding: "6px 12px", borderRadius: 10, background: T.card, border: `1px solid ${T.border}`, color: T.muted, fontSize: 11, whiteSpace: "nowrap", cursor: "pointer", boxShadow: T.shadow }}>
              {s}
            </motion.button>
          ))}
        </div>

        {messages.map((m, i) => (
          <div key={m.id}>
            <motion.div
              initial={{ opacity: 0, y: 10, x: m.role === "user" ? 10 : -10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: i < 3 ? 0 : 0.05 }}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {m.role === "ai" && (
                <div style={{ width: 28, height: 28, borderRadius: 9, background: T.navy, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="6" fill="#1B1F5E"/>
                    <rect x="6.5" y="6" width="2.8" height="12" rx="1.4" fill="white"/>
                    <rect x="14.7" y="6" width="2.8" height="12" rx="1.4" fill="white"/>
                    <path d="M6.5 6 L17.5 18" stroke="#C8FF47" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
              <div style={{
                maxWidth: "72%",
                padding: "11px 14px",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: m.role === "user" ? T.navy : T.card,
                color: m.role === "user" ? "#fff" : T.fg,
                fontSize: 14,
                lineHeight: 1.5,
                boxShadow: T.shadow,
                border: m.role === "ai" ? `1px solid ${T.border}` : "none",
              }}>
                {m.text}
              </div>
            </motion.div>

            {/* Draft card after AI message with draft flag */}
            {m.draft && showDraft && !confirmed && (
              <div style={{ paddingLeft: 36 }}>
                <AIDraftCard
                  title="Venda"
                  lines={DRAFT_LINES}
                  onConfirm={() => { setConfirmed(true); setShowDraft(false); setMessages(prev => [...prev, { id: Date.now(), role: "ai", text: "✅ Venda de R$ 62,50 registrada com sucesso! O estoque foi atualizado automaticamente." }]); }}
                  onEdit={() => navigate("register-sale")}
                />
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding: `12px ${T.px}px 20px`, background: T.card, borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: T.bg, borderRadius: T.radius.lg, border: `1px solid ${T.border}`, padding: "10px 14px" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Digite uma mensagem…"
              style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14, color: T.fg, fontFamily: "var(--font-sans)" }}
            />
          </div>
          {/* mic */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setVoice(!voiceActive)}
            style={{ width: 44, height: 44, borderRadius: 14, background: voiceActive ? T.red : T.bg, border: `1px solid ${voiceActive ? T.red : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, position: "relative" }}
          >
            <Mic size={18} color={voiceActive ? "#fff" : T.muted} />
            {voiceActive && <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 1, repeat: Infinity }} style={{ position: "absolute", inset: 0, borderRadius: 14, border: `2px solid ${T.red}`, pointerEvents: "none" }} />}
          </motion.button>
          {/* send */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={send}
            style={{ width: 44, height: 44, borderRadius: 14, background: input.trim() ? T.navy : T.bg, border: `1px solid ${input.trim() ? T.navy : T.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}
          >
            <Send size={17} color={input.trim() ? "#fff" : T.muted} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
