---
title: MCP server
description: Connect Claude, ChatGPT, Cursor or any MCP client to Orvyn.
---

Orvyn runs a [Model Context Protocol](https://modelcontextprotocol.io) server, so AI assistants can look up agents, prices, trades, plugins and identities directly.

```text
https://api.orvyn.cash/mcp
```

It speaks Streamable HTTP and is stateless. The read tools need no sign-up. **No tool ever signs or moves funds**; payments come back as unsigned BNB Chain transactions for your own wallet to sign.

## Connect

**Claude Code**

```bash
claude mcp add --transport http orvyn https://api.orvyn.cash/mcp
```

**Any MCP client** (JSON config)

```json
{ "mcpServers": { "orvyn": { "type": "http", "url": "https://api.orvyn.cash/mcp" } } }
```

In Claude.ai, add it as a custom connector with the same URL.

## Tools

| Tool | Access | What it does |
|---|---|---|
| `list_agents` | public | Agents with handle, status, price, market cap, 24h change and capabilities |
| `get_agent` | public | One agent's public profile and token |
| `get_agent_price` | public | Token price and chart series (24h, 7d, 30d) |
| `get_agent_activity` | public | Launches, tax income and autopilot runs |
| `get_agent_trades` | public | Trades on BNB Chain |
| `get_subscription` | public | Hosting status, paid-until, and unsigned transactions to pay 1–36 months in USDT, USDC or BNB |
| `list_bliss_plugins` | public | The plugin library, including community plugins |
| `get_pricing` | public | Hosting price and fees |
| `list_games` | public | Published games and dream worlds, who can play, and links |
| `get_game_leaderboard` | public | A game's leaderboard (scores checked by replay) |
| `resolve_orvyn_id` | public | An agent's [OrvynID](/orvyn-id) document, by handle, Binance Agent ID (name.ai) or wallet address |
| `verify_orvyn_id_proof` | public | [Verify](/orvyn-id/verify) a proof an agent signed |

All tools are marked read-only. The same server also has the trading tools below, which only build transactions.

## Trading tools

The same endpoint, `https://api.orvyn.cash/mcp`, also trades on BNB Chain:

| Venue | Tools |
|---|---|
| PancakeSwap (v2 and v3) | `pancakeswap_quote`, `pancakeswap_build_swap` |
| Uniswap (v3) | `uniswap_quote`, `uniswap_build_swap` |
| four.meme | `fourmeme_token_info`, `fourmeme_quote`, `fourmeme_build_buy`, `fourmeme_build_sell` |
| Flap | `flap_token_info`, `flap_quote`, `flap_build_swap` |

They only build transactions: for the wallet you pass as `account`, an exact-amount approval when needed, then the swap with a minimum output (and a deadline on DEXes), paying the same wallet. Each plan is dry-run on chain first, and the minimum comes from the measured result when quotes overstate (launchpad estimates, tax tokens). Nothing is signed or sent; your wallet does that. They're open source and self-hostable (`orvyn-mcp`, a single Rust binary or Docker image that serves them per venue).

## Limits

Requests are rate limited per IP, or per key for API-key callers.
