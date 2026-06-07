import Link from "next/link";
import { ArrowLeft, BotMessageSquare, Check, Mic } from "lucide-react";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { SummaryCard, type SummaryCardData } from "@/components/dashboard/summary-card";
import { BottomNavigation } from "@/components/navigation/bottom-navigation";
import { NexisHeader } from "@/components/navigation/nexis-header";

const previewCards: SummaryCardData[] = [
  { label: "Vendas hoje", value: "R$ 4.280,00", tone: "revenue", helper: "12 vendas" },
  { label: "Lucro liquido", value: "R$ 3.140,00", tone: "profit", helper: "Depois das despesas" },
  { label: "Despesas", value: "R$ 1.140,00", tone: "expense", helper: "Confirmadas" },
  { label: "Produtos acabando", value: "3", tone: "stock", helper: "Abaixo do minimo" },
];

export default function UxPreviewPage() {
  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <NexisHeader preview />
      <div className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <Link className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary-medium)]" href="/">
          <ArrowLeft className="size-4" />
          Voltar ao app real
        </Link>

        <section className="mb-5">
          <p className="text-sm font-semibold text-[var(--muted)]">Laboratorio de interface</p>
          <h1 className="mt-1 text-2xl font-extrabold text-[var(--primary)]">Design System NEXIS</h1>
        </section>

        <section className="relative mb-6 overflow-hidden rounded-lg bg-[var(--primary)] p-4 text-white shadow-[var(--card-shadow-strong)]">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[rgba(200,255,71,0.16)] text-[var(--accent)]">
              <BotMessageSquare className="size-4" />
            </span>
            <span className="text-sm font-bold">Falar com NEXIS</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 px-3 py-2.5">
            <span className="flex-1 text-sm text-white/60">Quanto vendi hoje?</span>
            <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--accent)] text-[var(--primary)]">
              <Mic className="size-4" />
            </span>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-xs font-extrabold uppercase text-[var(--muted)]">Componentes base</h2>
          <QuickActions />
        </section>

        <section className="mb-6">
          <h2 className="mb-3 text-xs font-extrabold uppercase text-[var(--muted)]">Cards financeiros</h2>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {previewCards.map((card) => (
              <SummaryCard card={card} key={card.label} />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--border)] bg-white p-4 shadow-[var(--card-shadow)]">
          <div className="mb-3 flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--success)]" />
            <h2 className="text-sm font-bold text-[var(--primary)]">NEXIS entendeu: registrar venda</h2>
          </div>
          <dl className="grid gap-2 rounded-lg bg-[var(--background)] p-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Produto</dt>
              <dd className="font-bold">Agua 500 ml</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--muted)]">Quantidade</dt>
              <dd className="font-bold">2 unidades</dd>
            </div>
          </dl>
          <p className="my-3 text-xs leading-5 text-[var(--muted)]">
            O registro so sera salvo depois da confirmacao explicita.
          </p>
          <button type="button" className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 font-bold text-white">
            <Check className="size-4" />
            Confirmar venda
          </button>
        </section>
      </div>
      <BottomNavigation />
    </main>
  );
}
