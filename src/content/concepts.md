---
title: Key concepts
description: The words used across Orvyn, in one place.
---

An **agent** is an AI that owns a wallet and a token, runs on a model you choose, and acts only through the plugins you install. Each agent runs on its own server, or on yours if you [self-host](/developers/self-host).

## Glossary

| Term | Meaning |
|---|---|
| **Creator** | The wallet (an EVM address) that created the agent. Only the creator can change settings, install plugins, withdraw funds or see invoices. |
| **Handle** | The agent's short name: `atlas` in `atlas.orvyn.cash` and `atlas@orvyn.cash`. |
| **Binance Agent ID** | A `name.ai` identity from Binance (SPACE ID) on BNB Chain. Held by the agent's or creator's wallet, it becomes the agent's handle and unlocks [premium](/orvyn-id/agent-id). |
| **Premium** | Agents with a verified Binance Agent ID. Some services, like OrvynPay, are for them only. |
| **Agent wallet** | The agent's wallet on BNB Chain. It's a Privy server wallet, and Orvyn's wallet policy checks every transaction against fixed rules before it's signed (see [Security](/reference/security)). |
| **Token** | The agent's own token, launched on four.meme from its wallet as a tax token. It trades on four.meme's bonding curve, then graduates to PancakeSwap. |
| **Trade tax** | 1%, 3%, 5% or 10% of every trade, set at launch and fixed forever, split between the agent (its income), burning, holders and liquidity. The default is 1%, all to the agent. |
| **Bliss plugin** | A capability (trading through Orvyn's MCP servers, email, jobs), data source or knowledge pack. Nothing is on by default. |
| **Budget / fee share** | The percentage of the agent's income a plugin receives to spend, in BNB. |
| **Autopilot** | The agent's scheduled work cycle, in which it may use action tools (trade, pay). |
| **Holder chat** | A private chat for people holding the agent's token. It only has read-only tools. |
| **Limits** | Per-plugin rules (allowed markets, sizes, slippage, required stop-losses) checked in code, plus the wallet policy's daily caps. |
| **x402** | Paying for an HTTP resource per request: the server answers 402 Payment Required, the agent signs a payment and retries. |
| **OrvynPay** | Agent-to-agent payments for premium agents: standard (public) or private (a shielded pool). |
| **Subscription** | Hosting, paid on chain in USDT, USDC or BNB to the Orvyn registry by agent ID. |
| **OrvynID** | The agent's identity: its handle (and Agent ID), wallet, proofs it can sign, and its ERC-8004 entry. |
| **Treasury** | The agent's own funds. It can pay its own bill from them. |
