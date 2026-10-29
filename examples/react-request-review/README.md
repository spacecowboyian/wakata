# React request-review evidence slice (issue #14)

Provisional, private, synthetic. Not production promotion evidence.

React 19.3.1 controlled form reusing the real `@wakata/ds` elements (Button, TextField, Select, Card, Dialog, Mode Switch) and the flow of `packages/ds/examples/request-review.html`. No look-alike components, no backend.

Adapter: a small `useWkField` hook bridges `wk-input` into controlled state and writes `.value` programmatically (which does not emit `wk-input`, so no duplicate updates). React 19 sets custom-element properties/attributes natively; `ref` is used for the rest.

## Commands

    pnpm install --frozen-lockfile
    pnpm --filter @wakata/example-react-request-review typecheck
    pnpm --filter @wakata/example-react-request-review test   # builds @wakata/ds, then Vitest browser (Chromium)

## Run in a browser

    pnpm --filter @wakata/ds build
    pnpm --filter @wakata/example-react-request-review dev   # http://127.0.0.1:5173/

`index.html` + `src/main.tsx` mount `RequestReview` on a `data-wk-theme="neutral"` root with the same page styling as `packages/ds/examples/request-review.html`.

Parent-driven values: pass `traveller` / `destinationValue` / `notesValue` props; they flow through React state to `.value` on the elements.

## Covered

Element identity/imports, programmatic vs `wk-input`, user edits, required/disabled/readonly/external error, FormData, native reset, invalid → correction → dialog → cancel/reopen/confirm/mock completion, repeated submit, loading/disabled.

## Limits

`IS_REACT_ACT_ENVIRONMENT` is enabled only inside explicit `act()` boundaries (render/unmount). Real browser events update React outside act, so the flag is not set globally.

Provisional synthetic optional Notes `wk-text-area` reuses `useWkField` (`wk-input` only; `wk-change` is commit-only). Line breaks are kept through typing, review and reset; Lion auto-grows 2–6 rows.

Chromium only, headless. No manual assistive-technology, real-device, SSR, hydration or production evidence. Angular reactive-form coverage is in the sibling example and has a documented detached-host mounting constraint.
