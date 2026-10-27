# Wakata DS issue #8: baseline and slice contract

**27 October 2026 update:** The [#8/#9 resolution record](issue-8-9-resolution.md)
freezes the provisional Card and Dialog implementation contracts and reconciles
the shared mode-switching gate. It supersedes older open-gate and scheduling
statements below where they conflict; historical test results remain historical.

Status: **owner visual/accessibility review approved; technical gate remains open.** Ian approved the reviewed baseline on 2026-10-25. Exact device/test coverage was not specified. The 2026-10-25 follow-up patch is applied to this checkout, preserving existing uncommitted work. A subsequent Chromium run passed 54 tests across 6 files; the earlier local-server permission failure is historical. See [the application and verification record](issue-8-verification.md). Earlier provisional-review wording below is historical. Written 2026-10-24 against Lion `@lion/ui` 0.25.0 and Lit 3.3.1 as installed. Sources: this checkout, installed Lion source, and the earlier proposal (its positive Button contract is withdrawn, see below). Everything here is synthetic and non-secret.

## 1. Owner decisions recorded (2026-10-24)

- Button and the Neutral / Studio / Fieldwork themes are accepted as a **provisional current baseline**. Ian subsequently approved visual and accessibility review on 2026-10-25. This does not certify accessibility or establish cross-framework/device coverage.
- Wireframe **keeps semantic green and red**; strict grayscale is not imposed.
- **Green (`--wk-positive`, `--wk-on-positive`) is only for positive/success notification or status feedback** (for example the later Status component). It is never a Button action.
- Affirmative Button actions use `variant="primary"`. Destructive Button actions use `intent="danger"` (red). `secondary` and `tertiary` stay.
- Slice (Button, TextField, Select, Card, Dialog, plus form/label/help/error infrastructure) and the later seven-family inventory are already approved in epic #7. Combobox and advanced controls stay out.

## 2. Baseline facts

| Fact                       | Value                                                                                                                                                                                                                      | Evidence                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Revision at start          | `7e8810a871f77dabee0761ab550aead6350bb0ae`, branch `feat/ds-monorepo-button`, clean tree                                                                                                                                   | `git status`                               |
| Remote                     | `origin` lists no refs. Source is local only; nothing published.                                                                                                                                                           | `git ls-remote origin`                     |
| DS and Storybook           | Same project: `packages/ds` (`@wakata/ds`, private) with `.storybook` inside                                                                                                                                               | file layout                                |
| Reported vs observed       | Recorded 19/19 Chromium tests: **reproduced fresh** on 2026-10-24 (`pnpm test`). Recorded "17 stories" is 16 stories plus a docs entry.                                                                                    | Storybook `index.json`                     |
| Scoped-theme overflow      | **Defect reproduced** at 375px (page scroll width 489px) and **fixed in the story only**: grid is now `repeat(auto-fit,minmax(min(100%,10rem),1fr))`; re-measured 375px at a 375px viewport. No token or component change. | live Storybook, `ScopedThemesNarrow` story |
| Wireframe semantic colours | `wireframe.css` overrides only accent, on-accent and radius. Positive and danger colours are unchanged, which matches the owner decision. No change needed.                                                                | computed styles                            |

## 3. Button contract (`wk-button`, extends `LionButton`)

| Property   | Values                                 | Default     |
| ---------- | -------------------------------------- | ----------- |
| `variant`  | `primary` \| `secondary` \| `tertiary` | `secondary` |
| `intent`   | `normal` \| `danger`                   | `normal`    |
| `size`     | `small` \| `medium` \| `large`         | `medium`    |
| `disabled` | boolean (Lion)                         | `false`     |
| `loading`  | boolean                                | `false`     |

- Accessible name is the default-slot text. Activation is the native `click`. Loading keeps the label and tab stop, sets `aria-busy` and `aria-disabled`, and blocks activation.
- **`intent="positive"` is removed** from the type, styles, stories and README. An unsupported intent value falls back to normal styling and is never green (package test).
- Icon slots: **not supported in this slice.** Icon support needs its own reviewed contract (accessible-name rules). Not a blocker.
- `wk-button` does not submit or reset forms. Its `loading` contract is unchanged.

### Form Buttons (decided from Lion behavior)

Lion 0.25.0 `LionButtonReset` and `LionButtonSubmit` set `type` to `reset` / `submit` in the constructor. On click they append a temporary native `<button>` to the closest native `<form>` (found through that helper) and click it, so real native submit/reset, validation and `submit` / `reset` events occur. `LionButtonSubmit` also adds a hidden implicit-submit button so Enter in a field submits.

Decision: **separate elements `wk-button-submit` and `wk-button-reset`**, each extending the matching Lion class. No public `type` API and no simulation through private Lion members.

Initial form-button contract: `variant`, `intent`, `size` and Lion's `disabled`, sharing Wakata Button styles. Native submit/reset behavior is contract only to the extent the #9 tests verify it.

**`loading` on form buttons is unresolved and not in the initial contract.** Lion registers its click-delegation listener in its own constructor, so it runs before any listener a Wakata subclass adds on the host. Blocking click, keyboard and programmatic `click()` while keeping focus and label would need a tested local solution that uses no private Lion API and no global listener. Until one exists and is tested, form buttons offer no `loading` state and the limitation is reported. Action-only `wk-button` `loading` is unaffected.

Other Lion limits, to be documented and tested in #9:

- The button must be in the same DOM tree as its `<form>` ancestor (light DOM). Form association across shadow boundaries or via the `form` attribute is not supported.

## 4. Field contract (TextField, Select, shared infrastructure)

Verified Lion behavior:

- Fields use a **light-DOM native control** in the `input` slot. Slots `label`, `help-text`, `feedback`, `prefix`, `suffix`, `before`, `after` exist. Lion associates label, help and feedback through `aria-labelledby` / `aria-describedby`.
- Lion fields are **not** form-associated custom elements (no `ElementInternals`). Native `FormData` participation depends on the native control in the light DOM carrying a `name`; this must be proven by fixture in #10/#11 before claiming serialization.
- `modelValue` is Lion's primary state. `value` is Lion's public **view value** getter/setter, delegated to the native control; it is a string.
- `model-value-changed` fires for user **and** programmatic changes (`detail.isTriggeredByUser`). `user-input-changed` is documented as protected, for subclassers.
- `LionField.reset()` sets `modelValue` back to its initial value and clears interaction state (including `submitted`). `clear()` sets `''`.
- Native `input` and `change` events come from the real control and fire only for user edits; programmatic `.value` writes fire neither (to be confirmed by the #9 tests).

### Facade (`wk-input`, `wk-change`) proposal

Implemented through `WkFieldController`, composed by the reusable `WkScalarFieldMixin(Base)`, which listens to the **native** `input` and `change` events from the slotted control, not to Lion's `model-value-changed`:

- `wk-input`: `CustomEvent<{ value: string; name: string }>`, bubbles and composed, fires per user edit.
- `wk-change`: same detail, fires on the native commit boundary.
- Neither fires for programmatic `.value` writes, initial render or reset.
- Consumers read `event.detail.value`; frameworks use `wk-input` for value updates and `wk-change` only for commit notification, not a second value update. Native `input`/`change` also bubble because the control is in light DOM; the single documented framework path is `wk-input` / `wk-change`. The mapping counts as accepted only to the extent the #9 tests pass.

Other field rules:

- `value`: canonical scalar string, default `''`. `WkScalarFieldMixin` routes writes through public Lion `modelValue` rather than inheriting Lion’s view-only setter. View/model/validation/serialization must agree without user-edit events. This is for string fields only, not boolean/number/date controls. `name`, `disabled`, `readonly` (TextField), `required`.
- A visible label (label slot) or explicit accessible name is required; placeholder is never a label.
- Validation timing: Lion's default feedback condition (after the field is touched and dirty, or after the form is submitted). The scalar mixin resets external error text before Lion reset restores initial model and interaction state. Regression coverage includes field reset and nested form reset.
- External/server error: a Wakata `error` text property renders into the `after` slot (not Lion's `feedback` slot: Lion does not run non-`Required` validators on empty values) and is linked through Lion's public `addToAriaDescribedBy` / `removeFromAriaDescribedBy`. It keeps `aria-invalid="true"` while external error text exists, including across Lion validation changes; on clear the baseline `aria-describedby` is restored exactly and `aria-invalid` follows Lion's own state. It is text plus state, not colour alone, and does not replace Lion's validation or the native control. Verified by `form-foundation.browser.test.ts` for empty and nonempty values and alongside a Lion `Required` error.
- Select: single selection on the native `<select>` path only; no combobox behavior.
- Card: non-interactive container, default slot, no role, no click event.
- Dialog: built on Lion's dialog entry (`@lion/ui/dialog.js`); public contract is accessible name, open/close, initial and return focus, Escape and backdrop rules, and the overlay keeps the originating theme, mode and wireframe attributes. Lion overlay private members are not public API.

### Wrapper form submit contract

`wk-form` inherits Lion’s submit-attempt notification: it prevents native navigation, validates the group, and emits a bubbling `submit` even when Lion fields have errors. Consumers must check errors, pending validation and external errors before processing and guard duplicate requests. Native constraint validation and native-form submit suppression are separate. No successful-submission event or network action is implied.

## 5. Theme tokens (exact values currently in source)

Modes (`modes.css`; theme roots then set accent, radius and font):

| Token                                                               | Light                    | Dark                           |
| ------------------------------------------------------------------- | ------------------------ | ------------------------------ |
| `--wk-text`                                                         | `#222`                   | `#efefec`                      |
| `--wk-surface`                                                      | `#fff`                   | `#232323`                      |
| `--wk-border`                                                       | `#999`                   | `#999`                         |
| `--wk-focus`                                                        | `#111`                   | `#fff`                         |
| `--wk-positive` / `--wk-on-positive` (**feedback and status only**) | `#17623c` / `#fff`       | `#82d5a5` / `#112a1b`          |
| `--wk-danger` / `--wk-on-danger`                                    | `#a02222` / `#fff`       | `#ff9e9e` / `#2a0a0a`          |
| `--wk-hover-mix`                                                    | `#000`                   | `#fff`                         |
| `--wk-disabled-bg` / `-text` / `-border`                            | `#eee` / `#777` / `#ddd` | `#303030` / `#969696` / `#555` |

| Theme     | Light accent / on-accent | Dark accent / on-accent | `--wk-radius` | `--wk-font`                  |
| --------- | ------------------------ | ----------------------- | ------------- | ---------------------------- |
| Neutral   | `#171717` / `#fff`       | `#eee` / `#171717`      | `0px`         | Arial, Helvetica, sans-serif |
| Studio    | `#4935a3` / `#fff`       | `#c4b6ff` / `#201443`   | `16px`        | Georgia, serif               |
| Fieldwork | `#285842` / `#fff`       | `#a1d4b4` / `#152c20`   | `8px`         | Verdana, sans-serif          |

Wireframe: accent `#171717` / `#fff` (dark `#eee` / `#171717`), radius `0px`; positive and danger untouched. Image placeholders and grayscale logos are not implemented in the DS yet (no component in this slice uses them).

Controlled versus themeable: **controlled** = target size, focus visibility, disabled/loading clarity, error meaning (text plus state), reflow, reduced motion, forced-colors. **Themeable** = the `--wk-*` tokens above only. Components read tokens; theme roots set them.

Scoped rules: explicit theme/mode/wireframe boundaries resolve inherited palette and flags locally; absent values inherit, explicit `data-wk-wireframe="false"` opts out, and deeper `true` re-enters. Mode-only roots preserve the inherited brand. Adjacent and nested roots take the nearest explicit value; typography follows `--wk-font` of the nearest root. Public appearance overrides apply on the scope where declared; explicit mode changes select built-in mode colors, so repeat a custom accent override at each relevant boundary. Mode-only boundaries inherit radius; theme/wireframe boundaries may reset it. Private resolver properties are not public APIs; an overlay is rendered inside, or copies the `data-wk-*` attributes of, its originating root.

## 6. Shared light / dark / system control (proposal for all themes)

One control, not a Storybook-only toolbar item: a labelled native radio group in a fieldset (legend "Colour mode", options System / Light / Dark), so it is keyboard-operable without custom key handling.

- System: follows `prefers-color-scheme` live and removes any stored override.
- Light / Dark: explicit override, stored site-wide in `localStorage` under one key; returning to System deletes the key.
- It writes the resolved value to `data-wk-mode` on the document root; local theme roots may still set their own `data-wk-mode`.
- The token CSS has no `prefers-color-scheme` rule today; the control (or Storybook) resolves system to an attribute. A no-JS CSS fallback is optional later.
- The first-party shared control is remaining #9 work and must be implemented and
  verified before Card/Dialog can claim their shared-switching criteria. Storybook's
  toolbar exercises theme states but is not this control. #14 verifies the same
  control in HTML, React and Angular.

## 7. Versioned validation matrix

| Surface                           | Version                                               | Status 2026-10-24                    |
| --------------------------------- | ----------------------------------------------------- | ------------------------------------ |
| Node / pnpm / TypeScript          | 22 (`.nvmrc`) / 10.33.0 / 5.9.3                       | observed                             |
| `@lion/ui` / Lit                  | 0.25.0 / 3.3.1                                        | pinned; behavior read from source    |
| Storybook / addon-vitest          | 10.6.3                                                | pinned                               |
| Vitest / Playwright               | 4.1.12 / 1.64.1                                       | pinned; Chromium headless only       |
| Plain HTML fixture                | native custom elements                                | Button only; forms in #9             |
| React                             | 19.3.1 appears only transitively; no consumer fixture | **untested** (needed at #14)         |
| Angular                           | none in repo; exact version not chosen                | **untested** (needed at #14)         |
| Firefox / WebKit                  | not configured                                        | **untested**                         |
| VoiceOver + Safari, NVDA + Chrome | no runs                                               | **untested**; no accessibility claim |
| Mobile devices / zoom / reflow    | 375px Chromium story check only                       | partial; real devices untested       |

Acceptance split: the _provisional baseline_ (accepted) covers Button and the three themes as they are. _Final reference-render acceptance_, _cross-framework support_ and _manual accessibility acceptance_ remain open and are gated at #14 and #20.

## 8. Open items (not blocking #9–#13)

- Form-button `loading` (section 3): unresolved, omitted from the initial contract.
- Icon slots (deferred).
- Reference renders for each state: needed before final visual acceptance, not for implementation.
- React and Angular versions to pin at #14.
