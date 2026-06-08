import { describe, expect, it } from "vitest";
import { nexisAssistantSystemPrompt } from "@/lib/ai/nexis-system-prompt";

describe("NEXIS assistant system prompt", () => {
  it("keeps only the public safety contract expected from external AI", () => {
    expect(nexisAssistantSystemPrompt).toContain("JSON valido");
    expect(nexisAssistantSystemPrompt).toContain("Nao calcule valores financeiros finais");
    expect(nexisAssistantSystemPrompt).toContain("confirmacao explicita da UI");
    expect(nexisAssistantSystemPrompt).toContain("retorne bloqueio seguro");
  });
});
