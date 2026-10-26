# Wakata DS progress checkpoints

Source: `7e8810a` plus the current branch changes; see `issue-8-verification.md` for the current run. Chromium headless only. Earlier checkpoints below are historical.

## #8/#9 continuation — 25 October 2026

The already-applied regression patch passed `pnpm test`: 6 files / 54 Chromium tests, including 12 new form/theme cases. `pnpm typecheck`, `pnpm check:boundaries`, `pnpm lint`, and `pnpm build-storybook` passed. Root lint scope was corrected to exclude unchanged vendored DS Ops fixtures. No component assertion failed in the fresh run.

#8/#9 remain open for the separate contract and acceptance gates: Card/Dialog details, overlay focus/theme behavior, shared light/dark/system control, reference renders, framework/browser/device and manual AT coverage. The current baseline is provisional; production usage and shared promotion have not been established.

## #9 checkpoint 2 (criteria assessment)

Gate after adding the story, example and docs: lint 0, typecheck 0, build 0, `pnpm test` 0 (5 files / 42 tests), `pnpm build-storybook` 0.

Added: `form-buttons.stories.ts` (submit/reset, keyboard and implicit submit, disabled, destructive reset, theme × light/dark × wireframe matrix with computed-style play assertions), `examples/form-buttons.html` (synthetic; needs a bundler to resolve `@wakata/ds`, not run by me), README and API docs, and the contract's external-error wording (`after` slot).

Form-button `loading`: investigated through public Lion APIs only; no safe solution (Lion's click delegation is registered in its constructor). Documented as a known gap.

Verdict: #9 code and behavior criteria are met in Chromium. Not verified:

- The HTML example was not executed.
- Matrix assertions check computed colour and radius, not a contrast audit.
- Firefox, WebKit, React and Angular fixtures and manual assistive-technology runs are untested.
- Form-button `loading` is a known gap.

---

Gate, run directly with unmasked exit codes:

| Check                  | Result                            |
| ---------------------- | --------------------------------- |
| `pnpm lint`            | pass (exit 0)                     |
| `pnpm typecheck`       | pass (exit 0)                     |
| `pnpm build`           | pass (exit 0)                     |
| `pnpm test`            | pass (exit 0), 4 files / 37 tests |
| `pnpm build-storybook` | pass (exit 0)                     |

Verified by tests:

- `wk-button-submit` / `wk-button-reset` (Lion-backed): mouse, Enter, Space, implicit submit, invalid-form block, reset, disabled, inert outside a form.
- `wk-input` / `wk-change` come from the native control events. Programmatic writes and reset do not emit them.
- External error, for empty and nonempty fields:
  - It sets `aria-invalid="true"`.
  - Clear restores the baseline `aria-describedby` exactly.
  - The external-error node and ID are gone after clear, and the help association is kept.
  - `aria-invalid` returns to `false`.
- With a Lion Required error showing, an external error added then cleared leaves Lion's IDs and `aria-invalid="true"` unchanged. Lion feedback text is deliberately not asserted.
- Reset, FormData serialization, Required on submit, fieldset.

The error is rendered in the `after` slot and linked via the public `addToAriaDescribedBy` / `removeFromAriaDescribedBy`. This supersedes the "feedback slot" wording in `issue-8-contract.md`.

Vite reload instability fixed with `optimizeDeps.include` in the `package` Vitest project.

Remaining #9 gaps (untested or not done):

- Form-button `loading`: unresolved and omitted (no private API, no global listener).
- No form-button Storybook story or play test yet.
- No synthetic HTML example harness yet.
- No README or API docs for the form infrastructure yet.
- Theme, light/dark and wireframe checks of the form buttons are untested.
- React and Angular fixtures, Firefox and WebKit, VoiceOver/Safari and NVDA/Chrome are untested.
