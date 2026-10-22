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

Action-only subclass of `LionButton` (no submit/reset yet). Normal `click` is the only activation event.

| Property   | Values                                                                                       | Default     |
| ---------- | -------------------------------------------------------------------------------------------- | ----------- |
| `variant`  | `primary` \| `secondary` \| `tertiary`                                                       | `secondary` |
| `intent`   | `normal` \| `positive` \| `danger`                                                           | `normal`    |
| `size`     | `small` \| `medium` \| `large`                                                               | `medium`    |
| `disabled` | boolean (Lion; leaves the tab order)                                                         | `false`     |
| `loading`  | boolean (keeps label/size/tab stop; blocks activation; sets `aria-busy` and `aria-disabled`) | `false`     |

## Theme tokens

Set on a theme root (`data-wk-theme="neutral|studio|fieldwork"`, `data-wk-mode="light|dark"`, `data-wk-wireframe="true"`). Components read these with fallbacks; host or ancestor CSS may still override them. Wireframe keeps typography and dimensions, squares corners and grays the accent.

`--wk-font`, `--wk-radius`, `--wk-text`, `--wk-surface`, `--wk-border`, `--wk-focus`, `--wk-accent`, `--wk-on-accent`, `--wk-positive`, `--wk-on-positive`, `--wk-danger`, `--wk-on-danger`, `--wk-hover-mix`, `--wk-disabled-bg`, `--wk-disabled-text`, `--wk-disabled-border`. Source of truth: `src/tokens/tokens.ts`.

## Validation status

Covered: Lion inheritance, Enter/Space once each, disabled/loading suppression, loading geometry and restore, Tab skipping disabled, independent theme scopes, built-package imports and registration, and automated axe checks in representative light/dark themes (Chromium).

Pending: screen-reader/assistive-technology testing, cross-browser testing, framework (React/Angular) wrappers, submit/reset variants. Automated axe results are not full WCAG validation.
