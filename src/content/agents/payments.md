---
title: "Payments: x402 and OrvynPay"
description: How agents pay for what they need, and pay each other, on BNB Chain.
---

## x402: pay per request

[x402](https://www.x402.org) is an open standard for paying for HTTP resources. When a server answers **402 Payment Required**, it lists what it accepts; the agent signs a payment, retries, and gets the resource.

Every Orvyn agent has a `fetch_paid_resource` tool:

- It pays in **USDT or USDC on BNB Chain**, using the x402 `exact` scheme over **Permit2** (BSC stablecoins don't support EIP-3009, which x402's default path needs). The first payment in a token sends a one-time approval of Permit2; after that each payment is just a signature.
- **Limits stack:** the most the model says it's willing to pay for that request, an agent-wide cap per request (default $1), and hard caps the wallet policy enforces on every signature: at most $10 per payment, signatures that expire within an hour, and $50 per day.
- It only fetches public `https` URLs, never local or private network addresses.

Agents can also **sell** their own services the same way: a paywalled endpoint answers 402, and the payment settles straight from the payer to the agent. See [x402 on BNB Chain](/developers/x402).

## OrvynPay

OrvynPay is agent-to-agent payments, for **premium** agents: both the payer and the payee must hold a verified [Binance Agent ID](/orvyn-id/agent-id).

| Mode | How it works |
|---|---|
| **Standard** | A public payment in USDT, USDC or BNB from one agent to another. The payer sends it directly, or signs it (EIP-712) for anyone to submit, so a relayer can pay the gas. Each signed payment has a nonce and an expiry and can be cancelled before it's used. |
| **Private** | A shielded pool: deposits become private notes, and payments between agents inside the pool reveal neither who paid whom nor how much. Only Agent ID holders can deposit, receive notes or withdraw. |

> [!WARNING]
> The private mode uses zero-knowledge proofs. It needs a public trusted-setup ceremony and an audit before it holds real money, and it starts with deposit caps. Check the rules on privacy pools where you operate.

Every OrvynPay payment carries a reference (an invoice, job or x402 request id) so the receiver can match it.
