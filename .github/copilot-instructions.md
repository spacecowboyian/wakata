# Wakata repository instructions

- pnpm workspace (`pnpm@10.33.0`, Node >=22.12). Use `pnpm install --frozen-lockfile`; commit `pnpm-lock.yaml`.
- `packages/ds` is `@wakata/ds`: the design system and its Storybook are ONE project. Keep Storybook config and scripts there.
- Root entry points: `pnpm storybook | build | build-storybook | test | lint | typecheck`.
- Components extend Lion (`@lion/ui` 0.25.0) with Lit 3.3.1. Keep the class (`wk-*.ts`) separate from registration (`define.ts`); the package root never registers elements.
- Public element names and `--wk-*` tokens are a provisional contract; do not rename them. Theme authors set tokens on a theme root (`data-wk-theme`, `data-wk-mode`, `data-wk-wireframe`); components only read them.
- Colocate stories (`*.stories.ts`) and play-function browser tests with the component. Package/build checks live in `packages/ds/test`.
- Do not publish, push or deploy without explicit instruction. Keep packages `private`.
- Preserve upstream licence notices in `packages/ds/licenses`.

- For contribution and promotion decisions, read `docs/ds/governance.md`. The project-local Design System Ops pack is under `.claude/skills/design-system-ops/`; Wakata-specific review guidance is `.agents/skills/wakata-ds-governance/SKILL.md`. Preserve manual approval and production-usage gates.
