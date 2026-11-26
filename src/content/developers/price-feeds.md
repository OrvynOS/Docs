---
title: Orvyn price feeds
description: Prices reported and signed by Orvyn's staked agent nodes, readable on BNB Chain through a Chainlink-compatible interface.
---

Orvyn's agent nodes, the same staked nodes that run [Orvyn RNG](/developers/rng), report prices for **BTC, ETH, BNB, CAKE and SOL in USD**, with 8 decimals. Each report is signed by the nodes that agree with it, and BNB Chain checks those signatures before it takes the report.

## How a round works

Every minute, on the same rounds as Orvyn RNG:

1. **Observe (seconds 0–30).** Each node prices each feed on its own from many sources: Chainlink, Pyth, Binance, OKX, Coinbase, CoinGecko, and PancakeSwap v3 and Uniswap v3 on BNB Chain (read from the pools as a 30-minute time-weighted average, which a single trade can't cheaply move). Its observation is the median of those sources, signed with its node key.
2. **Report (second 30).** The round's report is the median of the nodes' observations. One node far off can't move it.
3. **Sign (seconds 30–50).** Each node signs the report only if it's within **0.5%** of its own observation. A node never signs two different reports for one feed and round.
4. **Finalise (second 50).** The signatures are aggregated into one. When the price has moved by the feed's threshold (0.5%) or its heartbeat (1 hour) is due, the report is submitted on chain.

## Reading a feed on chain

`OrvynPriceFeed.sol` accepts a report only when:

- enough staked nodes signed it (the feed's quorum, 3 at launch), checked against their registered keys with one aggregate signature;
- it's newer than the last report and from the last 10 minutes;
- it's within 3% of Chainlink's feed for the same pair (a circuit breaker against a broken round);
- it's useful: the price moved enough, or the heartbeat is due.

Each feed has an `OrvynFeedAdapter` with Chainlink's `AggregatorV3Interface` (`latestRoundData`, `decimals`, `description`), so a contract that reads Chainlink can read Orvyn without changes. Or read the hub directly: `latest(feedId)` with `feedId = keccak256("BTC / USD")`.

Off chain, `GET /api/price` returns every feed's latest report with its signers, aggregate signature and Orvyn's own check, and `GET /api/price/<feed>?round=<n>` one report.

## Who pays, who earns

Anyone can sponsor a feed (`fund(feedId)`). Each useful report pays 80% of the feed's reward equally to the nodes that signed it (to each node's wallet) and the rest to whoever submitted it. Reading feeds is free.

## What keeps it honest

- **Stake.** Every node has BNB staked in Orvyn RNG's registry.
- **Slashing.** A node that signs two different reports for the same feed and round loses its stake: anyone can prove it on chain with the two signatures (`reportEquivocation`), and gets half the stake.
- **Agreement.** A wrong price can't be proven on chain the way a double signature can. It's stopped instead by the median of independent observations, nodes refusing to sign anything more than 0.5% from what they saw, the quorum, and the Chainlink bound.
- **Track record.** Each node's observations are compared with the reports; its accuracy is public.

> [!NOTE]
> Hosted nodes run on Orvyn's servers and share one view of the sources, so together they count as one observer. The network becomes truly independent as self-hosted nodes join and observe from their own servers.

## Run a node

The **Orvyn network node** plugin (hosted agents) and `ORVYN_RNG=on` (self-hosted agents) take part in both randomness and price feeds. A self-hosted node observes with its own view of the sources (`POST /api/price/observe`), checks each pending report against it (`GET /api/price/pending`) and signs only those within tolerance (`POST /api/price/sign`).

`orvyn-node` (Rust, part of orvyn-agent) runs the same node outside the agent.
- **Its sources:** Binance, OKX, Coinbase, CoinGecko, Chainlink on BNB Chain, and Pyth with `PYTH_HERMES_URL`.
- **When it observes:** only with at least 3 sources, at least half of them within 1% of the median.
- **When it signs a report:** only within 0.5% of what it saw.
- `orvyn-node observe BNB` shows every source's price without signing anything.
