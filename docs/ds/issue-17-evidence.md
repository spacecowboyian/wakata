# Issue #17: provisional Checkbox and Switch evidence

## Decision and scope

Ian approved two product choices for this issue: Switch is an immediate setting outside form
submission, and a required CheckboxGroup needs at least one selection. Indeterminate/tri-state
is excluded. This is a **provisional contribution** to Wakata's private DS package, owned by Ian;
it is not shared production promotion. The synthetic HTML, React and Angular examples are not
production use. Final visual/API acceptance is pending. Shared promotion would require actual
usage by at least two distinct production features and an approval record under
[governance.md](governance.md); neither is claimed here. Migration automation versus notification
remains undecided for any later promotion.

## Implementation and automated checks

- `wk-checkbox` extends LionCheckbox with native light-DOM input, visible label, optional help and
  external error, required validation, disabled behavior, FormData serialization and silent reset.
  Checked submits its `choiceValue` under `name`; unchecked and disabled submit nothing. A native
  checkbox is used for keyboard, focus, role, name and state.
- `wk-checkbox-group` extends LionCheckboxGroup with a visible group label, help/error association
  and a one-or-more `required` rule. Children explicitly share the group's `name` in the HTML and
  framework fixtures; each checked choice produces a repeated FormData entry.
- `wk-switch` extends LionSwitch and uses its scoped switch button. It has a stable label and no
  form submission or required/readonly API. A user click, label click, Space or Enter emits one
  `wk-input` and one `wk-change` on an actual state change; programmatic writes are silent.
- The React request/review example uses controlled Boolean state and keeps Switch outside the
  form. Angular uses a dedicated Boolean ControlValueAccessor for Checkbox and a signal for
  Switch. Both test native serialization, reset, user/programmatic changes and the required group.
- Package exports, idempotent registration, public README contract, plain HTML fixture and
  Storybook stories are included. Themes/modes/wireframe and adjacent/nested scope stories use
  the existing tokens. No new theme token, production adoption or migration path is claimed.

Local toolchain: Node 22.16.0, pnpm 10.33.0, TypeScript 5.9.3, Lion 0.25.0,
Storybook 10.6.3 and Vitest 4.1.12. Verification before PR:

| Check                                                                              | Result                                                        |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `pnpm --filter @wakata/ds build` and `pnpm typecheck`                              | Passed                                                        |
| `pnpm lint` and `pnpm check:boundaries`                                            | Passed                                                        |
| `pnpm --filter @wakata/ds exec vitest run --no-file-parallelism`                   | 225/225 Chromium tests passed, including 10 new focused tests |
| `WK_BROWSER=firefox ... test/checkbox-switch.browser.test.ts`                      | 10/10 passed                                                  |
| `WK_BROWSER=webkit ... test/checkbox-switch.browser.test.ts`                       | 10/10 passed                                                  |
| `pnpm --filter @wakata/example-react-request-review test`                          | 11/11 Chromium tests passed                                   |
| `pnpm --filter @wakata/example-angular-request-review test`                        | 9/9 Chromium tests passed                                     |
| `pnpm --filter @wakata/ds exec vitest run --project stories --no-file-parallelism` | 99/99 Storybook tests passed                                  |
| `pnpm build-storybook`                                                             | Passed on final revision                                      |

The default parallel `pnpm test` twice lost a Vitest browser iframe during unrelated Link or
ModeSwitch keyboard tests. Both failures were test-runner frame detachment, not an assertion in
Checkbox/Switch. The full DS suite passed when files ran serially. CI results on the PR will be
recorded separately.

## Visual and functional review

Story IDs include `components-checkbox--unchecked`, `--checked`, `--disabled`, `--focused`,
`--required-and-error`, `--required-group`, `--group-error`, `--long-label-narrow`,
`--themes-modes-wireframe`, `--nested-scope`, and equivalent Switch off/on/focused/disabled,
long-label, matrix and nested-scope stories. Phone PNGs in
`packages/ds/review/checkbox-switch/` show checked, group, error, Switch on/off, long label,
HTML form and React/Angular examples. All text is synthetic.

Headless Chromium checks found no horizontal overflow at 375 or 390 CSS px for captured stories
and examples, nor at 320 px for long labels and synthetic CSS zoom 2. The 320 px checks used
`prefers-reduced-motion: reduce`. The native checkbox itself measured 24 × 24 CSS px; its visible
label row provides a 44 px activation area. Switch button focus target measured at least 44 px
high. The HTML fixture loaded without page errors and serialized selected `areas[]` plus consent;
Switch remained outside the form. React and Angular at 390 px each serialized selected
`channels[]` and had no page errors or horizontal overflow.

## Open limits

Owner visual/API acceptance remains pending. The browser and Storybook checks do not establish
manual screen-reader behavior, physical touch behavior, actual browser zoom, or production use.
Manual accessibility/device work is deferred to #59; Windows/NVDA research is #45. The rendered
theme matrix is not a manual contrast audit. This record supports a provisional contribution
review only.
