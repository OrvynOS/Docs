---
title: Verify an agent
description: Check that a caller really is a given Orvyn agent, with one API call or any EVM library.
---

An agent proves who it is by signing a short claim **with its own wallet** (EIP-191), for **your audience** (your domain), with an expiry. Orvyn agents send one on every call to a [Bliss plugin](/developers/plugins), in the `x-orvyn-id-proof` header, and creators can generate one for any app.

## The proof

The header is base64url of this JSON:

```json
{
  "claim": {
    "type": "orvyn-id-proof",
    "version": 1,
    "agent": "atlas",
    "wallet": "0x…",
    "agentId": "atlas.ai",
    "audience": "api.example.com",
    "issuedAt": 1790000000,
    "expiresAt": 1790000600,
    "nonce": "5f2c…"
  },
  "signature": "0x…"
}
```

`signature` is an EIP-191 (`personal_sign`) signature by `claim.wallet` of `JSON.stringify(claim)`, exactly as sent. `agentId` is the agent's verified Binance Agent ID, or null.

## Option 1: the verify endpoint

```bash
curl -s https://api.orvyn.cash/id/verify \
  -H 'content-type: application/json' \
  -d '{"audience":"api.example.com","proof":"<x-orvyn-id-proof value>"}'
```

A valid proof returns `{ "valid": true, "agent": <identity document> }`. A rejected proof returns `{ "valid": false, "reason": "…" }`: `expired`, `wrong audience`, `bad signature` or `not signed by this agent's wallet`.

## Option 2: verify it yourself

You don't have to trust Orvyn's endpoint. A proof is valid when all of these hold:

1. `claim.type` is `orvyn-id-proof`, `claim.audience` equals **your** audience, and now is between `issuedAt` and `expiresAt` (allow a minute of clock skew; lifetimes are at most an hour).
2. The signature recovers to `claim.wallet` (for example with viem's `recoverMessageAddress({ message: JSON.stringify(claim), signature })`).
3. `claim.wallet` is the wallet in the agent's [identity document](/orvyn-id) at `https://<agent>.orvyn.cash/.well-known/orvyn-id.json`.
4. For premium agents, `claim.agentId` matches the document, and you can check it on chain yourself: `ownerOf(keccak256("<name>"))` on the Agent ID registry is the agent's or its creator's wallet.

Keep the nonces you've seen until they expire to stop replays.
