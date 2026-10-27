# Representative-slice evidence (#14)

**Status:** Partial evidence. The gate is open and component expansion is not unblocked. The
plain HTML fixture arrived in #42; React and Angular fixtures arrived in #44. All three
use the built, unpublished `@wakata/ds` 0.0.0 package. These synthetic examples are not
production adoption or a shared production promotion.

## Tested environment

| Item            | Version / scope                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| Host            | macOS 15.7.6 (24G707), Apple Silicon                                                                   |
| Tooling         | Node 22.16.0, pnpm 10.33.0, Playwright 1.64.1, Vitest 4.1.12                                           |
| Browser engines | Chrome for Testing 156.0.8078.4, Firefox 157.0, Playwright WebKit 27.2; headless on this Mac           |
| Frameworks      | React and React DOM 19.3.1; Angular core/forms/compiler 22.2.3                                         |
| DS identity     | The same built workspace package, `@wakata/ds` 0.0.0, consumed by the HTML, React and Angular examples |

## Automated results on this branch

| Check                                                                           | Result                                                                                                       |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `pnpm test`                                                                     | 148 DS tests (package and Storybook), 8 React, 6 Angular in Chromium; mode-switch HTML smoke also passes     |
| `WK_BROWSER=firefox pnpm --filter @wakata/ds exec vitest run --project package` | 87/87 package tests                                                                                          |
| `WK_BROWSER=webkit pnpm --filter @wakata/ds exec vitest run --project package`  | 87/87 package tests                                                                                          |
| React fixture with `WK_BROWSER=firefox` and `WK_BROWSER=webkit`                 | 8/8 in each engine                                                                                           |
| Angular fixture with `WK_BROWSER=firefox` and `WK_BROWSER=webkit`               | 6/6 in each engine                                                                                           |
| `pnpm typecheck`, `pnpm lint`, `pnpm build-storybook`, `pnpm check:boundaries`  | Pass on the final branch revision                                                                            |
| `pnpm --filter @wakata/ds exec node scripts/check-slice-visual.mjs`             | Three hosts at phone/desktop light/dark; 320 px and CSS zoom reflow; reduced motion; matching phone geometry |

The integrated HTML test covers the synthetic invalid → correction → review → cancel,
reopen and confirm flow. It now exercises neutral, studio and fieldwork themes in light
and dark modes, with the dialog retaining its nested studio origin. A representative
global reset is applied while form input, Select and submit targets remain at least
44 px tall and the flow still completes. The Select's shadow container needs its own
44 px minimum: Playwright WebKit otherwise rendered the native select at 21 px.

The native input and select remain in light DOM for forms and accessibility. A host
`!important` rule can override their slotted styles; the reset test demonstrates this
boundary. The components do not promise immunity from arbitrary host CSS.

The [host visual captures](../../packages/ds/review/slice/README.md) cover phone and
desktop light/dark states in all three hosts, plus a narrow CSS-zoom state. An
independent review found matching layout and no obvious clipping in those captures.
The script checks geometry, target height and overflow; Ian has not yet accepted these
as final visual references. CSS zoom 2 at a 640 px viewport approximates a 320 px
effective layout width. It is not a browser-zoom or physical-device test.

Playwright WebKit on macOS skips a plain native radio on Tab with its default keyboard
preference; Option+Tab reaches it. The mode-switch test uses that native traversal key
in this engine, then verifies focus, arrow-key changes and event propagation. This is
not a manual Safari or VoiceOver result.

## Direct Safari spot check on merged `main`

On 27 October 2026, a clean checkout of `3c95c6e` was built with
`pnpm install --offline --frozen-lockfile` and `pnpm --filter @wakata/ds build`,
then served locally with Vite. In Safari 26.3 on macOS 15.7.6, the plain HTML
`examples/request-review.html` fixture showed the native input and Select with
their names in Safari's accessibility inspection. Submitting an empty request
displayed the correction status. Entering a synthetic name and selecting Oslo
opened the review Dialog; Escape closed it and returned focus to Review request.
Tab moved focus to Cancel while the Dialog was open.

Safari's actual page zoom was set to 200% using its Page Menu. At the tested
desktop window size, the form remained usable and a long synthetic name wrapped
inside the Dialog without visible clipping. This is a desktop spot check, not a
narrow-window, real-device or all-host zoom result. During both normal and 200%
Dialog checks, the native accessibility-inspection tool returned an HTML-content
node without dialog descendants while the Dialog was open, despite visible
Dialog controls and keyboard focus. That observation needs investigation with
VoiceOver; it is not treated as proof of either a screen-reader failure or pass.
VoiceOver was not successfully activated or reviewed in this check. Safari zoom
was restored to 100% afterwards.

## Required evidence still missing

- Manual Mac Safari with VoiceOver: names, required/error announcements, tab and radio
  behavior, Select, dialog focus containment and return. Record the OS/browser/VoiceOver
  versions, script, reviewer and sanitized observations.
- Owner review of the new host captures against approved references; long-content
  across hosts, narrow-window browser zoom, contrast and real-device review. The
  Safari desktop 200% spot check above covers only one host/window. Narrow
  reflow, reduced motion and target dimensions have automated evidence, but the
  screenshots and phone captures in #44 are examples, not final sign-off or
  real-device proof.
- An explicit gate decision with owner and known limitations. The current branch tests
  cannot by themselves close #14 or certify shared production use.
- Windows/NVDA was deferred by Ian on 27 October 2026 and remains untested. Research
  spike #45 will determine an affordable Windows browser and manual NVDA path. Neither
  Playwright WebKit on macOS nor Chromatic snapshots establish NVDA behavior.

SSR, hydration, native-mobile use, a real backend and production adoption remain out
of scope. No manual assistive-technology, real-device or Windows claim is made here.
