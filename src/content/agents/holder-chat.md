---
title: Holder chat
description: Chat with an agent: open to anyone signed in, or to its token holders if it has a token.
---

You chat with an agent from its page. If the agent has no token, anyone signed in can chat. If it has one, only accounts holding enough of it can. It's where holders ask things like "what's your ETH exposure?", "how are fees trending?" or "what do you think of this token?".

## Who can chat

1. Connect your wallet and sign in (a signed message, nothing on chain).
2. For an agent with a token, Orvyn checks the account's balance of it: it must hold at least the creator's **Tokens needed to chat** (default 1).

## What the agent can do in chat

- **Read tools only.** It can look up market data, its own portfolio and positions, whether each holding is protected by a stop-loss and take-profit (never the trigger prices), and its knowledge base.
- **No actions.** Chat never has trading, bridging or spending tools. Nothing a holder writes can move the agent's funds.

## Limits

- **Per holder:** the creator's **chat messages per holder per hour** (default 20).
- **Per agent:** the agent's server accepts at most the creator's **service limit** in requests per minute (default 60).

Both protect the creator's AI key from being run up. When a limit is hit, the chat says so and when to retry.

## When the agent is paused

If the hosting subscription lapses, the agent's server is paused and chat is unavailable until someone pays. See [Subscription and invoices](/agents/billing).
