# Issue #18: provisional RadioGroup evidence

## Decision and scope

RadioGroup is a provisional Wakata component built on Lion 0.25.0. It is not a shared production
promotion. The proposed API is `wk-radio-group` plus `wk-radio`, matching the existing Wakata
CheckboxGroup shape. Owner visual/API review is pending. No production adoption is claimed.

## Contract and implementation

- One string value, `''` for no selection; native light-DOM radio inputs share the group name.
- Visible group and option labels, help and error text; required means one selected option.
- Initial `checked` option is restored by reset; programmatic `value` and reset do not emit
  `wk-input`/`wk-change`. User selection emits each once with `{ value, name }`.
- HTML sets Lion's property-only `choiceValue` after custom element upgrade. The React example
  uses the existing controlled-value hook; Angular uses the existing string value accessor.
- Styling uses existing theme tokens. No custom arrow-key handler, orientation API, or new tokens.

## Evidence record

Source base: `2c943f3cc369552ea02b45aad18583816642c435` on `main`. Final revision and CI URL
will be recorded on the PR. Node 22.16.0, pnpm 10.33.0, Lion 0.25.0, Lit 3.3.1,
Vitest 4.1.12, Storybook 10.6.3.

| Check                                                                                                          | Result                                                                                                            |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `pnpm --dir packages/ds build`                                                                                 | Passed                                                                                                            |
| `pnpm --dir packages/ds exec vitest run --no-file-parallelism`                                                 | 241/241 passed (package + stories, Chromium)                                                                      |
| `WK_BROWSER=firefox pnpm --dir packages/ds exec vitest run --project package test/radio-group.browser.test.ts` | 7/7 passed                                                                                                        |
| `WK_BROWSER=webkit pnpm --dir packages/ds exec vitest run --project package test/radio-group.browser.test.ts`  | 7/7 passed; Tab left the group, but WebKit on this Mac focused `body` rather than the next button                 |
| `pnpm --dir examples/react-request-review test`                                                                | 12/12 passed (Chromium)                                                                                           |
| `pnpm --dir examples/angular-request-review exec vitest run`                                                   | 10/10 passed (Chromium)                                                                                           |
| `pnpm typecheck`, `pnpm lint`, `pnpm check:boundaries`                                                         | Passed                                                                                                            |
| `pnpm --dir packages/ds build-storybook`                                                                       | Passed; `check-radio-group.mjs` captured phone states and checked upgraded radios, no overflow and no page errors |

The default parallel `pnpm test` run had 239/240 DS tests pass and one unrelated
ModeSwitch test lose its Vitest iframe during keyboard simulation. A serial rerun passed
241/241 after the new RadioGroup story was added. React/Angular focused Vite runs printed
`optimizeDeps.include` resolution warnings for Lion paths, but assertions passed.

Story IDs: `components-radio-group--default`, `--selected`, `--disabled-option`,
`--disabled-group`, `--required-and-error`, `--long-content`, `--controlled-update`,
`--themes-modes-wireframe`, `--nested-scope`. Chromium phone captures in
`packages/ds/review/radio-group/` cover selected light/dark, error, long content, all themes,
and nested scopes. They were visually inspected; selection stays clear without color alone,
long labels wrap, and no horizontal overflow was measured at 390 CSS px.

Local GitHub Copilot CLI created the initial component and focused tests in two bounded runs,
spending 33.64644 and 39.816 AI credits (73.46244 total) of Ian's 100-credit issue cap.
Codex completed framework integration, documentation, cross-browser checks, and final review.

## Open limits

Manual Mac VoiceOver/Safari and physical device evidence remain tracked in #59. Windows/NVDA
remains untested in #45. This record does not claim manual assistive technology, device, or
production evidence. Final owner visual/API acceptance remains pending.
