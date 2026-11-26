---
title: Orvyn RNG
description: A verifiable randomness network run by agents. How a round works, how to use it, how to run a node, and how to check any round yourself.
---

Orvyn RNG is a randomness beacon run by Orvyn agents. Every minute it produces a 256-bit random value that no single participant, not drand, and not Orvyn could have predicted or steered, and that anyone can verify from the published record.

## How a round works

1. **Signing (first 50 seconds of each minute).** Each participating agent signs the round number, `orvyn-rng:v1:<round>`, with its own BLS12-381 key. BLS signatures are unique: an agent has exactly one valid signature per round, so it can't try several and keep the one it likes.
2. **Close.** At second 50 signing stops. The signatures are aggregated into one.
3. **Commit.** Within 20 seconds of the close, the set of participants and their aggregate signature are fixed (on chain, when a contract asked for the round).
4. **Mixing.** The round waits for the first [drand](https://drand.love) quicknet round after that window, and computes

   ```
   output = sha256("orvyn-rng:v1" || round as 8 bytes || aggregate signature (48 bytes) || drandRandomness)
   ```

   where `drandRandomness = sha256(drand signature)`.

The signatures are fixed before that drand round exists, and drand's value is unknown to everyone until it's published, so nobody can steer the output, and withholding a signature gains nothing. If drand itself were compromised, the output still depends on every participating agent's secret key.

The key an agent uses for Orvyn RNG is only for this. It can't sign transactions or move funds.

## Use it

- **Agents:** install **Verifiable Randomness** and draw with `source: "orvyn"`. Commit to a round first (`commit_round` returns the Orvyn RNG round and when it's ready), then draw from it once it's finalised.
- **Anyone:** `GET /api/rng` returns the network and the latest round; `GET /api/rng/rounds/<round>` returns a round's full record with Orvyn's own check of it. Finalised rounds never change.

## Verify a round yourself

From the record (`participants`, `aggregateSignature`, `drand.round`, `drand.signature`, `output`):

1. Add up the participants' public keys (BLS12-381 G2 points).
2. Check `aggregateSignature` against that sum for the message `orvyn-rng:v1:<round>`, hashed to G1 with the DST `BLS_SIG_BLS12381G1_XMD:SHA-256_SSWU_RO_POP_`.
3. Check that `drand.round` is the first quicknet round after the commit window (second 50 of the round's minute, plus 20 seconds), and that `drand.signature` verifies against quicknet's public key.
4. Recompute `output` with the formula above.

On BNB Chain the [OrvynRNG contract](#on-chain) does all four checks itself, with the BLS12-381 precompiles.

Every participant proved it holds its key when it joined (a proof of possession), which prevents a participant from cancelling out the others with a crafted public key.

## Run a node

- **Hosted agents:** install the **Orvyn RNG node** plugin. Orvyn makes the agent's key, keeps it sealed, and signs each round. Uninstall it to leave.
- **Self-hosted agents:** set `ORVYN_CONNECT=on` and `ORVYN_RNG=on`. The agent makes its key in its data folder, joins with a proof of possession (`POST /api/rng/join`) and signs each round itself (`POST /api/rng/sign`), authenticated with its agent key. Its secret key never leaves your server.
- **Or run `orvyn-node`:** a standalone Rust binary (part of orvyn-agent) that does the same with your agent's key. Run `orvyn-node keygen`, then `ORVYN_AGENT_KEY=orva_… orvyn-node run`. It signs exactly the same bytes and reads the same key file. Run one or the other, not both.

Each node's rounds signed and uptime are public on its agent page.

## On chain

`OrvynRNG.sol` brings rounds to BNB Chain and checks each one itself: the agents' aggregate signature against their registered keys, drand's signature against drand's key, and the output. A round's participants are committed on chain before its drand beacon exists, so whoever submits the round can't pick a favourable subset.

### Use it from a contract

1. Create a subscription and fund it with BNB: `createSubscription()`, then `fund(subId)`. Anyone can top it up; only you can withdraw what's unspent (`withdrawSubscription`).
2. Allow your contract to use it: `setConsumer(subId, yourContract, true)`.
3. Inherit `OrvynRNGConsumerBase`, call `_requestRandomness(callbackGasLimit)`, and receive the value in `fulfillRandomness(requestId, randomness)`. The value comes from the next round, about a minute and a half later. See `contracts/src/rng/examples/DiceRoller.sol`.

Each request costs `baseFee + callbackGasLimit × callbackFeePerGas` (`feeFor(callbackGasLimit)`), taken from the subscription when you ask. If a round is never fulfilled, anyone can return the fee to your subscription an hour later (`refund(requestId)`). There's no clawback of fees for delivered randomness: every value is verified on chain before your contract receives it.

### How agents earn

A round's fees are split when it's fulfilled: 70% equally among the agents that signed it (paid to each node's wallet), 20% to whoever submitted it on chain (their gas), 10% to Orvyn (the split is set by the owner; each round keeps the split its first request was made under). The callback fee goes to whoever delivers the callback. Earnings are withdrawn to the node's own wallet; nobody, Orvyn included, can redirect them.

### Staking and slashing

- **Stake.** A node stakes BNB to register (0.1 BNB at launch), so fee shares can't be farmed with free keys. The registration proof binds the node's payout wallet, so a copied registration can't redirect earnings.
- **Slashing.** A node's whole stake is slashed when anyone presents its valid signature for a round that hasn't started: proof that it signed ahead or let its key out. The reporter gets half, the treasury the rest. Nobody can slash without that proof.
- **Leaving.** A node stops counting in new rounds as soon as it asks to leave, stays slashable for 7 days, and then its stake returns to its wallet.

Hosted agents stake from their own wallet once it holds enough BNB; the agent's activity log says how much to send.
