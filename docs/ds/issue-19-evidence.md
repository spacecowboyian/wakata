# Issue #19: provisional Tabs evidence

## Scope and decision

`wk-tabs`, `wk-tab` and `wk-tab-panel` are provisional Wakata components for horizontal,
manually activated tabs. Ian approved a narrow Lit exception on October 29, 2026: Lion 0.25.0
couples arrow-key focus to panel selection through private methods and uses numeric indexes,
which conflicts with the accepted manual-activation, one-string-value contract. This is not a
shared production promotion; no production adoption is claimed.

## Contract

- Each tab and panel has the same unique, nonempty string `value`; `wk-tabs.value` is the selected
  value. The first enabled complete pair is selected by default.
- Invalid, missing, disabled or removed selections normalize silently to that first pair, or `''`
  when none exists. Duplicate tabs and tabs without panels are inert; unpaired panels stay hidden.
- Left/Right arrows and Home/End move focus and skip disabled tabs without changing selection.
  Enter, Space and click activate. Tab leaves the group. The selected tab regains the tab stop after
  focus leaves; if a focused tab loses its panel, focus returns to the fallback selected tab.
- Only user activations that change selection emit one bubbling, composed `wk-change` with
  `{ value }`. Programmatic updates and normalization emit no event. Tabs do not submit a form.
- Only horizontal orientation is supported. At narrow widths, tabs wrap rather than disappear.

## Evidence

Source base: `45f57a2035c29872442dcc56602bc610228a66ed` on `main`. The final revision and CI
URL are recorded on the PR. Node 22.16.0, pnpm 10.33.0, Lion 0.25.0, Lit 3.3.1,
Vitest 4.1.12 and Storybook 10.6.3.

| Check                                                         | Result                                                                                                                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm --dir packages/ds build`                                | Passed                                                                                                                                                             |
| Focused package browser tests                                 | 14/14 each in Chromium, Firefox and WebKit                                                                                                                         |
| `pnpm --dir packages/ds exec vitest run --project stories`    | 116/116 Storybook tests passed, including automated a11y checks                                                                                                    |
| React `test/tabs.browser.test.tsx`                            | 1/1 Chromium passed; controlled value, manual focus/activation and programmatic update                                                                             |
| Angular `test/tabs.browser.test.ts`                           | 1/1 Chromium passed; property/event binding and programmatic update                                                                                                |
| `packages/ds/examples/tabs.html` via Vite                     | Chromium: arrow focus kept `body`, Enter selected `mechanical`, output updated, no page errors                                                                     |
| React and Angular `tabs.html` pages via Vite                  | Chromium: each loaded at `body`, programmatic button selected `records`, output updated, no page errors                                                            |
| `packages/ds/scripts/check-tabs.mjs` against static Storybook | Six phone captures; one selected/visible pair; no page errors or horizontal overflow; manual activation; 320px CSS zoom 2/reduced-motion/44px target checks passed |
| Full serialized package tests                                 | 264/264 passed across 32 files (Chromium)                                                                                                                          |
| React full browser suite                                      | 13/13 passed (Chromium)                                                                                                                                            |
| Angular full browser suite                                    | 11/11 passed (Chromium)                                                                                                                                            |
| `pnpm typecheck`, `pnpm check:boundaries`                     | Passed                                                                                                                                                             |
| `pnpm --dir packages/ds build-storybook`                      | Passed, including the Tabs capture and geometry script                                                                                                             |
| `pnpm lint`                                                   | Passed after final formatting                                                                                                                                      |

Story IDs: `components-tabs--default`, `--alternate-selection`, `--manual-activation`,
`--disabled-tab`, `--long-content-narrow`, `--controlled-update`,
`--themes-modes-wireframe`, `--nested-scope`. Phone captures are in `packages/ds/review/tabs/`.
They show selected light/dark, alternate, long narrow, theme/mode/wireframe and nested scopes.

Local GitHub Copilot CLI inspected Lion in a first pass using 16.02 AI credits and implemented
the initial Lit component/tests in a second pass using 59.47, for **75.49 of the 100-credit
issue cap**. Codex reviewed and completed the contract, examples and further tests.

## Limits

Storybook a11y automation does not establish screen-reader behavior or WCAG conformance.
Manual Mac VoiceOver/Safari and physical-device evidence remains deferred to #59.
Windows/NVDA remains untested in #45. CSS zoom 2 is a reflow proxy, not an actual browser-zoom
or physical-device pass. Owner visual/API acceptance is pending.
