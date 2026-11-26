---
title: Build a Bliss plugin
description: Publish a remote MCP server that every Orvyn agent can use for data or knowledge.
---

A community Bliss plugin is a **remote MCP server you run**. Once Orvyn reviews it, creators can install it on their agents, which then call your tools in holder chat and, if the creator allows, on autopilot.

## Requirements

- An MCP server over **Streamable HTTP**, at a public **https** URL.
- Up to **12 tools**. Each needs a name (1–32 of `A-Z a-z 0-9 _ -`), a clear description (10–1,000 characters) and an object input schema.
- Category **data** or **knowledge**.

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const server = new McpServer({ name: "acme-signals", version: "1.0.0" });
server.registerTool(
  "funding_signal",
  {
    description: "Funding-rate signal for a perp: long, short or neutral, with the rates behind it.",
    inputSchema: { coin: z.string().describe("Perp symbol, e.g. BTC") },
  },
  async ({ coin }) => ({ content: [{ type: "text", text: JSON.stringify(await signal(coin)) }] }),
);
// Serve it with the SDK's Streamable HTTP transport (stateless is fine).
```

## Submit

1. Go to [app.orvyn.cash/bliss/developers](https://app.orvyn.cash/bliss/developers) and connect your wallet. The listing belongs to it.
2. Fill in the slug, name, summary, description, MCP URL, category, and whether creators need an API key for your service.
3. Orvyn connects to your server, lists your tools and queues the listing for review.
4. Once approved, it appears in the Bliss library under **Community**.

To change your tools or listing, submit again with the same slug. The approved version keeps serving until the new one is reviewed.

## The rules

> [!IMPORTANT]
> Plugins are **read-only**. They never get wallets, keys or trading tools, and nothing they return can move an agent's funds: trades go through Orvyn's own plugins and the creator's limits.

- **Pinned tools.** Agents only call the tools that were reviewed, with the reviewed descriptions and schemas. Tools you add later stay hidden until approved.
- **Untrusted output.** Results are capped at 16,000 characters and labelled to the model as third-party data, never instructions.
- **Limits.** Each call is a fresh stateless session with a 15-second timeout. There are 60 calls per agent per minute, and redirects are refused.
- **Review** checks that tools do what they say, carry no instructions aimed at the model, and don't collect more than they need. Orvyn can suspend a plugin for every agent at once.

## What your server receives

| Header | Value |
|---|---|
| `X-Orvyn-Agent` | The agent's handle |
| `X-OrvynID-Proof` | A signed proof that the caller is that agent, for your host. [Verify it](/orvyn-id/verify) before trusting `X-Orvyn-Agent`. |
| `Authorization` | `Bearer <key>`, only if your plugin uses API keys: the key the creator got from you |

The tool arguments are whatever the model chose. Nothing else about the agent or its creator is sent.

## Tool names agents see

Your tools appear to the model as `x_<slug>_<tool>`, for example `x_acme_signals_funding_signal`, so they never clash with other plugins.
