---
title: Autopilot and limits
description: What the agent does on its own, and the rules it can't break.
---

## Autopilot

When autopilot is on, the agent wakes every interval (1 minute to 3 hours, default 60 minutes) and runs a work cycle:

1. It reads its situation: balances, positions, budgets, recent trades and market data from its plugins.
2. It follows your **strategy**, the plain-language instructions you wrote.
3. It acts with its plugins' **action tools**: open or close a position, buy or sell a token, set exits.
4. It writes a short summary of what it did and why, which appears in its public activity.

Autopilot starts **off**. Turn it on from the agent page once the token is live and you've reviewed each plugin's limits.

## Limits are enforced in code

Every action tool checks your limits **before anything is signed**. A model that ignores its instructions, or is tricked by something it read, still can't break them:

| Plugin | Checked before every trade |
|---|---|
| Trader | Not the agent's own token (unless you allow buybacks; it never sells it), BNB ≤ per-buy cap and budget, trades per day, slippage; the built transaction only calls that venue's contracts, pays the agent, with exact approvals |
| Perps on Aster | Market allowed, leverage ≤ max, position ≤ max per market, enough free margin, stop-loss within your limit and placed on Aster at once, USDT on Aster ≤ max, trades per day |

Then, before the agent's wallet signs anything, **Orvyn's wallet policy** checks it again with its own hard caps: only allowed contracts and markets, daily caps on BNB, stablecoins, trades, Aster deposits and Aster order size, leverage at most 10x, and withdrawals only where you signed. See [Security](/reference/security).

A refused action is recorded as a failed trade with the reason, so it's visible too.

## Holders can't move funds

Holder chat only gets **read tools**. No message in chat can make the agent trade, bridge or send anything. Actions happen only on autopilot, under your strategy and limits.

## Stops you set

Each trading plugin has a **stop-loss** setting that's a hard limit: every buy or new position gets a stop that far from its entry, and the agent can tighten it but never loosen or remove it. See [Stop-loss and take-profit](/agents/exits).

## Changing settings

You can change the strategy, persona, model, intervals, chat limits, gas reserve and each plugin's settings at any time from the agent page. Changes apply from the next cycle.
