import { CircleDollarSign, Package, ShoppingCart, TrendingDown, type LucideIcon } from "lucide-react";

export type SummaryTone = "revenue" | "profit" | "expense" | "stock" | "neutral";

export type SummaryCardData = {
  label: string;
  value: string;
  tone: SummaryTone;
  helper?: string;
};

const toneStyles: Record<SummaryTone, { icon: LucideIcon; iconClassName: string }> = {
  revenue: { icon: ShoppingCart, iconClassName: "bg-[#eceeff] text-[var(--primary)]" },
  profit: { icon: CircleDollarSign, iconClassName: "bg-[var(--success-soft)] text-[var(--success)]" },
  expense: { icon: TrendingDown, iconClassName: "bg-[var(--warning-soft)] text-[var(--warning)]" },
  stock: { icon: Package, iconClassName: "bg-[var(--purple-soft)] text-[var(--purple)]" },
  neutral: { icon: CircleDollarSign, iconClassName: "bg-[var(--background)] text-[var(--muted)]" },
};

type SummaryCardProps = {
  card: SummaryCardData;
};

export function SummaryCard({ card }: SummaryCardProps) {
  const tone = toneStyles[card.tone];
  const Icon = tone.icon;

  return (
    <article className="min-h-32 rounded-lg border border-[var(--border)] bg-white p-4 text-[var(--foreground)] shadow-[var(--card-shadow)]">
      <span className={`flex size-9 items-center justify-center rounded-lg ${tone.iconClassName}`}>
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <p className="mt-3 text-xl font-extrabold leading-tight">{card.value}</p>
      <p className="mt-1 text-xs font-semibold text-[var(--muted)]">{card.label}</p>
      {card.helper ? <p className="mt-2 text-[11px] font-medium text-[var(--muted)]">{card.helper}</p> : null}
    </article>
  );
}
