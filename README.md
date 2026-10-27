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

## Storybook public preview

Provisional public preview (available after the first successful main deployment):
https://spacecowboyian.github.io/wakata/. This is not shared production promotion
or evidence of production adoption; `@wakata/ds` remains private and provisional.

The `Storybook Pages` workflow builds `packages/ds/storybook-static`. Main updates
on Storybook-affecting pushes or a manual `workflow_dispatch` run against `main`
for first publish/refresh. Same-repository PRs targeting `main` that affect
Storybook get temporary previews at
`https://spacecowboyian.github.io/wakata/pr/<number>/`, refreshed on commits and
reopening, and removed on close/merge. Fork PRs do not get previews. Existing CI
still validates PRs; the additional Pages build produces the preview artifact.

The base workflow uses `pull_request_target`: a separate read-only job builds the
exact PR head with no persisted credentials, passed repository secrets, deployment
environment, or shared dependency cache. The privileged publisher checks out only
trusted `main`, checks current PR state/SHA to reject stale builds, validates numeric paths and static
files (rejecting symlinks), and never executes the PR artifact. Preview JavaScript
is nevertheless public, unreviewed content on the same origin: do not use secrets
or sensitive data in stories or treat preview content as trusted.

`gh-pages` is bootstrapped automatically as **static storage**, not as the Pages
source. Main updates preserve `pr/`; preview updates/removals preserve main and
other previews. A single non-cancelling publish queue serializes branch writes
and full-site artifact deployments (GitHub's queue limit is 100 pending jobs).
GitHub Pages is deployed using official Actions, not the unavailable alpha
`deploy-pages` preview feature. Storybook's relative asset/iframe URLs support
both mount paths without a hardcoded Vite base.

Repository Pages must use **GitHub Actions** as its source; an owner must
configure that separately if needed. The `github-pages` environment must permit
trusted `main`-context runs, including `pull_request_target` (and may require
approval). No PR head branch needs environment deployment permission. The workflow
does not change settings or bypass protection rules. Branch rules must also allow
`GITHUB_TOKEN` to write the static `gh-pages` branch. These permissions and live
Pages behavior require verification after merge; they have not been tested by a
local build.

Local checks: `node --test scripts/pages-site.test.mjs` verifies storage
preservation/removal and invalid paths/symlinks;
`pnpm --filter @wakata/ds exec node scripts/check-pages.mjs` (after
`pnpm build-storybook`, with Chromium installed) checks manager navigation,
deep-link reloads, direct iframes, and asset requests under both mount paths.
After deployment, verify the main URL, two simultaneous PR previews, updates to
one without disturbing the others, and close/merge cleanup. Failed or skipped
runs must be resolved/re-run; fork previews and automatic retries are not provided.

## Adding the next component

1. Create `packages/ds/src/components/<name>/` with `wk-<name>.ts` (class only), `define.ts` (idempotent registration plus `HTMLElementTagNameMap`), `index.ts` and `<name>.stories.ts` with play tests.
2. Export the class from `src/index.ts`, import `define.ts` from `src/define.ts`, and add `./<name>` and `./<name>/define` entries to `packages/ds/package.json` `exports`.
3. Read only `--wk-*` tokens (add new ones to `src/tokens/tokens.ts` and the theme CSS).

## Adding the next project

Add a folder under `apps/*` or `packages/*` (both globs are reserved) with its own `package.json`. Scripts named `build`, `test`, `typecheck` run automatically from the root; add root scripts only for new entry points.

## Licenses

Lion (`@lion/ui`, MIT, ING Bank NV), Lit (BSD-3-Clause, Google LLC), `@open-wc/dedupe-mixin` (MIT) and axe-core (MPL-2.0, used by Storybook's a11y addon) notices are kept in [`packages/ds/licenses`](packages/ds/licenses). The package is `private` and publishing is disabled while the contract is provisional.
