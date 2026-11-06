# Focus geometry review — issue #68

## Scope and decision status

This is a corrective change to provisional TextField, Select and TextArea focus styling, not shared production promotion. Ian rejected the spaced outer ring on the first PR #70 preview and requested a single focus-colored field edge. Acceptance of the revised appearance is pending. The separate comparison worktree's uncommitted TextField/Select experiment remains intact.

The revised candidate keeps native keyboard focus, removes the native outline and colors the rounded wrapper border on focus. A same-color inset stroke makes a continuous 2px edge without a gap or layout shift. Forced-colors mode uses a 2px `Highlight` outline over the same edge because box shadows are suppressed there. The Select chevron and dark corner rules from #36 are unchanged.

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

- Focus stories render all three approved themes in light/dark and check keyboard focus, the focus-colored wrapper border, the same-color inset stroke and computed radius.
- Chromium package tests verify that focused invalid fields use the same focus-colored edge, and emulate forced colors to check actual `Highlight` border/outline color, 2px outline and 16px Studio radius for all three native controls.
- Full root `pnpm test` passes: DS 269/269, Angular example 11/11, React example 13/13, plus the mode-switch HTML smoke.
- Root lint and typecheck pass. Static Storybook build and its component smoke scripts pass.
- Local GitHub Copilot CLI used 69.18 AI credits of the 100-credit issue cap. Codex reviewed, tightened the story fixtures and added the forced-colors emulation test and captures.

## Remaining evidence

Owner visual acceptance and revised PR CI/preview review remain pending. Manual AT and physical-device evidence remain under #59; Windows/NVDA remains untested under #45. WCAG 2.4.13 AAA focus-area and contrast assessment has not been completed. These automated checks do not certify accessibility or production use.
