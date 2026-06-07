"use client";

import { SendHorizontal } from "lucide-react";
import type { FormEvent, KeyboardEvent } from "react";
import { useRef, useState } from "react";
import { AudioRecorder } from "./audio-recorder";

type MessageInputProps = {
  audioInputEnabled: boolean;
  onSend: (message: string) => Promise<void>;
  pending: boolean;
};

export function MessageInput({ audioInputEnabled, onSend, pending }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (trimmedMessage.length === 0 || pending) {
      return;
    }

    await onSend(trimmedMessage);
    setMessage("");
    window.requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  }

  return (
    <form className="bg-white pb-1" onSubmit={handleSubmit}>
      {audioInputEnabled ? (
        <AudioRecorder onTranscript={setMessage} />
      ) : (
        <section aria-label="Modo texto-only" className="mb-2 rounded-lg bg-[var(--surface-soft)] px-3 py-2">
          <p className="text-xs font-semibold leading-5 text-[var(--muted)]">
            Digite perguntas ou lançamentos. Nada é salvo sem confirmação.
          </p>
        </section>
      )}

      <label className="sr-only" htmlFor="assistant-message">
        Mensagem
      </label>
      <div className="flex items-end gap-2">
        <textarea
          className="min-h-12 max-h-32 flex-1 resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-base font-medium leading-6 text-[var(--primary)] placeholder:text-[var(--muted)] focus:border-[var(--primary-light)] focus:outline-none"
          id="assistant-message"
          name="message"
          onKeyDown={handleKeyDown}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Digite sua mensagem"
          ref={textareaRef}
          rows={1}
          value={message}
        />
        <button
          aria-label="Enviar para NEXIS"
          className="flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-3 py-3 text-sm font-bold text-white shadow-[var(--card-shadow)] transition hover:bg-[var(--primary-medium)] disabled:cursor-not-allowed disabled:bg-slate-400 sm:min-w-28 sm:px-4"
          disabled={pending}
          type="submit"
        >
          <SendHorizontal aria-hidden="true" className="h-5 w-5" />
          <span className="hidden sm:inline">{pending ? "Analisando" : "Enviar"}</span>
        </button>
      </div>
    </form>
  );
}
