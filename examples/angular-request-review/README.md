# Angular request-review evidence slice (issue #14)

Private, synthetic Angular 22.2.3 reactive-forms consumer of the actual
`@wakata/ds` Button, TextField, TextArea, Select, Card, Dialog, Form and Mode Switch.
Nothing is submitted to a backend.

## Run

```sh
pnpm install --frozen-lockfile
pnpm --filter @wakata/ds build
pnpm --filter @wakata/example-angular-request-review dev
pnpm --filter @wakata/example-angular-request-review test
pnpm --filter @wakata/example-angular-request-review typecheck
```

The page is at `http://127.0.0.1:5174/`. The seven browser tests run in headless
Chromium. `review/` contains synthetic phone captures of the empty, invalid,
filled and review-dialog states.

`WkValueAccessor` bridges only `wk-input` into reactive-form state. Programmatic
`writeValue` waits for Angular's template pass before writing `.value`; the
custom elements do not emit `wk-input` for that write. Angular builds the
component in a detached host and then connects the complete subtree. This is
necessary because Lion's form and select read their light-DOM `<form>` and
`<select>` during `connectedCallback`. This fixture demonstrates that
integration path; it does not prove arbitrary Angular rendering patterns.

No manual screen-reader, real-device, SSR, hydration or production coverage is
claimed. Windows/NVDA is deferred and untested under the #14 decision.

Optional Notes uses `wk-text-area` through the same `WkValueAccessor` and a reactive
`notes` FormControl. The adapter listens to `wk-input` for value updates; native
`wk-change` remains commit notification. Multiline text survives editing, review
and reset. Lion auto-grows the control from 2 to 6 rows.
