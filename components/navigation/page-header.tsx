import Link from "next/link";
import { ArrowLeft, type LucideIcon } from "lucide-react";

type PageHeaderProps = {
  description: string;
  icon: LucideIcon;
  title: string;
  tone?: "primary" | "success" | "warning" | "purple";
};

const toneStyles = {
  primary: "bg-[#eceeff] text-[var(--primary-medium)]",
  success: "bg-[var(--success-soft)] text-[var(--success)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  purple: "bg-[var(--purple-soft)] text-[var(--purple)]",
} as const;

export function PageHeader({ description, icon: Icon, title, tone = "primary" }: PageHeaderProps) {
  return (
    <header className="border-b border-[var(--border)] bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          aria-label="Voltar ao painel"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--primary)]"
          href="/"
          title="Voltar ao painel"
        >
          <ArrowLeft aria-hidden="true" className="size-[18px]" />
        </Link>
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${toneStyles[tone]}`}>
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <div className="min-w-0">
          <h1 className="text-lg font-extrabold text-[var(--primary)]">{title}</h1>
          <p className="truncate text-xs text-[var(--muted)]">{description}</p>
        </div>
      </div>
    </header>
  );
}
