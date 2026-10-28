# #14 host visual review

These captures are generated from the **same built `@wakata/ds` package** in the
plain-HTML, React and Angular synthetic request/review examples. Run
`pnpm --filter @wakata/ds exec node scripts/check-slice-visual.mjs` from the repo
root after `pnpm --filter @wakata/ds build` to refresh them.

- `*-phone-light.png` and `*-phone-dark.png`: 390 × 844 viewport, neutral theme,
  with the mode switch matching the displayed mode.
- `*-desktop-light.png` and `*-desktop-dark.png`: 1280 × 900 viewport.
- `*-narrow-zoom2.png`: 640 px viewport with CSS zoom 2, approximately 320 px
  effective layout width, and reduced-motion preference. This is a CSS zoom
  check, **not** proof of actual browser zoom or a real device.
- `*-long-content-phone.png` and `*-long-content-actions-phone.png`: the same
  synthetic long name in each host at 320 × 568, with the Dialog at its initial
  scroll position and after scrolling the final action into view.

The script asserts no horizontal page overflow at 320 px and at the zoomed
width; a 44 px minimum on input, Select and submit targets; reduced-motion
transition; no browser page errors; and equivalent phone Card/form geometry
within 1 px across the three hosts. These checks test functionality and layout.
The long-content check confirms the complete name reaches the Dialog, the panel
stays within the viewport and scrolls internally, the page has no horizontal
overflow, and the final action can be reached in all three hosts.
They do not certify visual quality, contrast, manual accessibility, real-device
behavior or production use. The owner still needs to accept the final visual
reference for #14.
