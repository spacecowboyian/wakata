# Wakata

Wakata is a broader AI source of truth for business visuals. This monorepo starts with **DS** (working title), the design system and its Storybook, as one project: [`packages/ds`](packages/ds).

## Requirements

Node >=22.12 (see `.nvmrc`) and pnpm 10.33.0 (`corepack enable`).

## Commands

| Command                 | What it does                                                                     |
| ----------------------- | -------------------------------------------------------------------------------- |
| `pnpm install`          | Install from `pnpm-lock.yaml`                                                    |
| `pnpm storybook`        | Storybook dev server on http://localhost:6006                                    |
| `pnpm build`            | Build `@wakata/ds` (ESM + declarations + theme CSS)                              |
| `pnpm build-storybook`  | Static Storybook to `packages/ds/storybook-static`                               |
| `pnpm test`             | Build, then run browser tests (Chromium via Playwright)                          |
| `pnpm lint`             | ESLint and Prettier check                                                        |
| `pnpm typecheck`        | TypeScript across the workspace                                                  |
| `pnpm check:boundaries` | Package layers and generated-output rules ([architecture](docs/architecture.md)) |

First test run needs a browser: `pnpm --filter @wakata/ds exec playwright install chromium`.

## Adding the next component

1. Create `packages/ds/src/components/<name>/` with `wk-<name>.ts` (class only), `define.ts` (idempotent registration plus `HTMLElementTagNameMap`), `index.ts` and `<name>.stories.ts` with play tests.
2. Export the class from `src/index.ts`, import `define.ts` from `src/define.ts`, and add `./<name>` and `./<name>/define` entries to `packages/ds/package.json` `exports`.
3. Read only `--wk-*` tokens (add new ones to `src/tokens/tokens.ts` and the theme CSS).

## Adding the next project

Add a folder under `apps/*` or `packages/*` (both globs are reserved) with its own `package.json`. Scripts named `build`, `test`, `typecheck` run automatically from the root; add root scripts only for new entry points.

## Licenses

Lion (`@lion/ui`, MIT, ING Bank NV), Lit (BSD-3-Clause, Google LLC), `@open-wc/dedupe-mixin` (MIT) and axe-core (MPL-2.0, used by Storybook's a11y addon) notices are kept in [`packages/ds/licenses`](packages/ds/licenses). The package is `private` and publishing is disabled while the contract is provisional.
