---
title: Orvyn Engine reference
description: The orvyn-game/1 file format, behaviours, rules, actions, and the Rhai and TypeScript script APIs.
---

A game is one JSON file in the `orvyn-game/1` format. The engine is open source (Rust, compiled to WebAssembly for the browser): `crates/engine` in the Orvyn repository.

## The file at a glance

```text
Orvyn Engine games are one JSON file:
{ "format": "orvyn-game/1", "title", "description", "size": [w, h] (the game's own resolution, e.g. [480, 270]), "background": "#hex", "seed", "start": "<scene>",
  "vars": { game-wide variables },
  "prefabs": { name: entity },
  "scenes": { name: { "gravity": [x, y], "bounds": [x, y, w, h], "camera": { "follow": tag, "zoom" }, "entities": [...], "tilemap": { "tile": [w, h], "rows": ["#..s.."], "legend": { "#": { "color": "#hex" }, "s": "prefabName" } }, "rules": [...] } },
  "assets": { "images": { name: { "src": "file.png" | "data:...", "frame": [w, h], "anims": { name: { "frames": [0, 1], "fps": 8 } } } }, "sounds": { name: "file.wav" | "data:..." } },
  "scripts": { "main.rhai": "...", "logic.ts": "..." },
  "touch": { "pad": "leftright" | "dpad", "buttons": ["space"] } }

Entity: { "id", "prefab", "tags": [], "pos": [x, y] (top-left), "size": [w, h], "shape": "rect"|"circle", "color", "sprite": { "image", "frame", "anim" }, "text": { "value": "Score {score}", "size", "color", "align" }, "body": "none"|"static"|"dynamic"|"kinematic", "sensor": true (overlaps only), "vel": [x, y], "layer", "hud": true (screen space), "behaviours": [...], "vars": {} }
Behaviours: platformer {speed, jump} (arrows/WASD, up or space jumps), topdown {speed}, patrol {speed, range, vertical}, follow {target, speed}, bounce, wrap, spin {speed}, lifetime {seconds}, offscreen, pointer {axis}.
Rules: { "when": { "event": "start"|"tick"|"every" (seconds)|"key" (key, state pressed|down|released)|"tap" (tag)|"collide" (a, b tags)|"var" (name, op, value) }, "if": [{ "var", "op", "value" } | { "count": tag, "op", "value" } | { "chance": 0.3 }], "do": [actions] }
Actions: set {var, value, on}, add {var, value, on}, spawn {prefab, at: target | pos, offset, vel}, destroy {target}, move {target, to | by}, velocity {target, vel}, change {target, visible, color, text, anim}, sound {sound}, shake {strength, seconds}, scene {scene}, restart, win {message}, lose {message}, call {function}. Targets: "self"/"a", "b" (the other in a collision), "tag:<name>", or an entity id. Messages and HUD text fill in {var}.
Rhai scripts (run everywhere): on_start(), on_tick(dt), on_collide(a, b), functions rules call; API create(prefab, x, y), destroy, x, y, vx, vy, set_pos, set_vel, on_ground, find(tag), first, count, has_tag, get/set (game or entity vars), key, pressed, pointer_x/pointer_y/pointer_down, random, random_int, time, sound, shake, scene, restart, win, lose, text, color, visible, anim, log. (spawn is reserved in Rhai: use create.)
TS/JS scripts (browser): export function onStart(api), onTick(api, dt), onCollide(api, a, b), and functions rules call (api, a, b); api.spawn, destroy, entity, setPos, setVel, find, get, set, random, sound, scene, win, lose, text, key, pressed. Prefer no-code rules and Rhai: they're checked headless before publishing; TS only runs in the browser.
```

## Three ways to make a game, mixed freely

- **No code.** Behaviours (`platformer`, `topdown`, `patrol`, `follow`, `bounce`, `wrap`, `spin`,
  `lifetime`, `offscreen`, `pointer`) and rules: *when* `start`, `tick`, `every`, `key`, `tap`,
  `collide`, `var` → *if* variable, count or chance → *do* `set`, `add`, `spawn`, `destroy`,
  `move`, `velocity`, `change`, `sound`, `shake`, `scene`, `restart`, `win`, `lose`, `call`.
- **Rhai scripts** (`*.rhai`), run inside the engine, so they work everywhere: `on_start()`,
  `on_tick(dt)`, `on_collide(a, b)`, and functions rules `call`. API: `create`, `destroy`, `x`, `y`,
  `vx`, `vy`, `set_pos`, `set_vel`, `on_ground`, `find`, `first`, `count`, `has_tag`, `get`/`set`
  (game or entity variables), `key`, `pressed`, `pointer_x`/`pointer_y`/`pointer_down`, `random`,
  `random_int`, `time`, `sound`, `shake`, `scene`, `restart`, `win`, `lose`, `text`, `color`,
  `visible`, `anim`, `log`. Each call is limited (operations, depth, sizes), so a script can't hang
  a game: it stops with the error instead.
- **TypeScript/JavaScript** (`*.ts`, compiled to JS before publishing; `*.js`), run by the browser
  player as ES modules: `onStart(api)`, `onTick(api, dt)`, `onCollide(api, a, b)`, and functions rules
  `call`, with the same operations (`api.spawn`, `api.find`, `api.get`, …).

## How it runs

- Fixed 60 Hz steps from the player's input; seeded randomness. The same game and the same inputs
  give the same frames, every time.
- Each step returns a frame: what to draw (rectangles, circles, sprite-sheet frames, text), sounds
  to play, the game's status (running, won, lost) and variables. The engine never draws, so
  servers can run games headless.
- Physics: solid static and kinematic bodies, falling dynamic bodies that land and stop at walls,
  sensors that report overlaps, tilemaps (runs of solid tiles merged), a following camera kept
  inside the scene, screen shake.
- `validate` explains every problem in a game file (missing prefabs, images, sounds or scenes,
  bad keys or colours, scripts that don't compile), written for the person or agent making it.
  `smoke_test` plays it headless to catch run-time errors before publishing.

## Rules of the road

- Positions are top-left corners, in the game's own pixels (`size`); the player scales the game to fit the screen.
- Text and end messages fill in variables: `"Score {score}"`, and `{self.hp}` for an entity's own.
- Keys: `left`, `right`, `up`, `down`, `space`, `enter`, `shift`, `escape`, `a`–`z`, `0`–`9`. Platformers and top-down movement also take WASD.
- Make games original: never copies of existing games, their characters, art, music or levels.

## Leaderboards and saves

```json
"leaderboard": { "var": "score", "order": "high", "label": "Coins" },
"save": ["level", "unlocked"]
```

- **`leaderboard`:** each player's best value of `var` when a run ends (won or lost). Use `"$time"` for the fastest win: seconds, lower is better, and only won runs count.
- **`save`:** variables kept for each signed-in player between plays. The score variable can't also be saved.

The player records its input: each key change, and each pointer change in whole game pixels. When a run ends, the play page sends `POST /api/games/{id}/scores?t=<play token>` with `{ log, version, save }`. Orvyn replays the log in the engine against that published version, and keeps the score only if the replay produces it.

The engine is deterministic: the same game, seed and input always give the same result. That's why leaderboard games must run entirely in the engine (rules and Rhai, no TypeScript/JavaScript scripts).

Saves come from `GET /api/games/{id}/save?t=…` with a signed token. A run that starts from a save carries that token, so its replay starts from exactly that state. `PUT` writes a save, limited to the `save` list and 16 KB.

`GET /api/games/{id}/scores` returns the board: the top players (names are social handles or short addresses, never emails) and, when signed in, your own place.

## Playtesting

Every check runs three bots for 30 seconds each:
- `idle` presses nothing;
- `explorer` heads for whatever the rules reward and steps around what they punish, jumping when it's blocked;
- `random` holds random keys.

They report errors, getting stuck, falling out of the level, scores that never change, games that never end, and games no bot could win. The results are in `check.playtest` (`findings`, plus each bot's result). They're advice and don't block publishing.

The engine exports this as `orvyn_playtest`. With `sheet: true` it adds a PNG contact sheet of snapshots, drawn by the engine's own small renderer (no browser needed). Replays are exported as `orvyn_replay`.
