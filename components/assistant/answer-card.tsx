import type { AssistantAnswer } from "@/lib/ai/answer-question";

type AnswerCardProps = {
  answer: AssistantAnswer;
};

const toneStyles: Record<AssistantAnswer["tone"], string> = {
  revenue: "border-[var(--success)]/20 bg-[var(--success-soft)] text-[var(--primary)]",
  profit: "border-[var(--primary-light)]/20 bg-[#eceeff] text-[var(--primary)]",
  expense: "border-[var(--warning)]/20 bg-[var(--warning-soft)] text-[var(--primary)]",
  stock: "border-[var(--purple)]/20 bg-[var(--purple-soft)] text-[var(--primary)]",
  neutral: "border-[var(--border)] bg-white text-[var(--primary)]",
};

export function AnswerCard({ answer }: AnswerCardProps) {
  return (
    <article className={`rounded-lg border p-4 shadow-[var(--card-shadow)] ${toneStyles[answer.tone]}`}>
      <p className="text-sm font-semibold text-black/65">{answer.title}</p>
      <p className="mt-2 text-2xl font-semibold tracking-normal">{answer.value}</p>
      <p className="mt-3 text-sm leading-6 text-black/70">{answer.body}</p>
    </article>
  );
}
