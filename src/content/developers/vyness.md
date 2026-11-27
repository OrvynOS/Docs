---
title: Vyness
description: Run Claude Code, OpenCode, Aider or any OpenAI-compatible coding agent on Orvyn AI, paid from your Orvyn credits.
---

**Vyness** runs the coding agent you already use on **Orvyn AI**. Sign in once with your Orvyn account and every request is paid from your **Orvyn credits**: no separate subscription, and no provider keys to manage. Anyone with an Orvyn account can use it.

| Agent | Command | Speaks |
| --- | --- | --- |
| Claude Code | `vyness claude` | Anthropic Messages |
| OpenCode | `vyness opencode` | OpenAI Chat Completions |
| Aider | `vyness aider` | OpenAI Chat Completions |
| Anything else | `vyness run -- <command>` | Both |

## Install

Vyness is a single binary. Install it with Rust (from [Core](https://github.com/OrvynOS/Core), where its source lives):

```bash
cargo install --git https://github.com/OrvynOS/Core vyness
```

Install the agent you want too, for example Claude Code with `npm install -g @anthropic-ai/claude-code`.

## Sign in

```bash
vyness login
```

Vyness shows a code and opens [app.orvyn.cash/device](https://app.orvyn.cash/device). Approve it there, and Vyness gets an **Orvyn AI key for this computer**. The key is saved in `~/.vyness/config.json`, readable only by you. Signing in again on the same computer replaces that computer's key. Every computer's key is listed under **API keys** on the [Credits page](https://app.orvyn.cash/credits), as "Vyness · <computer name>", and you can revoke it there.

## Run an agent

```bash
vyness claude                 # Claude Code, on your default model
vyness claude --model anthropic/claude-opus-5.5
vyness opencode               # OpenCode, with an "Orvyn AI" provider
vyness aider src/main.rs      # Aider, on your default model unless you pass --model
vyness run -- my-agent --task "fix the tests"
```

Agents start on **your default model**: Claude Haiku 5.5 unless you choose another. Change it with `vyness model <id>` (or in Orvyn Chat), see it with `vyness model`, and go back with `vyness model --reset`. For one run, pass `--model` (or set `VYNESS_MODEL`). In Claude Code, `/model` still switches between the Opus, Sonnet and Haiku tiers.

Arguments after the command go to the agent unchanged.

`vyness run` and `vyness env` set the following variables, so any tool that reads them works:

| Variable | Value |
| --- | --- |
| `ANTHROPIC_BASE_URL` | `https://api.orvyn.cash` |
| `ANTHROPIC_AUTH_TOKEN` | your Vyness key |
| `OPENAI_BASE_URL`, `OPENAI_API_BASE` | `https://api.orvyn.cash/v1` |
| `OPENAI_API_KEY`, `ORVYN_API_KEY` | your Vyness key |

## Credits

```bash
vyness credits     # your balance
vyness models      # the models Orvyn AI serves
vyness model       # your default model (vyness model <id> to change it)
vyness status      # who is signed in on this computer
vyness logout      # forget this computer's key
```

Coding agents send a lot of context, so watch your balance. Requests cost the same as any [Orvyn models API](/developers/inference) request, at the prices on the Credits page. When your balance runs out, the agent gets a clear "out of Orvyn credits" error; top up at [app.orvyn.cash/credits](https://app.orvyn.cash/credits). Your spending shows up as **Vyness** in the credits history.

## The Messages endpoint

Vyness uses Orvyn AI's Anthropic-compatible endpoint, which you can also call directly with any Orvyn API key:

```bash
curl https://api.orvyn.cash/v1/messages \
  -H "x-api-key: $ORVYN_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{ "model": "anthropic/claude-sonnet-5.5", "max_tokens": 1024, "messages": [{ "role": "user", "content": "Hello" }] }'
```

It supports streaming, tools, extended thinking and prompt caching (`anthropic-beta` is passed through). `POST /v1/messages/count_tokens` gives an estimate, and `GET /v1/credits` returns the key's balance.

## Build your own

Vyness signs in with [Sign in with Orvyn](/developers/oauth): the device flow, with the first-party client `orv_vyness` and the scope `inference`. It exchanges the access token for a key with `POST /api/vyness/key` (`{ "device": "<computer name>" }`). The `inference` scope is first-party only. Third-party apps use API keys from the Credits page.
