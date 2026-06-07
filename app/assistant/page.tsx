import { ArrowLeft, BotMessageSquare } from "lucide-react";
import Link from "next/link";
import { ChatThread } from "@/components/assistant/chat-thread";

export const dynamic = "force-dynamic";

export default function AssistantPage() {
  const audioInputEnabled = process.env.NEXT_PUBLIC_AUDIO_INPUT_ENABLED === "true";

  return (
    <main className="h-dvh overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col">
        <header className="flex shrink-0 items-center gap-3 border-b border-[var(--border)] bg-white px-3 py-3 sm:px-6 lg:px-8">
          <Link
            aria-label="Voltar ao painel"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--primary)]"
            href="/"
            title="Voltar ao painel"
          >
            <ArrowLeft aria-hidden="true" className="size-[18px]" />
          </Link>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--accent)]">
            <BotMessageSquare aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-extrabold text-[var(--primary)] sm:text-lg">Falar com NEXIS</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase text-[var(--success)]">
              <span className="size-1.5 rounded-full bg-[var(--success)]" />
              Assistente ativo
            </p>
          </div>
          <span className="hidden max-w-xs text-right text-xs leading-5 text-[var(--muted)] sm:block">
            {audioInputEnabled ? "Audio vira texto revisavel." : "Perguntas e lancamentos viram rascunhos."}
          </span>
        </header>

        <section className="flex min-h-0 flex-1 flex-col px-3 sm:px-6 lg:px-8" aria-labelledby="assistant-chat-heading">
          <h2 id="assistant-chat-heading" className="sr-only">Chat texto</h2>
          <ChatThread audioInputEnabled={audioInputEnabled} />
        </section>
      </div>
    </main>
  );
}
