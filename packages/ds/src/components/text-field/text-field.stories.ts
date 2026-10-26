import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent, within } from 'storybook/test';
import { html } from 'lit';
import type { WkTextFieldType, WkTextField } from './index.js';

interface TextFieldArgs {
  label: string;
  type: WkTextFieldType;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  helpText: string;
  error: string;
}

const themes = ['neutral', 'studio', 'fieldwork'] as const;
const modes = ['light', 'dark'] as const;

const meta = {
  title: 'Components/Text Field',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<wk-text-field>\` is a Lion \`LionInput\` with Wakata's shared scalar form behavior.
The supported native types are \`text\`, \`email\`, and \`password\`. Use a visible label,
and use \`help-text\` for persistent guidance. Required and email checks use Lion validators
as well as the native input semantics. External \`error\` text remains distinct from validation feedback.

Programmatic value updates and reset do not emit Wakata input events. User edits emit \`wk-input\`;
the native commit boundary emits \`wk-change\`. Do not use both events as duplicate state-update paths.
The password story intentionally contains no password value and no action logger.

Automated browser checks run in Chromium only. Manual assistive-technology, cross-browser and
framework-wrapper checks have not been run.
`,
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Visible label.' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password'],
      description: 'Native input type.',
      table: { defaultValue: { summary: 'text' } },
    },
    required: { control: 'boolean', description: 'Native and Lion required validation.' },
    disabled: {
      control: 'boolean',
      description: 'Native disabled behavior; excluded from FormData.',
    },
    readOnly: { control: 'boolean', name: 'readonly', description: 'Native read-only behavior.' },
    helpText: { control: 'text', description: 'Persistent help text.' },
    error: { control: 'text', description: 'External error text.' },
  },
  args: {
    label: 'Display name',
    type: 'text',
    required: false,
    disabled: false,
    readOnly: false,
    helpText: '',
    error: '',
  },
  render: (args) =>
    html`<wk-text-field
      name="displayName"
      label=${args.label}
      type=${args.type}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?readonly=${args.readOnly}
      help-text=${args.helpText}
      error=${args.error}
    ></wk-text-field>`,
} satisfies Meta<TextFieldArgs>;

export default meta;
type Story = StoryObj<TextFieldArgs>;

export const Playground: Story = {};

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Display name' });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await expect(getComputedStyle(input).outlineStyle).toBe('solid');
    await expect(Number.parseFloat(getComputedStyle(input).outlineWidth)).toBeGreaterThan(0);
  },
};

export const Filled: Story = {
  render: (args) =>
    html`<wk-text-field
      name="displayName"
      label=${args.label}
      value="Bergen"
      type=${args.type}
    ></wk-text-field>`,
};

export const RequiredInvalid: Story = {
  args: { required: true },
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector('wk-text-field') as WkTextField;
    const input = field.querySelector('input')!;
    field.submitted = true;
    await field.validate();
    await expect(input.required).toBe(true);
    await expect(input.getAttribute('aria-required')).toBe('true');
    await expect(input.getAttribute('aria-invalid')).toBe('true');
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector('wk-text-field') as WkTextField;
    await field.updateComplete;
    await expect(field.querySelector('input')!.disabled).toBe(true);
  },
};

export const ReadOnly: Story = {
  args: { readOnly: true },
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector('wk-text-field') as WkTextField;
    await field.updateComplete;
    await expect(field.querySelector('input')!.readOnly).toBe(true);
  },
};

export const HelpAndExternalError: Story = {
  args: {
    helpText: 'Use the address associated with your account.',
    error: 'This address is already in use.',
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Display name' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    const descriptions = (input.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent?.trim());
    await expect(descriptions).toContain('Use the address associated with your account.');
    await expect(descriptions).toContain('This address is already in use.');
  },
};

export const Text: Story = {};

export const Email: Story = {
  args: { label: 'Email address', type: 'email' },
};

export const Password: Story = {
  args: { label: 'Password', type: 'password' },
  parameters: {
    docs: { description: { story: 'Shows the native password control without a sample value.' } },
  },
};

export const LongLabelAndHelp: Story = {
  args: {
    label:
      'Name to display on the account, including any regional or departmental information that helps colleagues identify you',
    helpText:
      'This information is visible to colleagues in every workspace and may wrap across several lines on narrow screens.',
  },
  decorators: [(story) => html`<div style="max-width:320px">${story()}</div>`],
};

export const NarrowReflow: Story = {
  args: { label: 'Work email', type: 'email', helpText: 'Used for account updates.' },
  decorators: [(story) => html`<div data-testid="narrow" style="width:280px">${story()}</div>`],
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('[data-testid="narrow"]') as HTMLElement;
    await expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth);
    const input = host.querySelector('input')!;
    await expect(input.getBoundingClientRect().width).toBeGreaterThan(0);
    await expect(input.getBoundingClientRect().width).toBeLessThanOrEqual(host.clientWidth);
  },
};

export const RealForm: Story = {
  args: { type: 'email', label: 'Email address', required: true },
  render: (args) =>
    html`<wk-form
      ><form novalidate style="display:grid;gap:12px;max-width:24rem">
        <wk-text-field
          name="email"
          type=${args.type}
          label=${args.label}
          ?required=${args.required}
          help-text="A synthetic address for this form example."
        ></wk-text-field>
        <div style="display:flex;gap:8px">
          <wk-button-submit variant="primary">Continue</wk-button-submit>
          <wk-button-reset>Reset</wk-button-reset>
        </div>
      </form></wk-form
    >`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvasElement.querySelector('wk-form')!;
    const field = canvasElement.querySelector('wk-text-field') as WkTextField;
    const input = canvas.getByRole('textbox', { name: 'Email address' });
    let attempts = 0;
    form.addEventListener('submit', () => attempts++);
    await userEvent.click(canvas.getByText('Continue'));
    await expect(attempts).toBe(1);
    await expect(field.hasFeedbackFor).toContain('error');
    await userEvent.type(input, 'person@example.test');
    await userEvent.click(canvas.getByText('Continue'));
    await expect(attempts).toBe(2);
    await userEvent.click(canvas.getByText('Reset'));
    await expect((input as HTMLInputElement).value).toBe('');
  },
};

export const ThemesModesAndWireframe: Story = {
  name: 'Themes, light/dark and wireframe',
  parameters: {
    docs: {
      description: {
        story: 'Each cell uses an explicit theme root so adjacent themes and modes stay isolated.',
      },
    },
  },
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
                data-cell=${`${theme}-${mode}-${wireframe}`}
                style="padding:12px;background:${mode === 'dark' ? '#171717' : '#fff'};color:${
                  mode === 'dark' ? '#fff' : '#111'
                }"
              >
                <wk-text-field
                  label="Contact"
                  help-text="A synthetic contact value."
                ></wk-text-field>
              </div>`,
          ),
        ),
      )}
    </div>`,
  play: async ({ canvasElement }) => {
    const field = (cell: string) =>
      canvasElement.querySelector(`[data-cell="${cell}"] wk-text-field`)!;
    const container = (cell: string) =>
      field(cell).shadowRoot!.querySelector('.input-group__container')!;
    const fonts = themes.map((theme) => getComputedStyle(field(`${theme}-light-false`)).fontFamily);
    await expect(new Set(fonts).size).toBe(3);
    for (const theme of themes) {
      await expect(getComputedStyle(container(`${theme}-light-false`)).backgroundColor).not.toBe(
        getComputedStyle(container(`${theme}-dark-false`)).backgroundColor,
      );
      await expect(getComputedStyle(container(`${theme}-light-true`)).borderRadius).toBe('0px');
    }
  },
};
