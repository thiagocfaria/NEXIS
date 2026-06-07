"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  sendAssistantMessageAction,
  type AssistantActionState,
  type AssistantPendingContext,
  type ProductFormPrefill,
} from "@/app/assistant/actions";
import { AnswerCard } from "./answer-card";
import { DraftConfirmation } from "./draft-confirmation";
import { MessageInput } from "./message-input";

type ChatThreadProps = {
  audioInputEnabled: boolean;
};

type ConversationItem =
  | {
      content: string;
      id: string;
      role: "user";
    }
  | {
      id: string;
      role: "assistant";
      state: AssistantActionState;
    };

const initialAssistantState: AssistantActionState = {
  status: "idle",
  message: "",
};

export function ChatThread({ audioInputEnabled }: ChatThreadProps) {
  const router = useRouter();
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [pending, setPending] = useState(false);
  const [pendingContext, setPendingContext] = useState<AssistantPendingContext | null>(null);
  const messageListRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const messageList = messageListRef.current;

    if (!messageList) {
      return;
    }

    messageList.scrollTo({
      behavior: "smooth",
      top: messageList.scrollHeight,
    });
  }, [conversation.length, pending]);

  async function handleSend(message: string): Promise<void> {
    const formData = new FormData();
    formData.set("message", message);

    if (pendingContext) {
      formData.set("pendingContext", JSON.stringify(pendingContext));
    }

    setConversation((current) => [
      ...current,
      {
        content: message,
        id: createConversationId("user"),
        role: "user",
      },
    ]);
    setPending(true);

    try {
      const state = await sendAssistantMessageAction(initialAssistantState, formData);
      setPendingContext(state.pendingContext ?? null);

      if (state.productFormPrefill) {
        router.push(productPrefillPath(state.productFormPrefill));
        return;
      }

      setConversation((current) => [
        ...current,
        {
          id: createConversationId("assistant"),
          role: "assistant",
          state,
        },
      ]);
    } catch {
      setPendingContext(null);
      setConversation((current) => [
        ...current,
        {
          id: createConversationId("assistant"),
          role: "assistant",
          state: {
            status: "error",
            message: "Não foi possível interpretar a mensagem agora. Tente novamente em instantes.",
            userMessage: message,
          },
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <section
        aria-label="Conversa com NEXIS"
        aria-live="polite"
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
        data-testid="assistant-message-list"
        ref={messageListRef}
      >
        <div className="grid gap-3 py-4">
          {conversation.length === 0 ? (
            <div className="flex max-w-[94%] items-start gap-2" data-testid="assistant-message">
              <AssistantAvatar />
              <article className="min-w-0 rounded-[18px_18px_18px_4px] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-6 text-[var(--primary)] shadow-[var(--card-shadow)]">
                Ola! Posso consultar seus numeros ou preparar um rascunho de venda, compra, despesa e produto.
              </article>
            </div>
          ) : null}
          {conversation.map((item) =>
            item.role === "user" ? (
              <article
                className="ml-auto max-w-[84%] whitespace-pre-wrap break-words rounded-[18px_18px_4px_18px] bg-[var(--primary)] px-4 py-3 text-sm font-medium leading-6 text-white shadow-[var(--card-shadow)]"
                data-testid="user-message"
                key={item.id}
              >
                {item.content}
              </article>
            ) : (
              <AssistantMessage key={item.id} state={item.state} />
            ),
          )}

          {pending ? <AssistantPendingMessage /> : null}
        </div>
      </section>

      <div
        className="sticky bottom-0 shrink-0 border-t border-[var(--border)] bg-white/95 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur"
        data-testid="assistant-composer"
      >
        <MessageInput audioInputEnabled={audioInputEnabled} onSend={handleSend} pending={pending} />
      </div>
    </div>
  );
}

function AssistantMessage({ state }: { state: AssistantActionState }) {
  if (state.status === "error") {
    return (
      <div className="flex max-w-[94%] items-start gap-2" data-testid="assistant-message">
        <AssistantAvatar />
        <article className="min-w-0 rounded-[18px_18px_18px_4px] border border-[var(--warning)]/20 bg-[var(--warning-soft)] px-4 py-3 text-sm font-semibold leading-6 text-[var(--warning)] shadow-[var(--card-shadow)]">
          {state.message}
        </article>
      </div>
    );
  }

  return (
    <div className="flex max-w-[96%] items-start gap-2" data-testid="assistant-message">
      <AssistantAvatar />
      <div className="grid min-w-0 flex-1 gap-2">
        {state.status === "draft" ? (
          <p className="rounded-[18px_18px_18px_4px] border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[var(--primary)] shadow-[var(--card-shadow)]">
            {state.message}
          </p>
        ) : null}
        {state.answer ? <AnswerCard answer={state.answer} /> : null}
        {state.draft ? <DraftConfirmation draft={state.draft} key={JSON.stringify(state.draft)} /> : null}
      </div>
    </div>
  );
}

function AssistantPendingMessage() {
  return (
    <div className="flex max-w-[94%] items-start gap-2" data-testid="assistant-pending" role="status">
      <AssistantAvatar />
      <article className="min-w-0 rounded-[18px_18px_18px_4px] border border-[var(--border)] bg-white px-4 py-3 text-sm font-semibold leading-6 text-[var(--muted)] shadow-[var(--card-shadow)]">
        NEXIS está analisando...
      </article>
    </div>
  );
}

function AssistantAvatar() {
  return (
    <span
      aria-hidden="true"
      className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-xs font-black text-[var(--accent)] shadow-[var(--card-shadow)]"
    >
      N
    </span>
  );
}

function productPrefillPath(prefill: ProductFormPrefill): string {
  const params = new URLSearchParams({ assistantProduct: "1" });

  setStringParam(params, "name", prefill.name);
  setStringParam(params, "category", prefill.category);
  setStringParam(params, "unit", prefill.unit);
  setNumberParam(params, "unitCostCents", prefill.unitCostCents);
  setNumberParam(params, "salePriceCents", prefill.salePriceCents);
  setNumberParam(params, "initialStock", prefill.initialStock);
  setNumberParam(params, "minimumStock", prefill.minimumStock);
  setBooleanParam(params, "initialPurchase", prefill.initialPurchase);
  setBooleanParam(params, "sensitiveProductWarning", prefill.sensitiveProductWarning);

  return `/products?${params.toString()}`;
}

function setStringParam(params: URLSearchParams, key: string, value?: string): void {
  const trimmed = value?.trim();

  if (trimmed) {
    params.set(key, trimmed);
  }
}

function setNumberParam(params: URLSearchParams, key: string, value?: number): void {
  if (typeof value === "number" && Number.isFinite(value)) {
    params.set(key, String(value));
  }
}

function setBooleanParam(params: URLSearchParams, key: string, value?: boolean): void {
  if (value) {
    params.set(key, "1");
  }
}

function createConversationId(prefix: "assistant" | "user"): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
