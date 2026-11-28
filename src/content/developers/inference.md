---
title: Orvyn models API
description: Call open models (DeepSeek, Kimi, GLM, GPT-OSS, Qwen and more) through one OpenAI- and Anthropic-compatible endpoint, paid from your Orvyn credits.
---

Orvyn serves many AI models behind one endpoint that speaks the **OpenAI Chat Completions API**. You pay from your **Orvyn credits**, the same balance [Orvyn Chat](https://app.orvyn.cash/chat) uses, topped up with BNB, USDT or USDC on BNB Chain.

- **Base URL:** `https://api.orvyn.cash/v1`
- **Auth:** `Authorization: Bearer orv_sk_…`. Create keys on the [Credits page](https://app.orvyn.cash/credits).
- **Billing:** each request costs what the model used (input and output tokens) at the prices on the Credits page. The charge comes back as `usage.cost` in US dollars.

## Get started

1. Sign in at [app.orvyn.cash](https://app.orvyn.cash) and open **Credits**.
2. Top up with BNB, USDT or USDC from your wallet (minimum $1). Credits arrive once the transfer is on chain. When the [Orvyn token](/token) launches, you can also top up with $ORVYN for **2.5% off**: it's valued at the market price and credited 2.5% higher.
3. Under **API keys**, create a key. It's shown once: store it like a password.

```bash
curl https://api.orvyn.cash/v1/chat/completions \
  -H "Authorization: Bearer $ORVYN_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4.1-flash",
    "messages": [{ "role": "user", "content": "Write a haiku about BNB Chain." }]
  }'
```

Any OpenAI SDK works: point its base URL at Orvyn.

```python
from openai import OpenAI

client = OpenAI(base_url="https://api.orvyn.cash/v1", api_key="orv_sk_…")
reply = client.chat.completions.create(
    model="moonshotai/kimi-k3.1-pro",
    messages=[{"role": "user", "content": "Summarise today's BNB news in 3 bullets."}],
)
print(reply.choices[0].message.content, reply.usage.cost)
```

## Models

`GET /v1/models` lists the models your key can use. Orvyn offers a curated set of open-weight models: DeepSeek, Kimi, GLM, GPT-OSS, MiniMax, Qwen, Nemotron, Gemma and Llama. Frontier models (Claude, GPT, Gemini, Grok) aren't on Orvyn AI: use your own provider key for those, in an agent's or Vyn's AI settings; the [Credits page](https://app.orvyn.cash/credits) and Orvyn Chat show each one's price per million tokens.

**Default model:** DeepSeek V4.1 Flash (`deepseek/deepseek-v4.1-flash`). A request without `model` uses your default, which you can change in Orvyn Chat's model picker (**Make … my default**) or with `PUT /v1/default-model` (`{ "model": "<id>" }`, or `null` for Orvyn's default). `GET /v1/default-model` returns it.

**Orvyn Model**, Orvyn's own model, is coming soon. It's listed in Orvyn Chat but can't be called yet.

## What's supported

- `messages`, `model`, `max_tokens` (or `max_completion_tokens`), `temperature`, `top_p`, `stop`, `seed`, penalties
- Tools: `tools`, `tool_choice`, `parallel_tool_calls`
- `response_format` (JSON mode / schemas, where the model supports them)
- Streaming: `"stream": true` sends server-sent events ending with `data: [DONE]`. The last chunk before it carries `usage`, including `cost`.

Other fields are ignored. Requests run on Orvyn's servers; your key and account never reach the model's host.

**Zero data retention.** Orvyn AI only serves models it can run where your prompts and replies are not kept: every request goes to a Zero Data Retention endpoint, at a provider that doesn't collect data. Models without one (including those whose only option keeps data for abuse checks) aren't offered.

The same keys also work with an **Anthropic Messages** endpoint, `POST /v1/messages` (with `x-api-key` or `Authorization: Bearer`), for Claude Code and other Anthropic clients. See [Vyness](/developers/vyness).

## Limits and errors

Errors use OpenAI's shape: `{ "error": { "message", "type", "code" } }`.

| Status | Meaning |
|---|---|
| 401 | Missing, mistyped or revoked key |
| 402 | Out of credits, or not enough for this request: top up, shorten the conversation or pick a cheaper model |
| 400 | A model Orvyn doesn't serve, or a request the model can't take |
| 429 | Too many requests (120 a minute per account) or the model is busy |
| 503 | The model is briefly unavailable: try again |

`max_tokens` is capped to what your balance can pay for, so a request never spends much more than you have.

A model that is briefly unavailable to Orvyn is hidden from `GET /v1/models`, Orvyn Chat, Vyn and Vyness until it is back. Requests for it get a 400 saying so. Pick another model.

## In Orvyn agents

When you create or edit an agent, pick **Orvyn AI (pay with Orvyn credits)** as the AI provider and paste an Orvyn API key. The agent's copilot and chat then run on Orvyn models and are paid from your credits, so you don't need a key from each provider. Self-hosted agents can do the same: set the provider to `orvyn` and the key in `agent.env`.
