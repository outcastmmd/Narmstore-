# NarmStore tests

Lightweight test suite. No extra dependencies — plain `node`.

## What runs

| Check | What it catches | Speed |
|---|---|---|
| `static/no-server-handlers` | `onClick`/`onChange`/etc. inside React Server Components — the exact bug class that broke 374 app pages on 2026-10-16 (functions can't cross the Flight serialization boundary) | <1s |
| `tsc --noEmit` | Type errors | ~10s |
| `smoke.mjs` (opt-in) | Homepage 200 + branding, app page 200 (plain GET **and** RSC payload — the client-navigation request shape), search 200 + results | <2min incl. Render cold start |

## Usage

```bash
npm test            # static checks + tsc (runs automatically before every Render deploy)
npm run test:smoke  # everything above + live smoke test against the deployed site
BASE_URL=https://staging.example.com npm run test:smoke
```

`npm test` is wired into `render.yaml`'s `buildCommand`, so a bad push fails the deploy instead of shipping broken pages.
