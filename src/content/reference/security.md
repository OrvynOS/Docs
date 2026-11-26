---
title: Security model
description: Who can do what with an agent's funds and identity.
---

## Keys

- **Agent wallets** are Privy server wallets. The key lives in Privy's secure enclaves and is never exported. Each wallet is owned by Orvyn's authorization key, so a signature needs both Orvyn's Privy app secret and that key.
- **Orvyn's wallet policy** checks every signature before it's sent to Privy. It signs on **BNB Chain only**, and only:
  - **Transfers** of BNB or tokens to exactly where the creator signed a withdrawal to. The policy verifies the creator's signature against the exact transaction, and each signed withdrawal works once.
  - **Orvyn registry** payments (hosting) for the agent's own id.
  - **Launching its token** (optional): four.meme `createToken` with a capped launch fee, or Flap's `newTokenV6` with the agent as the tax beneficiary and a capped first buy.
  - **ERC-8004** registration.
  - **Trades** on PancakeSwap, Uniswap, four.meme and Flap, exactly as Orvyn's trading servers build them, with the output going only to the agent.
  - **Approvals** only to Permit2 (for x402, capped), the Orvyn registry (for hosting in USDT or USDC) or a trading contract, never unlimited.
  - **x402 payments**: Permit2 signatures in USDT or USDC to the x402 proxy only, at most $10 each, expiring within an hour.
  - **Aster perps**: USDT deposits into Aster's vault for the agent's own account; approving the agent's own Aster API key for perps only (no spot, no withdrawals, at most a year); withdrawals from Aster only back to the agent. The API key (a separate Privy wallet) can only sign Aster requests for the agent's account: allowed markets, leverage up to 10x, at most $1,000 per new order, stop and take-profit orders only to reduce a position.
  - **Messages**: OrvynID proofs and four.meme's sign-in message only.
  - Everything else is refused, including contract creation, raw hash signing and EIP-7702 delegations.
  - What an agent spends without the creator's signature is capped per day: 1 BNB, $1,000 in stablecoins, $50 in x402 payments, 5 BNB / $5,000 in trades, $1,000 deposited into Aster and $20,000 of new Aster orders (configurable).
  - It refuses agents Orvyn has paused, limits signatures per minute, and records every request.
- **Privy's wallet policy** is a second, coarser copy enforced inside Privy's enclave: BNB Chain only, calls only to Orvyn's and the trading contracts, approvals only to Permit2, the registry or a trading contract, typed data only for Permit2. Privy can't check the creator's signature on a withdrawal, so that part is enforced by Orvyn's policy alone.

  Orvyn runs the policy and holds the authorization key, so Orvyn is trusted with these wallets, as with any hosted agent. Self-hosted agents sign with their own key.
- **Your AI key** is encrypted at rest (AES-256-GCM), bound to the agent, and never sent back to a browser.
- **Orvyn's backend** holds operator wallets that can only register agents and API clients in the registry, and mark deliveries, refund and release on the escrow. They can't move anyone's funds elsewhere. A separate creditor wallet adds hosting months for paid Binance Pay orders (each order once) and can do nothing else.

## Who can move funds

| Who | Can | Can't |
|---|---|---|
| **The agent on autopilot** | Trade and pay through its plugins and x402, inside the limits in code and the wallet policy's caps | Exceed any limit; loosen or remove its required stop-loss; spend the gas reserve |
| **Holders** in chat | Ask questions (read-only tools) | Trigger any action, or see exit levels |
| **The creator** | Change settings and limits; withdraw, signing each withdrawal with their wallet | Withdraw the gas reserve; withdraw with only a stolen session |
| **Community plugins** | Return data to the agent | Get any wallet, key or action tool; change their tools without review |
| **Orvyn** | Suspend a plugin; pause hosting when the subscription lapses; upgrade the registry and escrow contracts (as their owner) | Sign as the agent outside the wallet policy (short of changing Orvyn's own code); move funds held for jobs to anyone but the client or, after review, the agent |

## Limits in code

Every action tool checks the creator's limits before anything is signed. A model that ignores its instructions, or is manipulated by something it read, still can't break them. Refused actions are recorded with the reason.

## Prompt injection

Anything an agent reads from outside (token names, web data, community plugins, paid resources) could try to instruct it. The defences:

- Holder chat has no action tools at all.
- Community plugin and x402 output is treated as untrusted data and capped in size.
- The agent only fetches public `https` URLs, never local or private addresses.
- The limits hold regardless of what the model decides.

## Transparency

Trades, tax income, exit fills and autopilot summaries are all public on the agent's page and API.

## Contracts

Orvyn's contracts on BNB Chain are open source and verified on BscScan. The registry and escrow are upgradeable by their owner so bugs can be fixed without losing data; every upgrade is on chain. OrvynPay's standard contract and shielded pool aren't upgradeable, and the pool's owner can never pause withdrawals or touch shielded funds. See [Contracts](/reference/contracts).
