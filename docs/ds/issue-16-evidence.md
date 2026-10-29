# Issue #16: provisional TextArea evidence

## Decision and scope

Ian chose LionTextarea's native auto-grow behavior: two rows initially, up to six rows, then internal scrolling; drag resizing is disabled. `wk-text-area` reuses the scalar field contract and existing theme tokens. This is a **provisional contribution** to the private DS package, not shared production promotion. Ian is the product owner; final visual/API acceptance is pending. No production feature adoption is claimed. A later promotion would need the production-usage and approval evidence in [governance.md](governance.md).

## Implementation and verification

- `WkTextArea` extends `LionTextarea` with `WkScalarFieldMixin`. The native light-DOM textarea retains line breaks, selection and focus. Required, external error, disabled, readonly, named FormData, silent programmatic updates and reset use the established field pattern.
- Public exports, one-time registration, package documentation, Storybook stories, a plain HTML form, React controlled Notes and Angular reactive-form Notes are included. React listens to `wk-input` once; Angular uses its existing `ControlValueAccessor` path. No new theme token or styling escape hatch was introduced.
- Node v22.16.0, pnpm 10.33.0, TypeScript 5.9.3, Lion 0.25.0, Storybook 10.6.3 and Vitest 4.1.12. Local Playwright browsers: Chromium 156.0.8078.4, Firefox 157.0 and WebKit 27.2.
- `pnpm lint`, `pnpm typecheck`, `pnpm check:boundaries`, `pnpm test`, `pnpm build-storybook`: passed. The full suite ran 198 DS tests, 7 Angular tests and 9 React tests in Chromium. The eight focused TextArea browser tests also passed in Firefox and WebKit. A pre-existing Link activation test was made stable by preventing its same-page navigation while asserting one native activation.
- Automated tests cover newline value/model/serialization/FormData, edit and commit events without duplicate notifications, programmatic update and reset silence, required/external errors and descriptions, disabled/readonly semantics, keyboard selection replacement, accessible name/focus, auto-grow cap, and long unbroken content at narrow width. React and Angular tests cover multiline edits, controlled/programmatic updates, review and reset.
- The plain HTML fixture loaded via Vite without page errors. At 390, 320 and 160 CSS px, it had no horizontal overflow after wrapping its action row. Storybook long-content, empty, filled, error, and auto-grow stories and the React/Angular fixtures had no page errors or horizontal overflow at 390 px. The HTML and long-content story had no horizontal overflow at 320 px with CSS `zoom: 2`; this is a synthetic reflow check, not a manual browser-zoom or device pass.

## Review artifacts

Story IDs: `components-text-area--empty`, `--filled`, `--multiline-long-content`, `--help-and-external-error`, `--required-invalid`, `--disabled-and-read-only`, `--auto-grow-and-max-rows`, `--themes-modes-and-wireframe`, `--nested-scope`. PNG captures in `packages/ds/review/text-area/` use synthetic text: empty, filled, error, long content, auto-grow, plain HTML, and filled React/Angular phone fixtures.

## Open limits

Owner visual/API acceptance remains pending. Automated checks do not establish manual screen-reader behavior, actual browser zoom, real-device touch behavior, or production adoption. Manual accessibility and device evidence is tracked in #59; Windows/NVDA research is #45. The theme matrix is rendered in Storybook, but these captures do not constitute manual contrast or assistive-technology review. No shared production promotion is requested.
