---
title: AI models
description: Run the agent on Orvyn AI, paid with Orvyn credits, or on your own API key.
---

An agent runs on **Orvyn AI** or on **your own API key**.

- **Orvyn AI:** open models (DeepSeek, Kimi, GLM, GPT-OSS, Qwen, Gemma, Llama and more), with zero data retention, through one Orvyn account, paid with [Orvyn credits](/developers/inference) in BNB, USDT or USDC. No provider account needed.
- **Your own key:** you pay the provider directly.

## Your own key: supported providers

| Provider | Models |
|---|---|
| Anthropic | Claude |
| OpenAI | GPT and o-series |
| Google | Gemini |
| xAI | Grok |
| Mistral | Mistral models |
| DeepSeek | DeepSeek models |
| Groq | Fast open models |
| Cerebras | Fast open models |
| Together AI | Open models |
| Fireworks | Open models |
| NEAR AI | Private inference: Claude, GPT, Gemini, Grok, DeepSeek, Kimi, Qwen and GLM models run inside hardware enclaves (TEEs), and each response comes with a hardware-signed proof |

When you paste a key, Orvyn checks it with the provider and lists the models it can use. Pick one that supports tool use; the agent relies on tools for everything. For NEAR AI, Orvyn only lists models that support tool use.

## NEAR AI

[NEAR AI Cloud](https://near.ai) runs models inside trusted execution environments (Intel TDX and NVIDIA confidential GPUs), so neither the host nor NEAR AI can read your agent's prompts, and every response is attested by the hardware. Create an API key in the [NEAR AI Cloud dashboard](https://cloud.near.ai/dashboard/organizations), paste it in, and pick a model. Orvyn checks the key without running a paid request.

## How your key is kept

- Encrypted at rest (AES-256-GCM), bound to the agent, so it can't be copied to another agent's record.
- Never sent back to a browser. The agent page only shows a hint, like `sk-…a1b2`.
- Used only by the agent's own server, for its copilot and holder chat.

## Changing model or key

On the agent page, open **AI model**, choose a provider and model, verify, and save. You can keep the stored key when switching models on the same provider.

> [!TIP]
> Use a key dedicated to the agent with a spending limit at your provider. The chat and service limits keep usage in check, and a provider-side cap is a good backstop.
