# Wakata repository architecture (scaffold)

Status: working setup notes, not an approved contract. Sources: Notion architecture draft, #25 (planning epic), #26 (shared-boundary discovery gate), #21 (bounded UI proof). Nothing here completes or approves #21, #25 or #26, and no schema or brand contract is implied.

## Direction

Wakata covers UI, static social, video social and print. Shared brand intent, appropriate tokens/assets, contracts and governance are kept separate from output-specific contracts and renderers. There is no universal runtime schema or renderer. Ordinary versioned contracts are canonical; AI skills and MCP servers are adapters over them. Governance stays in `docs/ds/governance.md`; this file does not change it.

## Layers and dependency direction

Dependencies point to strictly lower layers only. `pnpm check:boundaries` enforces this for any workspace package present.

| Layer | Location                                     | Status now                                           |
| ----- | -------------------------------------------- | ---------------------------------------------------- |
| 0     | `packages/contracts`, `packages/tokens`      | Not created. Content blocked on the #26 decision.    |
| 1     | `packages/ds` (`@wakata/ds`, Lion/Lit)       | Exists. Unchanged; Storybook stays here.             |
| 2     | `adapters/*` (e.g. `adapters/react`)         | Not created. Thin, generated around the web package. |
| 3     | `examples/*` (plain-html, print-queue-react) | Not created. Belong to the #21 proof.                |

Unlayered: `apps/*` and `packages/tooling` (reserved; create `packages/tooling` only when more than one script needs shared code — the boundary check lives in `scripts/` until then).

Directories are created when they have real content. Empty scaffolds would imply decisions that are still open. Adding a package in a new location requires updating the layer map in `scripts/check-boundaries.mjs` and the table above; unknown locations fail the check. Native rendering is a later, distinct implementation, not an adapter of the web package.

## Authored versus generated

- Authored sources live in `src/` (and docs, contracts, stories). Edit by hand and review.
- Build outputs go to `dist/` and `storybook-static/` (git-ignored).
- Committed generated artifacts, if ever needed, go in a directory named `generated/` containing a `README.md` that names its source and how to regenerate. The check fails otherwise. Never hand-edit `generated/`.
- No generator is chosen yet; the contracts they would read are undecided.

## Rules checked

- Every workspace package is `private` and named `@wakata/*`.
- Workspace dependencies follow the layer direction above and reference existing packages.
- Every `generated/` directory documents its source.

## Out of scope here

Tokens or contracts content, React bindings, examples, native rendering, media renderers, new licences, and moving existing DS sources. The upstream Design System Ops tree in `.claude/skills/design-system-ops/` is untouched.
