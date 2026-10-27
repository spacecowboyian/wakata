# @wakata/ds

Wakata design system (working title DS) and its Storybook. Private and provisional; not published.

## Exports

| Import                          | Contents                                                                |
| ------------------------------- | ----------------------------------------------------------------------- |
| `@wakata/ds`                    | `WkButton`, types, `wkTokens`, theme names. **No registration.**        |
| `@wakata/ds/button`             | Button class and styles only                                            |
| `@wakata/ds/text-field`         | TextField class, styles and types only                                  |
| `@wakata/ds/define`             | Registers all DS elements (idempotent)                                  |
| `@wakata/ds/button/define`      | Registers `wk-button` (`defineWkButton()` is safe to call twice)        |
| `@wakata/ds/text-field/define`  | Registers `wk-text-field` (`defineWkTextField()` is safe to call twice) |
| `@wakata/ds/mode-switch`        | Mode switch class, styles and event/mode types; no registration         |
| `@wakata/ds/mode-switch/define` | Registers `wk-mode-switch` (idempotent)                                 |
| `@wakata/ds/themes.css`         | Neutral/Studio/Fieldwork themes, light/dark modes, wireframe            |
| `@wakata/ds/themes/*.css`       | Individual theme files                                                  |

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
closed long labels may truncate. Components retain native appearance and read
existing theme tokens, with a 44px minimum control height and visible focus.

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
