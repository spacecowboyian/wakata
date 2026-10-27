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

| Check                                                                           | Result                                                                                                   |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `pnpm test`                                                                     | 148 DS tests (package and Storybook), 8 React, 6 Angular in Chromium; mode-switch HTML smoke also passes |
| `WK_BROWSER=firefox pnpm --filter @wakata/ds exec vitest run --project package` | 87/87 package tests                                                                                      |
| `WK_BROWSER=webkit pnpm --filter @wakata/ds exec vitest run --project package`  | 87/87 package tests                                                                                      |
| React fixture with `WK_BROWSER=firefox` and `WK_BROWSER=webkit`                 | 8/8 in each engine                                                                                       |
| Angular fixture with `WK_BROWSER=firefox` and `WK_BROWSER=webkit`               | 6/6 in each engine                                                                                       |
| `pnpm typecheck`, `pnpm lint`, `pnpm build-storybook`, `pnpm check:boundaries`  | Pass on the final branch revision                                                                        |

The integrated HTML test covers the synthetic invalid → correction → review → cancel,
reopen and confirm flow. It now exercises neutral, studio and fieldwork themes in light
and dark modes, with the dialog retaining its nested studio origin. A representative
global reset is applied while form input, Select and submit targets remain at least
44 px tall and the flow still completes. The Select's shadow container needs its own
44 px minimum: Playwright WebKit otherwise rendered the native select at 21 px.

The native input and select remain in light DOM for forms and accessibility. A host
`!important` rule can override their slotted styles; the reset test demonstrates this
boundary. The components do not promise immunity from arbitrary host CSS.

Playwright WebKit on macOS skips a plain native radio on Tab with its default keyboard
preference; Option+Tab reaches it. The mode-switch test uses that native traversal key
in this engine, then verifies focus, arrow-key changes and event propagation. This is
not a manual Safari or VoiceOver result.

## Required evidence still missing

- Manual Mac Safari with VoiceOver: names, required/error announcements, tab and radio
  behavior, Select, dialog focus containment and return. Record the OS/browser/VoiceOver
  versions, script, reviewer and sanitized observations.
- Narrow and desktop visual comparison to the approved references across all three
  hosts; long content, zoom/reflow, reduced motion, target and contrast review. The
  existing phone captures in #44 are examples, not final sign-off or real-device proof.
- An explicit gate decision with owner and known limitations. The current branch tests
  cannot by themselves close #14 or certify shared production use.
- Windows/NVDA was deferred by Ian on 27 October 2026 and remains untested. Research
  spike #45 will determine an affordable Windows browser and manual NVDA path. Neither
  Playwright WebKit on macOS nor Chromatic snapshots establish NVDA behavior.

SSR, hydration, native-mobile use, a real backend and production adoption remain out
of scope. No manual assistive-technology, real-device or Windows claim is made here.
