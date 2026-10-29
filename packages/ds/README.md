# @wakata/ds

Wakata design system (working title DS) and its Storybook. Private and provisional; not published.

## Exports

| Import                             | Contents                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `@wakata/ds`                       | `WkButton`, `WkCard`, types, `wkTokens`, theme names. **No registration.** |
| `@wakata/ds/button`                | Button class and styles only                                               |
| `@wakata/ds/text-field`            | TextField class, styles and types only                                     |
| `@wakata/ds/text-area`             | TextArea class and styles only                                             |
| `@wakata/ds/checkbox`              | Checkbox class and Boolean event type; no registration                     |
| `@wakata/ds/checkbox-group`        | CheckboxGroup class; no registration                                       |
| `@wakata/ds/switch`                | Switch class; no registration                                              |
| `@wakata/ds/define`                | Registers all DS elements (idempotent)                                     |
| `@wakata/ds/button/define`         | Registers `wk-button` (`defineWkButton()` is safe to call twice)           |
| `@wakata/ds/card`                  | Card class only; no registration                                           |
| `@wakata/ds/link`                  | Link class only; no registration                                           |
| `@wakata/ds/link/define`           | Registers `wk-link`                                                        |
| `@wakata/ds/status`                | Status class and types only; no registration                               |
| `@wakata/ds/status/define`         | Registers `wk-status`                                                      |
| `@wakata/ds/card/define`           | Registers `wk-card` (`defineWkCard()` is safe to call twice)               |
| `@wakata/ds/dialog`                | Dialog class only; no registration                                         |
| `@wakata/ds/dialog/define`         | Registers `wk-dialog` (`defineWkDialog()` is safe to call twice)           |
| `@wakata/ds/text-field/define`     | Registers `wk-text-field` (`defineWkTextField()` is safe to call twice)    |
| `@wakata/ds/text-area/define`      | Registers `wk-text-area` (`defineWkTextArea()` is safe to call twice)      |
| `@wakata/ds/checkbox/define`       | Registers `wk-checkbox`                                                    |
| `@wakata/ds/checkbox-group/define` | Registers `wk-checkbox-group`                                              |
| `@wakata/ds/switch/define`         | Registers `wk-switch`                                                      |
| `@wakata/ds/mode-switch`           | Mode switch class, styles and event/mode types; no registration            |
| `@wakata/ds/mode-switch/define`    | Registers `wk-mode-switch` (idempotent)                                    |
| `@wakata/ds/themes.css`            | Neutral/Studio/Fieldwork themes, light/dark modes, wireframe               |
| `@wakata/ds/themes/*.css`          | Individual theme files                                                     |

```ts
import '@wakata/ds/themes.css';
import '@wakata/ds/define';
```

```html
<div data-wk-theme="neutral" data-wk-mode="light">
  <wk-button variant="primary">Save changes</wk-button>
</div>
```

## `wk-button`

Action-only subclass of `LionButton`. Normal `click` is the only activation event. Form submit/reset use `wk-button-submit` / `wk-button-reset` (below).

| Property   | Values                                                                                       | Default     |
| ---------- | -------------------------------------------------------------------------------------------- | ----------- |
| `variant`  | `primary` \| `secondary` \| `tertiary`                                                       | `secondary` |
| `intent`   | `normal` \| `danger` (destructive; affirmative actions use `variant="primary"`)              | `normal`    |
| `size`     | `small` \| `medium` \| `large`                                                               | `medium`    |
| `disabled` | boolean (Lion; leaves the tab order)                                                         | `false`     |
| `loading`  | boolean (keeps label/size/tab stop; blocks activation; sets `aria-busy` and `aria-disabled`) | `false`     |

## `wk-button-submit` and `wk-button-reset`

Subclasses of Lion's `LionButtonSubmit` / `LionButtonReset`. They act on the closest native `<form>` ancestor **in the same DOM tree** (not across shadow boundaries). Click, Enter, Space and implicit submission from fields delegate to the native form. Native constraint validation can block the native submit event. Inside `wk-form`, Lion validation and its wrapper submit-attempt notification are separate (see below). They accept `variant`, `intent`, `size` and `disabled` like `wk-button`, and have no public `type` property. Affirmative submit uses `variant="primary"`; `intent="danger"` (red) is for destructive actions such as discarding; green is never a Button action.

**No `loading` for form buttons.** Lion registers click delegation in its own constructor, so blocking it would need a private API or a global listener; neither is used. Disable the submit button while processing and guard duplicate submissions in the consumer. Action-only `wk-button` `loading` is unaffected.

Runnable synthetic example: `examples/form-buttons.html` (needs a bundler or dev server to resolve `@wakata/ds`).

## `wk-text-field`

`WkTextField` extends Lion's `LionInput` and uses `WkScalarFieldMixin`, so its string value,
validation, external errors, events, serialization and reset behavior share the form foundation
above. The native `<input>` stays in light DOM.

| Property / attribute             | Purpose                                                                                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                           | `text` (default), `email` or `password`; keeps the corresponding native input semantics. Email also uses Lion's `IsEmail` validator.                    |
| `name`, `value`                  | Native form name and canonical scalar-string value. Programmatic value changes update the view, model and serialization without `wk-input`/`wk-change`. |
| `label` / `slot="label"`         | Visible accessible name. A placeholder is not a label.                                                                                                  |
| `help-text` / `slot="help-text"` | Persistent description associated with the native input.                                                                                                |
| `required`                       | Native required state and Lion `Required` validation. An empty optional field is valid, including optional email.                                       |
| `disabled`                       | Native disabled state; not focusable and excluded from `FormData`.                                                                                      |
| `readonly`                       | Native read-only state; remains focusable and included in `FormData`.                                                                                   |
| `error`                          | External/server error text, associated through Lion's public description helpers and cleared on reset.                                                  |

User edits emit bubbling, composed `wk-input` and `wk-change` events with `{ value, name }`.
Use `wk-input` to update framework state and `wk-change` for commit notification; do not update
state from both. Password values are not logged or included in the example.

The component is registered by `@wakata/ds/define`, or separately with
`@wakata/ds/text-field/define`. `examples/text-field.html` is a minimal synthetic native-form
fixture using `wk-form` and the existing submit/reset buttons. Its submit event is an attempt
notification: consumers must guard Lion validation errors, pending validation and external errors
before processing. It does not demonstrate a React or Angular wrapper.

## `wk-checkbox`, `wk-checkbox-group`, and `wk-switch` (provisional)

Use Checkbox for consent and choices included in native form submission. A checked Checkbox
submits its `choiceValue` under `name`; unchecked and disabled Checkboxes submit nothing.
`choiceValue` defaults to `on`. A standalone `required` Checkbox must be checked. A required
CheckboxGroup needs at least one child checked; its visible group label, help text and error
describe the choices together. Set each child's `choiceValue` property for distinct submitted
values. Give the group and each child the same `name`, so `FormData.getAll(name)` returns the
checked choices, including when nested in `wk-form`. Indeterminate/tri-state is outside this
contract.

Switch changes an immediate setting and is not a submitted form field. It has a stable visible
label, a `checked` Boolean property, and `disabled` behavior; it has no `required`, readonly,
validation, or submitted value. Place it outside the native form. The native switch button
exposes `role="switch"` and `aria-checked`.

User activations emit bubbling, composed `wk-input` and `wk-change` once each. Checkbox detail
is `{ checked, name, value }`; Switch detail is `{ checked, name }`. Programmatic `checked`
changes and form reset emit neither event. `error` on Checkbox/CheckboxGroup is external text
associated with the control and cleared by reset. The package root exports classes without
registration; `@wakata/ds/define` or the corresponding component `/define` path registers each.

`examples/checkbox-switch.html` is a synthetic plain HTML fixture. The React controlled and
Angular reactive request/review examples exercise the same components. Automated browser and
framework evidence is recorded in `docs/ds/issue-17-evidence.md`. Manual assistive technology
and physical device evidence remains deferred to issue #59; this is not production promotion.

## `wk-text-area`

`WkTextArea` extends Lion's `LionTextarea` with `WkScalarFieldMixin`; the native `<textarea>`
stays in light DOM. Props mirror `wk-text-field` (`name`, `value`, `label`, `help-text`,
`required`, `disabled`, `readonly`, `error`, `wk-input`/`wk-change` events). Line breaks are
preserved in the value and `FormData`.

| Property / attribute               | Default  | Use                                                                               |
| ---------------------------------- | -------- | --------------------------------------------------------------------------------- |
| `name`                             | none     | Key in native `FormData`.                                                         |
| `value`                            | `''`     | Multiline string. Programmatic updates and reset emit no user-edit events.        |
| `label`                            | none     | Visible accessible name; supply one for every field.                              |
| `help-text` / `error`              | `''`     | Persistent guidance / external validation feedback, associated with the textarea. |
| `required`, `disabled`, `readonly` | `false`  | Native field semantics and shared validation.                                     |
| `rows`, `max-rows`                 | `2`, `6` | Initial visible rows and auto-grow cap.                                           |

```html
<wk-text-area name="notes" label="Notes" help-text="Add details if helpful."></wk-text-area>
```

Listen to `wk-input` for user edits and `wk-change` for the native commit boundary. Both carry
`{ value, name }`; use one path to update application state. A readonly field remains focusable
and is submitted; a disabled field is neither focusable nor submitted. The component uses the
native textarea for keyboard editing, selection, line breaks and focus.

Sizing is Lion's built-in auto-grow: `rows` (default 2) sets the initial height and `max-rows`
(default 6) caps growth, after which the control scrolls. Drag resizing is disabled; there is no
fixed-height mode or auto-grow toggle. Registered by `@wakata/ds/define` or
`@wakata/ds/text-area/define`. `examples/text-area.html` is a synthetic plain-HTML fixture.
The React controlled and Angular reactive-form request/review examples include optional multiline
Notes. Automated TextArea package checks run in Chromium, Firefox and WebKit, and the framework
examples run in Chromium. This is provisional; manual assistive-technology and device evidence
remains deferred to #59.

## `wk-card` (provisional presentational primitive)

`WkCard` is a Lit primitive, not a Lion component. Import its class and styles
through `@wakata/ds/card` without registering the custom element, or register it
explicitly with `@wakata/ds/card/define`; `@wakata/ds/define` also registers it.
Registration is idempotent.

```html
<wk-card>
  <h2 slot="heading">Workspace profile</h2>
  <p>Review and update your workspace details.</p>
  <div slot="actions">
    <wk-button-submit variant="primary">Save changes</wk-button-submit>
  </div>
</wk-card>
```

Provide a native heading at the level appropriate to the surrounding page in
`slot="heading"`, body content in the default slot, and an optional grouped
action area in `slot="actions"`. Body-only cards are valid. The Card generates
no heading, landmark, accessible name or role and has no tabindex, click,
loading or navigation behavior. Actions retain their own names, focus and
activation; the container is not an interactive control.

The surface reads `--wk-surface` and `--wk-text`, uses a 1px `--wk-border`,
`--wk-radius`, 16px fixed internal padding and 12px between occupied sections.
It has no shadow or Card-specific styling knobs. The host owns width, outer
spacing and layout. Wireframe keeps geometry and typography while inheriting
the theme's wireframe treatment. Consumer-provided images need meaningful alt
text when informative; the synthetic Composition / Current Slice fixture keeps
its logo grayscale and its decorative placeholder hidden from assistive
technology. Card does not introduce a media component family.

Storybook's `Components/Card` includes body-only, heading/body, actions,
long-content/narrow reflow, every theme in light and dark with wireframe on
and off, nested themes, and **Composition / Current Slice**, which composes the
real Card with TextField, Select, form buttons and the mode switch in a
synthetic settings form. `packages/ds/review/card/` contains Chromium review
captures for desktop/phone light and dark composition and essential Card
states; `pnpm build-storybook` regenerates them and verifies narrow overflow,
Card geometry, and browser errors. This is automated Chromium evidence only:
manual assistive-technology, zoom/contrast, Firefox/WebKit, real-device and
framework checks remain unrun. The component remains provisional and is not
evidence of production adoption or promotion.

## `wk-status` (provisional status message)

Import the class from `@wakata/ds/status` (no registration) or register with
`@wakata/ds/status/define` / `@wakata/ds/define`. Non-interactive; variants `informational`
(default), `success`, `warning`, `danger`. Text must carry the meaning. The `icon` slot is
decorative (`aria-hidden`); no icon library or new token is added. No live region by default;
`live="polite"` (role=status) or `live="assertive"` (role=alert) opts in via one persistent inner
role and no `aria-live`. Green is success only; red is danger/error. Warning has no token, so it
uses a dashed border plus text (open contract choice).

```html
<!-- HTML -->
<wk-status variant="success" live="polite"><span slot="icon">✓</span>Saved</wk-status>
```

```jsx
// React, after importing @wakata/ds/status/define
<wk-status variant="danger" live="assertive">
  Payment failed
</wk-status>
```

```html
<!-- Angular, with CUSTOM_ELEMENTS_SCHEMA -->
<wk-status [attr.variant]="kind" [attr.live]="announce ? 'polite' : null">{{ message }}</wk-status>
```

Evidence is Storybook play functions and `test/status.browser.test.ts` only; no manual AT/device testing.

## `wk-link` (provisional navigation primitive)

`WkLink` wraps a native `<a>` in its shadow root. Import the class from `@wakata/ds/link`
(no registration) or register with `@wakata/ds/link/define` / `@wakata/ds/define`.

```html
<p>Read the <wk-link href="/guide">style guide</wk-link>.</p>
<wk-link variant="standalone" href="https://example.com" target="_blank" rel="author"
  >Example</wk-link
>
```

- `href`, `target`, `rel` are forwarded to the native anchor; native name, keyboard activation
  and browser affordances are kept.
- Missing/empty `href` or a `javascript:`, `data:`, or `vbscript:` href renders plain text: no role, tab stop, or
  disabled/button behavior.
- `target="_blank"` always adds `noopener noreferrer` to the effective `rel` (caller tokens kept).
- `variant`: `inline` (default, underlined) or `standalone` (inline-block, bold, underlined).
- Reads existing `--wk-accent`, `--wk-focus`, `--wk-radius`; no new tokens, router or icons.

Evidence is Storybook play functions and `test/link.browser.test.ts` (Chromium) only; manual AT,
device and cross-browser checks are deferred (#59). The component remains provisional.

## `wk-dialog` (provisional modal)

```ts
import '@wakata/ds/themes.css';
import '@wakata/ds/dialog/define';
```

`WkDialog` extends Lion 0.25's public `LionDialog` class. It retains Lion's
reflected `opened` state, `open()` / `close()` promises, public `invoker` and
`content` slots, modal focus containment, inert background, body scroll lock
and Escape dismissal. On desktop the backdrop does not dismiss the dialog. At phone width (max 600px) a tap or click on the exposed dimmed strip above the sheet closes it; the page behind stays inert and receives no activation, and taps inside the sheet never close it. Manual accessibility and real-device touch testing are tracked in #59. Importing
`@wakata/ds/dialog` alone does not register the element.

Provide a focusable control in `slot="invoker"` and one content-root element in
`slot="content"`. The content root must have an accessible title through
`aria-label` or `aria-labelledby`; `aria-describedby` may point to one or more
IDs inside that root. These are native ARIA APIs. An explicit `autofocus`
target is used when present; otherwise Lion focuses the content root. On close,
focus returns only while the dialog still owns focus. If its invoker was
removed or is no longer available, focus moves to the nearest surviving
focusable ancestor, then the page's `<main>`, then `<body>`. Application focus
moved elsewhere is not taken back.

The global Lion overlay carries the origin's effective theme, mode and
wireframe attributes plus computed supported `--wk-*` tokens, including
typography and consumer overrides. These refresh while open when an origin
ancestor's relevant attributes change or when the System color preference
changes. The content root uses 24px padding, a 28rem maximum width, 24px
viewport gutters and viewport-constrained scrolling on desktop. At viewport
widths of 600px or less, it becomes a near-full-height bottom sheet with a
40px top reveal, a top-edge shadow and a stable height independent of content
length. With a title, one body element and an action container as its three
direct children, only the middle body scrolls; the title and actions stay in
place. Other content structures remain scrollable as a whole. It follows the theme
surface/border/radius with a restrained modal shadow; dark mode lifts the
panel surface slightly. Wireframe changes the theme radius without changing
geometry. The backdrop uses a lighter dim than Lion's default. No arbitrary
overlay configuration API is exposed.

`examples/request-review.html` is a synthetic phase-1 request/review fixture
(Card, Form, Text Field, Select, Button, Dialog, Mode Switch). Run it with
`pnpm --filter @wakata/ds exec vite --open /examples/request-review.html`
(any dev server that resolves `@wakata/ds` works), and its flow with
`pnpm --filter @wakata/ds exec vitest run --project package test/request-review.browser.test.ts`.
The studio theme scope wraps `wk-dialog` at its origin so the overlay inherits it.
Phase-1 limits: Chromium automated tests only; synthetic data, no network or
storage; no manual assistive-technology testing (Windows/NVDA deferred and
untested), no real-device, React or Angular coverage; this is not gate completion.

`examples/dialog.html` is a synthetic runnable fixture. Storybook's
`Components/Dialog / Review Dialog` combines a real Wakata Button and Card
with a named/described review modal in the Fieldwork theme. Chromium browser tests
verify that Cancel and Confirm changes only close this synthetic example;
neither performs a business action. Review screenshots use Fieldwork typography,
while the story separately checks a live typography override. The visible
Storybook entries `Mobile Sheet / Short Content` and `Mobile Sheet / Long
Content` open their Dialogs for phone-width review. The long story keeps its
title and action footer fixed while its body scrolls. At very short viewport
heights, the whole sheet scrolls so actions remain reachable at high browser
zoom. Its open-state automated Storybook accessibility check is marked `todo`:
Lion's outer native
`<dialog role="none">` triggers an axe role violation. This known upstream
markup issue and manual VoiceOver behavior remain open under #59.
Chromium browser tests
cover repeated lifecycle, keyboard containment, Escape and desktop/mobile backdrop behavior,
focus return and fallback, removed content/invokers, theme nesting/live
updates and overflow. `packages/ds/review/dialog/` contains deterministic
phone/desktop light/dark captures generated by `pnpm build-storybook`.
`test/dialog-actions.browser.test.ts` adds cross-browser checks with real
`wk-button` actions: disabled and loading buttons do not activate and leave the
dialog open; repeated action/close clicks run the effect and close once and
release focus and scroll lock; content replacement, a removed invoker and
application-moved focus leave no stranded focus or scroll lock. Dialog has no
loading state of its own; loading is the Button's.
`test/dialog-emulation.chromium.browser.test.ts` is Chromium-only (CDP media
emulation) and checks computed text contrast (>= 4.5:1) and viewport fit in
light/dark at 320x568 and 1280x800, and operability at a 640x400 viewport (a
200%-zoom-equivalent layout, not browser zoom) with emulated reduced-motion and
forced-colors. Contrast is only content text on its surface, not an exhaustive
WCAG audit; emulation is not a real device or real zoom.
Focused cross-engine Dialog commands (only `test/dialog.browser.test.ts` and
`test/dialog-actions.browser.test.ts`; default runs stay Chromium):
`pnpm --filter @wakata/ds test:dialog:firefox` and
`pnpm --filter @wakata/ds test:dialog:webkit`. On this Mac, Firefox 157 and
WebKit 27.2 each passed 24 focused Dialog tests. The full WebKit suite is not
claimed: it has two unrelated non-Dialog failures.
Separate reviewer-operated check in real Chrome at 200% browser zoom on the
built Review Dialog story (distinct from the narrow-viewport emulation above):
devicePixelRatio 2 at 100% became 4 at 200%; innerWidth 1023 CSS px, document
scrollWidth 1023; dialog left 255.5 / right 767.5 and bottom 368.2 within the
537px viewport; focus started on the content and Escape returned it to the
invoker; zoom was reset to 100%.
Mobile real-device, manual screen-reader/assistive-technology, exhaustive
contrast, full forced-colors rendering review and React/Angular integration
checks remain unrun. This component is provisional;
these checks do not constitute production usage or promotion.

## `wk-select`

`WkSelect` extends Lion 0.25.0 `LionSelect` through `WkScalarFieldMixin` and
`WkFieldController`. Import classes/styles from `@wakata/ds/select` (no registration);
import `@wakata/ds/select/define` or `@wakata/ds/define` to register.

```html
<wk-select name="destination" label="Destination" required help-text="Choose one destination.">
  <select slot="input">
    <option value="">Choose a destination</option>
    <option value="oslo">Oslo</option>
    <option value="bergen">Bergen</option>
  </select>
</wk-select>
```

Supply one native single `<select slot="input">` with direct `<option>` children,
unique explicit string values and a first, enabled `value=""` prompt. The prompt is
an empty value, not a label; required rejects it, optional accepts it. Keeping it
enabled allows users to clear a selection. There is no `placeholder` attribute/API
on the host: the empty option is the native placeholder path.

Host `label`/label slot, `help-text`/help-text slot, `name`, `required`, `disabled`
and external `error` follow the shared field contract. Disabled is native,
unfocusable and omitted from FormData. Required uses both native constraints and
Lion Required validation, with Lion's existing feedback timing. External error
text is described by the control and keeps it aria-invalid until cleared/reset.

The canonical scalar `value` defaults to `''` with the prompt above. A host
`value="bergen"` attribute sets the initial reset default. An explicit scalar
`value` property set before connection, after supplying the options, takes
precedence over that attribute. Later
`field.value = 'bergen'` updates view/model/serialization without user events.
Unknown values normalize to `''` (no selected option). Reset through `wk-form`
restores the initial model and clears external error/interaction state. Do not
rely on option `selected` attributes as a separate Wakata default-value API.
Use `wk-input` with `{value,name}` for user state updates and `wk-change` only for
commit notification, not a second update path. Native input/change still bubble.

`examples/select.html` and the Select Real Form story exercise synthetic native
FormData and guarded submit attempts. Native form reset alone is not the Lion
model-reset path; wrap the form in `wk-form`. No readonly, multiselect, search,
combobox widget, optgroup/custom option rendering or custom popup contract is
introduced. The accessibility role of the native single select is `combobox`;
that does not make this a searchable ARIA combobox implementation. Native menus
and their keyboard interaction, wrapping and popup styling vary by OS/browser;
closed long labels may truncate. The closed control uses a decorative chevron,
with extra text space before it, while selection and the popup remain native.
Browsers supporting `select:open` point the chevron upward while the picker is
open; other browsers keep the downward chevron. The chevron is not a separate
focus or pointer target. The control reads existing theme tokens, with a 44px
minimum height, visible focus, and an inner fill shaped to the theme's radius.
In forced-colors mode it restores the platform arrow because forced colors
remove CSS gradient artwork.

Chromium keyboard coverage exercises focus, native type-ahead selection and its
scalar events/FormData. In local headless Chromium on macOS, ArrowDown/Enter and
Space/ArrowDown/Enter did not change even a bare native select; popup keyboard
navigation remains unverified, not replaced by a custom key handler.

## `wk-mode-switch` (provisional supporting control)

```ts
import '@wakata/ds/themes.css';
import '@wakata/ds/mode-switch/define';
```

```html
<html data-wk-theme="neutral">
  <!-- Do not fix the body's mode if it should follow the site choice. -->
  <body>
    <wk-mode-switch></wk-mode-switch>
  </body>
</html>
```

Native radios labelled **System**, **Light**, **Dark** sit in a fieldset with
legend **Colour mode**. Native Tab/arrow/Space behavior is preserved; labels
have a minimum 44px height and radios have a visible keyboard focus outline.
This Lit supporting control is deliberately not a Lion scalar form field:
it changes a site preference, has no form value and introduces no custom radio
keyboard implementation.

The reflected `mode` property/attribute accepts `system | light | dark`.
Without an explicit initial value it restores the stored override, otherwise
defaults to `system`. An explicit initial property/attribute wins over storage;
later instances without an explicit mode adopt the current shared choice.
Invalid programmatic values throw a `TypeError`.

The control writes the **resolved** `light | dark` to
`document.documentElement.dataset.wkMode`, including in System mode. System
follows `prefers-color-scheme: dark` live and removes the stored override.
Light/Dark persist under `wakata:color-mode:v1`. Storage access failures warn
and retain a shared in-memory choice for this page. Connected instances sync
silently, including storage changes from other tabs. Disconnection removes
listeners when no instances remain; reconnection preserves the page choice.
An explicit local `data-wk-mode` still controls that subtree's appearance;
switches inside it still display/change the **site-wide** choice.

Only a user radio change emits one bubbling, composed `wk-mode-change` with
`{ mode, resolvedMode }`. Programmatic property/attribute writes, persistence
restore, peer synchronization and System preference changes emit no user event.
Observe the document root if an application needs resolved appearance updates;
the user event is not a continuous System-mode notification.

`examples/mode-switch.html` is a real synthetic HTML page with Neutral and
Studio inheriting site mode and a Fieldwork local light/wireframe override.
Serve it with a bundler/dev server resolving `@wakata/ds`; unlike Storybook's
local toolbar wrapper, it demonstrates actual document-wide switching.
Storybook provides System/Light/Dark, shared choice, narrow and all three themes
in light/dark with wireframe on/off.

`pnpm test` runs native label/state/focus/arrow/event tests, shared-state,
persistence and theme geometry tests, Storybook play/axe checks, and a Chromium
HTML smoke check with reload, real media emulation and blocked-storage access.
The HTML check can regenerate small review images with
`cd packages/ds && node scripts/check-mode-switch.mjs --screenshots`.
Images under `review/mode-switch/` show 375px light/dark and 280px narrow HTML
with all three themes and a wireframe/local-mode boundary.

Manual screen-reader/AT name, group, state and announcement review remains
unrun, as do Firefox/WebKit, real-device, zoom/contrast review and React/Angular
integration. Chromium and axe evidence is not WCAG certification. No-JavaScript
fallback and SSR/hydration guarantees are outside this provisional contract.
This implements remaining #9 control work, not shared production promotion or
final visual acceptance; #14/#20 and the governance gates remain separate.

## Form infrastructure (`@wakata/ds/form`, `@wakata/ds/form/define`)

| Export                       | Purpose                                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `WkForm` (`wk-form`)         | `LionForm`; wrap a native `<form>`. Reset restores Lion fields' defaults and clears interaction and validation state. |
| `WkFieldset` (`wk-fieldset`) | `LionFieldset`; a named group of fields.                                                                              |
| `WkFieldController`          | Reactive controller for Lion field subclasses (used by TextField and Select).                                         |

`WkScalarFieldMixin(Base)` composes the controller with scalar-string Lion fields. It adds the reactive `error` property, routes public `value` writes through Lion’s public `modelValue`, and clears external errors on `reset()` before Lion restores defaults. This is shared infrastructure; TextField and Select remain separate component work. Do not use the scalar mixin for numeric/date/boolean models. A single Select value with no matching option normalizes to the native empty selection (`''`); its model and serialized value also become empty.

Programmatic `value` updates must keep the view, model, validation and serialization consistent without emitting `wk-input` or `wk-change`. Frameworks consume `wk-input` for state updates and `wk-change` for commit notification; do not subscribe to both as duplicate value-update paths.

`WkFieldController` provides:

- `wk-input` and `wk-change`: bubbling, composed events carrying `{ value, name }`, mapped from the native control's `input` / `change`. Programmatic writes and reset do not emit them. Lion's own events are not aliased.
- An external/server `error` message: rendered in the `after` slot, linked with Lion's public `addToAriaDescribedBy` / `removeFromAriaDescribedBy`, and sets `aria-invalid="true"`. It works for empty and nonempty values. The invalid state remains true while an external error exists, including when Lion validation changes. Clearing removes only the external association and restores current Lion validity; other descriptions remain intact.

Fields keep a light-DOM native control, so `FormData` works through the control’s `name`. Lion validation timing is unchanged.

**Submission is an attempt notification.** `wk-form` prevents native navigation and emits a bubbling `submit` event even when Lion fields are invalid. It is not proof of valid data or a network action. Consumers must guard Lion validation errors, pending validation and nonempty external errors before processing, and prevent duplicate requests. Native `<form>` constraints remain distinct from Lion validators.

## Theme tokens

Set on a theme root (`data-wk-theme="neutral|studio|fieldwork"`, `data-wk-mode="light|dark"`, `data-wk-wireframe="true"`). Components read these with fallbacks; host or ancestor CSS may still override them. Nearest explicit theme, mode and wireframe values win; omitted values inherit. A mode-only boundary retains its inherited brand palette. `data-wk-wireframe="false"` opts a subtree out; a deeper `true` opts back in. Wireframe keeps typography and dimensions, squares corners and grays the accent; success and danger tokens keep their meaning.

`--wk-font`, `--wk-radius`, `--wk-text`, `--wk-surface`, `--wk-border`, `--wk-focus`, `--wk-accent`, `--wk-on-accent`, `--wk-positive`, `--wk-on-positive`, `--wk-danger`, `--wk-on-danger`, `--wk-hover-mix`, `--wk-disabled-bg`, `--wk-disabled-text`, `--wk-disabled-border`. Source of truth: `src/tokens/tokens.ts`.

Mode changes select the built-in palette for that mode; a new theme or explicit wireframe scope selects its own appearance. Put public token overrides on each boundary where they must apply (for example `[data-wk-theme="studio"][data-wk-mode="dark"] { --wk-accent: …; }`). An inherited one-off accent override does not define a custom light/dark palette. Mode-only boundaries preserve inherited radius; changing theme or wireframe can reset it. Private `--_wk-*` resolver properties are not a supported customization API.

## Validation status

`pnpm build-storybook` also runs a Chromium smoke gate against the generated
static iframe at 375px. It checks element registration and upgraded Select
selected, required/invalid, disabled and real-form stories (not just native
controls), plus upgraded Mode Switch System/Light/Dark/shared/narrow stories.
Re-run against an existing build with
`pnpm --filter @wakata/ds test:storybook-build`. Source and built `define` modules
are explicitly side-effectful; class-only package imports remain registration-free.

Covered: Lion inheritance; TextField text/email/password native types, validation, required and optional empty values, disabled/readonly behavior, event silence for programmatic updates/reset, external errors, FormData, reset and a guarded form attempt; Enter/Space once each, disabled/loading suppression, loading geometry and restore, Tab skipping disabled, independent theme scopes, built-package imports and registration, and automated axe checks in representative light/dark themes (Chromium).

Automated TextField browser coverage runs in Chromium only. Pending: manual keyboard/focus/name/state checks, assistive-technology testing, cross-browser testing, zoom/reflow and contrast review, and framework (React/Angular) wrappers. Automated axe results are not full WCAG validation.
