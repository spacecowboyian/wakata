# Focus geometry review — issue #68

## Scope and decision status

This is a corrective change to provisional TextField, Select and TextArea focus styling, not shared production promotion. Ian's visual acceptance of the final appearance is pending. The separate comparison worktree's uncommitted TextField/Select experiment remains intact; its `:focus-within` wrapper stroke was reviewed and replaced here because it broadened the prior `:focus-visible` trigger and relied on a shadow that forced-colors mode removes.

The candidate retains each native control's `:focus-visible` outline, gives the slotted control the configured `--wk-radius`, and keeps the forced-colors `Highlight` outline. The Select chevron and dark corner rules from #36 are unchanged.

## Reproduction and review images

The original client-theme TextArea reproduction shows a square focus edge outside a rounded field. It is a different fixture from the Storybook captures below, so it is evidence of the defect rather than a pixel-matched before image.

| Image                                                                                                             | Description                                           |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [`text-area-original-reproduction.png`](../../packages/ds/review/field-focus/text-area-original-reproduction.png) | Original local Studio reproduction                    |
| [`text-field-studio-light.png`](../../packages/ds/review/field-focus/text-field-studio-light.png)                 | TextField; six theme/mode cells, Studio light focused |
| [`select-studio-light.png`](../../packages/ds/review/field-focus/select-studio-light.png)                         | Select; six theme/mode cells, Studio light focused    |
| [`text-area-studio-light.png`](../../packages/ds/review/field-focus/text-area-studio-light.png)                   | TextArea; six theme/mode cells, Studio light focused  |
| [`text-field-studio-forced-colors.png`](../../packages/ds/review/field-focus/text-field-studio-forced-colors.png) | TextField; Chromium forced-colors emulation           |
| [`select-studio-forced-colors.png`](../../packages/ds/review/field-focus/select-studio-forced-colors.png)         | Select; Chromium forced-colors emulation              |
| [`text-area-studio-forced-colors.png`](../../packages/ds/review/field-focus/text-area-studio-forced-colors.png)   | TextArea; Chromium forced-colors emulation            |

## Automated evidence

- Focus stories render all three approved themes in light/dark and check keyboard focus, the 2px outline, offset and computed radius: 35/35 focused story tests in each of Chromium, Firefox and WebKit.
- A Chromium package test emulates forced colors and verifies actual `Highlight` outline color, 2px outline and 16px Studio radius for all three native controls: 1/1.
- Full root `pnpm test` passes: DS 268/268, Angular example 11/11, React example 13/13, plus the mode-switch HTML smoke.
- Root lint and typecheck pass. Static Storybook build and its component smoke scripts pass.
- Local GitHub Copilot CLI used 69.18 AI credits of the 100-credit issue cap. Codex reviewed, tightened the story fixtures and added the forced-colors emulation test and captures.

## Remaining evidence

Owner visual acceptance and PR CI/preview review remain pending. Manual AT and physical-device evidence remain under #59; Windows/NVDA remains untested under #45. These automated checks do not certify accessibility or production use.
