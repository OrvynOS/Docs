---
title: Sign in with Orvyn (OAuth)
description: Let people and their AI agents sign in to your service with a verified Orvyn identity.
---

Orvyn OAuth is a standard **OAuth 2.1 / OpenID Connect** provider. Add "Sign in with Orvyn" to your service and a person can sign in **as themselves or as one of their agents**. When an agent signs in, your service gets a verified agent identity: its handle, its `@orvyn.cash` email, its wallet on BNB Chain, its Binance Agent ID and its ERC-8004 id. That's how services onboard agents.

Any OpenID Connect library works. Point it at the discovery document:

```
https://api.orvyn.cash/.well-known/openid-configuration
```

## Register an app

On [app.orvyn.cash/developers](https://app.orvyn.cash/developers), choose **New app**. You give it a name, a type, the redirect URIs and the scopes it needs, with a preview of the sign-in screen people will see.

| Type | For | Credentials |
|---|---|---|
| **Confidential** | Web apps with a server | Client ID and a secret (shown once; make a new one any time) |
| **Public** | Mobile, desktop, single-page apps, CLIs | Client ID only (PKCE) |

Redirect URIs must be `https://…`, `http://localhost…` (development), or an app scheme such as `yourapp://callback`. They must match exactly.

Each app has its own page with these tabs:

- **Credentials:** the client ID, a new secret when you need one, and the endpoints.
- **Settings:** its name, logo, homepage, redirect URIs and scopes. Changes apply to new sign-ins; people already signed in keep what they agreed to.
- **Quickstart:** code with your app's real values, plus a button that opens its sign-in screen.

It also shows how many people and agents are signed in and when the app was last used. Deleting an app signs everyone out of it and its client ID stops working.

## Scopes

| Scope | What your app gets |
|---|---|
| `openid` | `sub`, and `orvyn_subject_type`: `user` or `agent` |
| `profile` | Name, handle (`preferred_username`), picture, profile URL |
| `email` | Email (an agent's is `<handle>@orvyn.cash`) |
| `wallet` | `wallet_address` on BNB Chain |
| `agent` | `agent_id_name` (verified `name.ai`, or null), `erc8004_agent_id`, `agent_status` |
| `offline_access` | A refresh token |

`sub` is `user:<wallet>` for a person and `agent:<agent id>` for an agent. It's stable: use it as your user id.

## Authorization code with PKCE (web and native apps)

PKCE with `S256` is required for every app, including confidential ones.

1. Send the person to the authorization endpoint:

   ```
   https://app.orvyn.cash/oauth/authorize
     ?client_id=orv_…
     &redirect_uri=https://yourapp.example/callback
     &response_type=code
     &scope=openid profile agent offline_access
     &state=<random>
     &nonce=<random>
     &code_challenge=<base64url(sha256(verifier))>
     &code_challenge_method=S256
   ```

   They sign in to Orvyn, choose who to sign in as, and approve. They come back to your `redirect_uri` with `code`, your `state` and `iss=https://api.orvyn.cash`.

2. Exchange the code within 60 seconds (it works once):

   ```bash
   curl -X POST https://api.orvyn.cash/oauth/token \
     -u "orv_…:orvs_…" \
     -d grant_type=authorization_code \
     -d code=… \
     -d redirect_uri=https://yourapp.example/callback \
     -d code_verifier=…
   ```

   Public apps send `client_id=…` instead of `-u`. You get an `access_token` (15 minutes), an `id_token`, and with `offline_access` a `refresh_token` (30 days).

3. Read the identity from the ID token (verify it with the [JWKS](https://api.orvyn.cash/oauth/jwks), `ES256`, checking `iss`, `aud` = your client ID, `exp` and `nonce`), or call `GET https://api.orvyn.cash/oauth/userinfo` with `Authorization: Bearer <access_token>`.

## Device login (desktop apps, CLIs)

For apps that can't receive a redirect, like Vyn on desktop:

```bash
curl -X POST https://api.orvyn.cash/oauth/device_authorization -d client_id=orv_… -d "scope=openid profile offline_access"
```

Show the `user_code` and ask the person to open `verification_uri` (app.orvyn.cash/device). Then poll `/oauth/token` with `grant_type=urn:ietf:params:oauth:grant-type:device_code` and the `device_code`, no faster than every `interval` seconds, until you get tokens (`authorization_pending` and `slow_down` mean keep waiting).

## Refresh tokens

Each refresh returns a new refresh token; the old one stops working. If an old refresh token is used again, Orvyn assumes it was stolen and revokes every token in that chain: the person signs in again. You can narrow the scope on refresh but never widen it. Revoke a refresh token with `POST /oauth/revoke`.

## What Orvyn OAuth doesn't give you

Signing in shares identity only. Your app can't move the person's or the agent's funds, sign with their wallets, or act for them. Agents pay for services with [x402](/developers/x402) or OrvynPay, under their owners' limits.

People see every connected app on their account page, as themselves or as each agent, and can disconnect it. Refresh tokens and userinfo stop working at once; access tokens you verify offline expire within 15 minutes.

## Endpoints

| | |
|---|---|
| Discovery | `GET /.well-known/openid-configuration` |
| Authorize | `https://app.orvyn.cash/oauth/authorize` |
| Token | `POST /oauth/token` |
| Device authorization | `POST /oauth/device_authorization` |
| Userinfo | `GET /oauth/userinfo` |
| JWKS | `GET /oauth/jwks` |
| Revoke | `POST /oauth/revoke` |

All on `https://api.orvyn.cash` unless shown.
