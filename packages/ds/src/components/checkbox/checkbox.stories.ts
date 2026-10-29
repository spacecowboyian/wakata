import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import type { WkCheckbox } from './wk-checkbox.js';

const meta = {
  title: 'Components/Checkbox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Checkbox submits its choice value only when checked. A standalone required checkbox must be checked;
a required group needs at least one selection. User activation emits one \`wk-input\` and one
\`wk-change\` with \`{ checked, name, value }\`. Programmatic changes and reset are silent.
Use Checkbox for submitted consent and choices. Tri-state is outside this contract.
Manual assistive technology and physical device checks remain deferred.
`,
      },
    },
  },
  render: () =>
    html`<wk-checkbox name="consent" label="I agree to the synthetic terms"></wk-checkbox>`,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};
export const Checked: Story = {
  render: () =>
    html`<wk-checkbox name="consent" label="I agree to the synthetic terms" checked></wk-checkbox>`,
};
export const Disabled: Story = {
  render: () =>
    html`<div style="display:grid;gap:12px;max-width:28rem">
      <wk-checkbox label="Unavailable option" disabled></wk-checkbox>
      <wk-checkbox label="Previously selected option" checked disabled></wk-checkbox>
    </div>`,
};
export const Focused: Story = {
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector('wk-checkbox input') as HTMLInputElement;
    await (canvasElement.querySelector('wk-checkbox') as WkCheckbox)?.updateComplete;
    control.focus();
  },
};
export const RequiredAndError: Story = {
  render: () =>
    html`<wk-checkbox
      name="consent"
      label="I agree to the synthetic terms"
      help-text="This selection is required to continue."
      required
      error="Please review and accept the terms."
    ></wk-checkbox>`,
};
export const RequiredGroup: Story = {
  render: () =>
    html`<wk-checkbox-group
      name="features[]"
      label="Features to review"
      help-text="Choose at least one."
      required
    >
      <wk-checkbox name="features[]" label="Bodywork" .choiceValue=${'bodywork'}></wk-checkbox>
      <wk-checkbox name="features[]" label="Engine" .choiceValue=${'engine'}></wk-checkbox>
      <wk-checkbox name="features[]" label="Interior" .choiceValue=${'interior'}></wk-checkbox>
    </wk-checkbox-group>`,
};
export const GroupError: Story = {
  render: () =>
    html`<wk-checkbox-group
      name="features[]"
      label="Features to review"
      help-text="Choose at least one."
      error="Select a feature before continuing."
    >
      <wk-checkbox name="features[]" label="Bodywork" .choiceValue=${'bodywork'}></wk-checkbox>
      <wk-checkbox name="features[]" label="Engine" .choiceValue=${'engine'}></wk-checkbox>
    </wk-checkbox-group>`,
};
export const LongLabelNarrow: Story = {
  render: () =>
    html`<div style="max-width:240px">
      <wk-checkbox
        name="consent"
        label="Send me a detailed synthetic report about the inspection, ownership history, and all items I selected for review."
      ></wk-checkbox>
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
                <wk-checkbox label="Selected option" checked></wk-checkbox>
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
      <wk-checkbox label="Neutral choice" checked></wk-checkbox>
      <div
        data-wk-theme="studio"
        data-wk-mode="dark"
        style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        <wk-checkbox label="Nested studio choice" checked></wk-checkbox>
      </div>
      <wk-checkbox label="Neutral choice again"></wk-checkbox>
    </div>`,
};
