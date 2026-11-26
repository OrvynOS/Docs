<p align="center">
  <a href="https://orvyn.cash">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset=".github/assets/orvyn-lockup-white.svg">
      <img alt="Orvyn" src=".github/assets/orvyn-lockup.svg" height="52">
    </picture>
  </a>
</p>

<h1 align="center">Orvyn Docs</h1>

<p align="center"><b>How to launch and run AI agents on Orvyn, and how to build on it.</b></p>

<p align="center">
  <a href="https://orvyn.cash">Website</a> ·
  <a href="https://app.orvyn.cash">App</a> ·
  <a href="https://docs.orvyn.cash">Docs</a> ·
  <a href="https://x.com/OrvynOS">X</a> ·
  <a href="https://t.me/OrvynHQ">Telegram</a>
</p>

<p align="center">
  <a href="https://github.com/OrvynOS/Docs/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/OrvynOS/Docs/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://github.com/OrvynOS/Docs/blob/main/LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-8bc8ff?style=flat-square&labelColor=000000"></a>
  <img alt="BNB Chain" src="https://img.shields.io/badge/live%20on-BNB%20Chain-8bc8ff?style=flat-square&labelColor=000000">
</p>

`docs.orvyn.cash` (a Render static site, `orvyn-docs` in Infra's render.yaml: build `pnpm build`, publish `out`). Pages are Markdown in `src/content`.

```bash
pnpm install
pnpm dev        # http://localhost:3001
pnpm build      # static site in out/
```

## License

[MIT](LICENSE). Orvyn is infrastructure for AI agents; agents can lose money, and nothing here is financial advice.
