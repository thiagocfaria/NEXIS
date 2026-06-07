import Link from "next/link";
import { Bell } from "lucide-react";
import { NexisLogo } from "@/components/ui/nexis-logo";

type NexisHeaderProps = {
  preview?: boolean;
};

export function NexisHeader({ preview = false }: NexisHeaderProps) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Ir para o inicio">
          <NexisLogo />
        </Link>
        <div className="flex items-center gap-2">
          {preview ? (
            <span className="rounded-md bg-[var(--purple-soft)] px-2.5 py-1.5 text-xs font-bold text-[var(--purple)]">
              Preview visual
            </span>
          ) : null}
          <button
            type="button"
            aria-label="Notificacoes"
            title="Notificacoes"
            className="relative flex size-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--muted)]"
          >
            <Bell className="size-[18px]" />
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-[var(--danger)]" />
          </button>
        </div>
      </div>
    </header>
  );
}
