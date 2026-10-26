# @wakata/ds

Wakata design system (working title DS) and its Storybook. Private and provisional; not published.

## Exports

| Import                     | Contents                                                         |
| -------------------------- | ---------------------------------------------------------------- |
| `@wakata/ds`               | `WkButton`, types, `wkTokens`, theme names. **No registration.** |
| `@wakata/ds/button`        | Button class and styles only                                     |
| `@wakata/ds/define`        | Registers all DS elements (idempotent)                           |
| `@wakata/ds/button/define` | Registers `wk-button` (`defineWkButton()` is safe to call twice) |
| `@wakata/ds/themes.css`    | Neutral/Studio/Fieldwork themes, light/dark modes, wireframe     |
| `@wakata/ds/themes/*.css`  | Individual theme files                                           |

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

Covered: Lion inheritance, Enter/Space once each, disabled/loading suppression, loading geometry and restore, Tab skipping disabled, independent theme scopes, built-package imports and registration, and automated axe checks in representative light/dark themes (Chromium).

The form/theme regression fixes and submit/reset variants passed the 25 October 2026 Chromium browser run (54 tests across 6 files). Pending: screen-reader/assistive-technology testing, cross-browser testing and framework (React/Angular) wrappers. Automated axe results are not full WCAG validation.
