---
title: Orvyn Worlds
description: Dream worlds streamed live as players explore them, the session protocol, and how to put a world model behind it.
---

A dream world (`orvyn-world/1`) is a game played inside a world that's generated as you move. Orvyn Worlds (`crates/worlds`, Rust, MIT) streams it.

```json
{ "format": "orvyn-world/1", "title": "Dune Dusk", "description": "…", "model": "dream",
  "prompt": "A golden dusk over endless dunes and still water", "seconds": 300, "size": [640, 360] }
```

## Models

| Model | What it does | Needs |
|---|---|---|
| `dream` | Orvyn's own generated landscapes, shaped by the prompt (voxel terrain, sky, fog and water) | Nothing: runs on a CPU, also locally in Vyn desktop |
| `yume` | YUME 1.5: walks into the world's picture (`image`) | A GPU; the world must be paid or token-gated |
| `worldplay` | HY-World 1.5 (Tencent): stays consistent as you explore | A GPU; not in the EU, the UK or South Korea (licence) |

## A session

1. The play page asks Orvyn: `POST /api/games/{id}/world?t=<play token>`.

   Orvyn checks:
   - access;
   - the model's licence where the player is;
   - one open world per player;
   - for GPU models, the player's daily allowance.

   It returns `{ url, seconds, notice }`: a WebSocket URL signed for that player, world and time.
2. The page connects.

   The server sends, in order:
   - `{type:"loading"}` while the model starts;
   - `{type:"ready", width, height, fps, seconds}` with the first frame;
   - then JPEG frames as binary messages, and `{type:"time", left}` each second.

   The page sends `{type:"keys", keys:["w","right"]}` whenever the held keys change, and `{type:"end"}` to leave.
3. At the end the server sends `{type:"ended", reason, seconds}`, then reports the seconds used to Orvyn (`POST /api/worlds/usage`, signed with the shared key).

The clock starts at the first frame, so a model loading never costs the player time.

## Put a model behind it

A model runs as one process per session, speaking the model protocol (`crates/worlds/models/orvyn_world.py` helps):
- **In,** as JSON lines on stdin:
  - `{type:"start", prompt, image, width, height, fps}` first;
  - `{type:"keys", keys}` on each change;
  - `{type:"stop"}` at the end.
- **Out,** on stdout: frames, each a 4-byte big-endian length followed by a JPEG.

List models in `WORLDS_MODELS_FILE`: `{ "yume": { "command": [...], "fps": 16 } }`.

Run the server with `WORLDS_KEY` (shared with the API's `ORVYN_WORLDS_KEY`), `ORVYN_API_URL` and `WORLDS_SLOTS` (sessions at once: one per GPU). Set `ORVYN_WORLDS_URL` on the API.
