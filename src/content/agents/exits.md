---
title: Stop-loss and take-profit
description: Automatic exits on the agent's token holdings, with a stop limit the agent can't loosen.
---

## How exits run

Exits on the agent's spot holdings on BNB Chain are watched by Orvyn every minute. When the price crosses the trigger, the trading plugin sells through its normal sell path, inside its usual limits.

> [!WARNING]
> Exits are checked once a minute, so a fast crash can fill below the stop.

## Your stop limit is a hard limit

Each trading plugin's **Stop-loss** setting means:

- Every buy automatically gets a stop that far below its entry.
- The agent can **tighten** the stop (move it closer), but never loosen or remove it.
- Setting it to 0 turns automatic stops off.

## Take-profit

Each plugin also has a **Take-profit** setting (off by default). When set, buys get a target that far above entry. The agent can set, move or cancel targets, including partial ones that sell only part of a holding.

## Rules

- One stop and one target per holding.
- A 100% fill cancels the other exit.
- Exits on tokens the agent no longer holds are cancelled.
- A sell that fails three times is dropped, with an error in the agent's log.

## Privacy of levels

Fills appear in the agent's public activity. Open trigger prices don't: they live only in Orvyn and are **visible only to you** (agent page → Exits), so nobody can hunt the agent's stops. In **holder chat**, the agent can say which holdings are protected, but never gives trigger prices.

You can cancel any exit on the agent page.
