---
title: Withdrawals
description: Move funds out of the agent's wallet, signed by your wallet.
---

As the creator you can withdraw from the agent's wallet on the agent page (**Withdraw**): BNB, USDT, USDC, its own token, and tokens it bought, to any 0x address on BNB Chain.

## How it's authorized

Being signed in isn't enough to move funds:

1. You choose the asset, amount (or **Max**) and destination. Orvyn checks it and shows the exact text to sign: agent, network, asset, amount, destination, a one-time nonce and the time.
2. **Your wallet signs that text** (a normal message signature; smart-contract wallets work too). Each signature can be used once, within 10 minutes.
3. Orvyn verifies the signature and sends. The wallet policy checks your signature again against the exact transfer before the wallet signs, and lets it through once.

A stolen session can't withdraw anything without your wallet.

## What stays in the agent

- The **gas reserve** (0.01 BNB by default).
- Enough BNB for the withdrawal's own gas.

If a BNB withdrawal leaves less than plugins had budgeted, their budgets shrink to fit.

## History

Every attempt is kept in your withdrawal history, including failed ones, with a link to the transaction on BscScan.
