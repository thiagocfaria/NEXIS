# Deploy no Vercel com Groq API para NEXIS

Esse documento descreve como configurar a chave da Groq e publicar o app NEXIS no Vercel.

## 1. Antes de começar

- O app é um Next.js com App Router.
- A IA do assistente está preparada para usar um endpoint compatível com OpenAI.
- A chave de IA deve ser mantida no servidor e nunca versionada.
- No Vercel, use variáveis de ambiente server-side.

## 2. Variáveis de ambiente necessárias

No Vercel, adicione estas variáveis em **Settings > Environment Variables** do projeto:

- `AI_ASSISTANT_ENABLED=true`
- `AI_PROVIDER=openai-compatible`
- `AI_BASE_URL=https://api.groq.com/openai/v1`
- `AI_MODEL=llama-3.1-8b-instant`
- `AI_API_KEY=<sua_chave_groq>`
- `AI_TIMEOUT_MS=15000`
- `NEXT_PUBLIC_AUDIO_INPUT_ENABLED=false`
- `AUDIO_TRANSCRIPTION_PROVIDER=mock`
- `BETKOL_CPU_COMMAND=`
- `BETKOL_CPU_TIMEOUT_MS=10000`

> Importante: `AI_API_KEY` deve ser mantada como variável de servidor. Não use `NEXT_PUBLIC_AI_API_KEY`.

## 3. O que essa configuração faz

- `AI_ASSISTANT_ENABLED=true` ativa o uso de IA externa para o assistente.
- `AI_BASE_URL` aponta para o endpoint compatível com OpenAI da Groq.
- `AI_MODEL` seleciona o modelo Groq a ser usado.
- `AI_API_KEY` é a chave secreta que autentica chamadas ao serviço.
- Se a chave estiver vazia ou inválida, o app usa o fallback rule-based local.

## 4. Como funciona no app

### Assistente de linguagem natural

- O app chama `lib/ai/external-assistant.ts` para enviar a mensagem do usuário à API externa.
- Ele monta o contrato `openai-compatible` e exige JSON estruturado.
- Quando não há IA configurada ou a chamada falha, o app usa o parser local em `lib/ai/parse-message.ts`.

### Transcrição de áudio

- O endpoint `app/api/audio/transcribe/route.ts` processa o áudio.
- Atualmente o código suporta `AUDIO_TRANSCRIPTION_PROVIDER=mock` e um provider local `betkol-cpu`.
- A transcrição de áudio não está automaticamente configurada para usar Groq ou outro serviço externo.

## 5. Passo a passo para deploy no Vercel

1. Acesse `https://vercel.com` e faça login.
2. Clique em **New Project**.
3. Importe o repositório Git do NEXIS.
4. Deixe o Vercel detectar o framework `Next.js`.
5. Em **Build & Development Settings** configure:
   - Build Command: `npm run build`
   - Output Directory: padrão (`.next`)
6. Em **Environment Variables**, adicione as variáveis listadas no item 2.
7. Escolha o ambiente `Production` e salve.
8. Clique em **Deploy**.

## 6. Observações específicas para Vercel

- Vercel serverless não é ideal para SQLite persistente em produção.
- Use Vercel para protótipos, preview e validação de UI.
- Caso precise de banco persistente, migre para Postgres/Supabase ou outro serviço externo.
- Para preview público, recomenda-se manter `AI_ASSISTANT_ENABLED=false` e não configurar `AI_API_KEY` real.

## 7. Recomendações de segurança

- Nunca commit a chave `AI_API_KEY` no repositório.
- Não exponha a chave em logs, screenshots ou mensagens públicas.
- Use o painel do Vercel para definir a variável apenas no servidor.
- Se precisar alterar a chave, faça a troca diretamente no Vercel e redeploy.

## 8. Testar localmente antes do deploy

Crie um arquivo `.env.local` na raiz do projeto com valores de exemplo:

```env
NEXT_PUBLIC_AUDIO_INPUT_ENABLED="false"
AUDIO_TRANSCRIPTION_PROVIDER="mock"
BETKOL_CPU_COMMAND=""
BETKOL_CPU_TIMEOUT_MS="10000"
AI_ASSISTANT_ENABLED="true"
AI_PROVIDER="openai-compatible"
AI_BASE_URL="https://api.groq.com/openai/v1"
AI_MODEL="llama-3.1-8b-instant"
AI_API_KEY="<sua_chave_groq>"
AI_TIMEOUT_MS="15000"
```

Depois execute:

```bash
npm install
npm run build
npm run start
```

## 9. O que fazer se a chave não funcionar

- Verifique se `AI_API_KEY` está correta.
- Confirme que `AI_BASE_URL` e `AI_MODEL` estão válidos para a Groq.
- Veja os logs do Vercel para erros durante a chamada de IA.
- O app continuará funcionando, mas com o parser local se a chamada falhar.

## 10. Referência rápida

- Fallback local do assistente: `lib/ai/parse-message.ts`
- Fluxo de decisão IA vs local: `lib/ai/external-assistant.ts`
- Endpoint de transcrição: `app/api/audio/transcribe/route.ts`
- Configuração de IA: `lib/ai/ai-config.ts`
