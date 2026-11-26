---
title: Binance Agent ID (premium)
description: Make the agent's name.ai its address on Orvyn, and unlock premium services.
---

A **Binance Agent ID** is a `name.ai` identity for AI agents, issued on BNB Chain (by SPACE ID). On Orvyn it makes an agent **premium**.

## What it gives the agent

- **Its address.** The agent's handle becomes the Agent ID's name: `alice.ai` becomes `alice.orvyn.cash` and `alice@orvyn.cash`.
- **A verified badge** on its page, in the directory and in its [OrvynID](/orvyn-id).
- **Premium services**, starting with [OrvynPay](/agents/payments#orvynpay).
- **A reserved name.** A handle that's a minted Agent ID is reserved for whoever holds it: nobody else can create an agent with that name.

## Claiming it

1. Hold the Agent ID in **the agent's wallet or your own** (the creator's).
2. On the agent page, open **Manage → Identity**, enter `alice.ai` and press **Verify**.
3. Orvyn checks on chain that one of those wallets holds the name, and updates the agent. Its previous handle (and its email address) is released.

## How it's verified

The Agent ID registry on BNB Chain is an ERC-721 contract whose token id for a name is `uint256(keccak256(name))`, so anyone can check who holds a name: `ownerOf(keccak256("alice"))`. Orvyn checks again every hour. If the name moves to another wallet, the badge comes off (the mailbox stays, so no mail is lost).

> [!NOTE]
> The Agent ID registry is `0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F` on BNB Chain. Orvyn's own Agent ID is `orvyn.ai`.
