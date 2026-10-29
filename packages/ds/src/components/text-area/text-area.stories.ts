import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, within } from 'storybook/test';
import { html } from 'lit';
import type { WkTextArea } from './index.js';

interface TextAreaArgs {
  label: string;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  helpText: string;
  error: string;
  rows: number;
  maxRows: number;
}

const themes = ['neutral', 'studio', 'fieldwork'] as const;
const modes = ['light', 'dark'] as const;
const lines = (n: number) => Array.from({ length: n }, (_, i) => `Line ${i + 1}`).join('\n');

const meta = {
  title: 'Components/Text Area',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<wk-text-area>\` is a Lion \`LionTextarea\` with Wakata's shared scalar form behavior.
It auto-grows from \`rows\` (default 2) up to \`max-rows\` (default 6), then scrolls. Drag resizing is disabled.
Line breaks are preserved in the native value and FormData. User edits emit \`wk-input\`; the native
commit boundary emits \`wk-change\`. Programmatic value updates and reset are silent.

Automated package checks run in Chromium, Firefox and WebKit; the React controlled and Angular
reactive-form example checks run in Chromium. Manual assistive-technology and physical-device
checks have not been run. The contract is provisional.
`,
      },
    },
  },
  argTypes: {
    label: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean', name: 'readonly' },
    helpText: { control: 'text' },
    error: { control: 'text', description: 'External error text.' },
    rows: {
      control: 'number',
      description: 'Initial visible rows.',
      table: { defaultValue: { summary: '2' } },
    },
    maxRows: {
      control: 'number',
      description: 'Maximum auto-grow rows.',
      table: { defaultValue: { summary: '6' } },
    },
  },
  args: {
    label: 'Notes',
    required: false,
    disabled: false,
    readOnly: false,
    helpText: '',
    error: '',
    rows: 2,
    maxRows: 6,
  },
  render: (args) =>
    html`<wk-text-area
      name="notes"
      label=${args.label}
      rows=${args.rows}
      max-rows=${args.maxRows}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readOnly}
      help-text=${args.helpText}
      error=${args.error}
    ></wk-text-area>`,
} satisfies Meta<TextAreaArgs>;

export default meta;
type Story = StoryObj<TextAreaArgs>;

export const Empty: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('textbox', { name: 'Notes' })).toHaveValue('');
  },
};

export const Filled: Story = {
  render: () =>
    html`<wk-text-area name="notes" label="Notes" .value=${'Short note'}></wk-text-area>`,
};

export const MultilineLongContent: Story = {
  render: () =>
    html`<div style="max-width:20rem">
      <wk-text-area
        name="notes"
        label="Notes"
        .value=${`First line\nSecond line\n${'unbrokenlongcontent'.repeat(8)}`}
      ></wk-text-area>
    </div>`,
};

export const HelpAndExternalError: Story = {
  args: { helpText: 'Persistent guidance.', error: 'This note was rejected.' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Notes' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  },
};

export const RequiredInvalid: Story = {
  args: { required: true },
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector('wk-text-area') as WkTextArea;
    field.submitted = true;
    await field.validate();
    await expect(field.querySelector('textarea')!.getAttribute('aria-invalid')).toBe('true');
  },
};

export const DisabledAndReadOnly: Story = {
  name: 'Disabled and read-only',
  render: () =>
    html`<div style="display:grid;gap:16px;max-width:32rem">
      <wk-text-area name="d" label="Disabled" .value=${'Unavailable'} disabled></wk-text-area>
      <wk-text-area name="r" label="Read only" .value=${'Copyable'} readonly></wk-text-area>
    </div>`,
  play: async ({ canvasElement }) => {
    const fields = [...canvasElement.querySelectorAll('wk-text-area')] as WkTextArea[];
    await expect(fields[0]?.querySelector('textarea')?.disabled).toBe(true);
    await expect(fields[1]?.querySelector('textarea')?.readOnly).toBe(true);
  },
};

export const AutoGrowAndMaxRows: Story = {
  name: 'Auto-grow and maximum rows',
  render: () =>
    html`<div style="display:grid;gap:16px;max-width:24rem">
      <wk-text-area name="a" label="Default (2 to 6 rows)" .value=${lines(4)}></wk-text-area>
      <wk-text-area name="b" label="Beyond maximum (scrolls)" .value=${lines(12)}></wk-text-area>
    </div>`,
};

export const ThemesModesAndWireframe: Story = {
  name: 'Themes, light/dark and wireframe',
  render: () =>
    html`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:16px"
    >
      ${themes.flatMap((theme) =>
        modes.flatMap((mode) =>
          ['false', 'true'].map(
            (wireframe) =>
              html`<div
                data-wk-theme=${theme}
                data-wk-mode=${mode}
                data-wk-wireframe=${wireframe}
                style="padding:12px;background:${mode === 'dark' ? '#171717' : '#fff'};color:${mode === 'dark' ? '#fff' : '#111'}"
              >
                <wk-text-area label="Notes" help-text="Synthetic value."></wk-text-area>
              </div>`,
          ),
        ),
      )}
    </div>`,
};

export const NestedScope: Story = {
  render: () =>
    html`<div data-wk-theme="studio" data-wk-mode="light">
      <wk-text-area label="Outer" name="o"></wk-text-area>
      <div data-wk-theme="fieldwork" data-wk-mode="dark" style="padding:12px;background:#171717">
        <wk-text-area label="Inner" name="i"></wk-text-area>
      </div>
    </div>`,
};
