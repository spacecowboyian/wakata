import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { WkSwitch } from './wk-switch.js';

const meta = {
  title: 'Components/Switch',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Switch changes an immediate setting and does not submit a form value. Keep its label stable
between states. User activation emits one \`wk-input\` and one \`wk-change\` with
\`{ checked, name }\`; programmatic changes are silent. It has no required or readonly API.
Manual assistive technology and physical device checks remain deferred.
`,
      },
    },
  },
  render: () => html`<wk-switch name="alerts" label="Synthetic alerts"></wk-switch>`,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};
export const On: Story = {
  render: () => html`<wk-switch name="alerts" label="Synthetic alerts" checked></wk-switch>`,
};
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector('wk-switch') as WkSwitch;
    await field?.updateComplete;
    field.querySelector<HTMLElement>('[role="switch"]')?.focus();
  },
};
export const Disabled: Story = {
  render: () =>
    html`<div style="display:grid;gap:12px;max-width:28rem">
      <wk-switch label="Unavailable setting" disabled></wk-switch>
      <wk-switch label="Previously enabled setting" checked disabled></wk-switch>
    </div>`,
};
export const LongLabelNarrow: Story = {
  render: () =>
    html`<div style="max-width:240px">
      <wk-switch
        label="Show the full synthetic inspection history with every optional detail"
      ></wk-switch>
    </div>`,
};
export const ThemesModesWireframe: Story = {
  name: 'Themes, modes and wireframe',
  render: () =>
    html`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));gap:16px"
    >
      ${(['neutral', 'studio', 'fieldwork'] as const).flatMap((theme) =>
        (['light', 'dark'] as const).flatMap((mode) =>
          (['false', 'true'] as const).map(
            (wireframe) =>
              html`<section
                data-wk-theme=${theme}
                data-wk-mode=${mode}
                data-wk-wireframe=${wireframe}
                style="padding:16px;background:var(--wk-surface);color:var(--wk-text);border:1px solid var(--wk-border)"
              >
                <p>${theme} / ${mode} / wireframe ${wireframe}</p>
                <wk-switch label="Alerts" checked></wk-switch>
              </section>`,
          ),
        ),
      )}
    </div>`,
};

export const NestedScope: Story = {
  name: 'Adjacent and nested themes',
  render: () =>
    html`<div
      data-wk-theme="neutral"
      data-wk-mode="light"
      style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
    >
      <wk-switch label="Neutral alerts" checked></wk-switch>
      <div
        data-wk-theme="studio"
        data-wk-mode="dark"
        style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        <wk-switch label="Nested studio alerts" checked></wk-switch>
      </div>
      <wk-switch label="Neutral alerts again"></wk-switch>
    </div>`,
};
