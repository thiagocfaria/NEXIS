import { Sparkles } from "lucide-react";

type NexisLogoProps = {
  compact?: boolean;
};

export function NexisLogo({ compact = false }: NexisLogoProps) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] shadow-[0_3px_10px_rgba(27,31,94,0.25)]">
        <span className="relative text-xl font-black text-white" aria-hidden="true">
          N
          <Sparkles className="absolute -right-2 -top-1 size-3 text-[var(--accent)]" strokeWidth={2.5} />
        </span>
      </span>
      {!compact ? (
        <span className="min-w-0">
          <span className="block text-xl font-extrabold leading-none text-[var(--primary)]">NEXIS</span>
          <span className="mt-1 flex items-center gap-1.5 text-[10px] font-bold uppercase text-[var(--success)]">
            <span className="size-1.5 rounded-full bg-[var(--success)]" />
            Assistente ativo
          </span>
        </span>
      ) : null}
    </div>
  );
}
