import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { html } from 'lit';
import type { WkButtonSubmit } from './index.js';

interface FormButtonArgs {
  onSubmit: (data: string) => void;
}

const themes = ['neutral', 'studio', 'fieldwork'] as const;
const modes = ['light', 'dark'] as const;

const meta = {
  title: 'Components/Form buttons',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<wk-button-submit>\` and \`<wk-button-reset>\` are Wakata subclasses of Lion's \`LionButtonSubmit\` and
\`LionButtonReset\`. They act on the closest native \`<form>\` ancestor **in the same DOM tree**: click, Enter,
Space and implicit submission from fields all behave natively, and an invalid form does not submit.
They share the \`variant\`, \`intent\` and \`size\` appearance of \`<wk-button>\`: affirmative actions use
\`variant="primary"\`; \`intent="danger"\` is red and for destructive actions; green is never a Button action.

**Known gap:** there is no \`loading\` state for form buttons. Lion handles click delegation in its own
constructor, so blocking it needs a private API or a global listener; neither is used. Disable the form or
fields while submitting instead.
`,
      },
    },
  },
  args: { onSubmit: fn() },
} satisfies Meta<FormButtonArgs>;

export default meta;
type Story = StoryObj<FormButtonArgs>;

const submitHandler = (args: FormButtonArgs) => (event: SubmitEvent) => {
  event.preventDefault();
  args.onSubmit(new FormData(event.target as HTMLFormElement).get('city') as string);
};

const form = (args: FormButtonArgs) =>
  html`<form @submit=${submitHandler(args)} style="display:grid;gap:12px;max-width:20rem">
    <label style="display:grid;gap:4px">City <input name="city" value="Oslo" required /> </label>
    <div style="display:flex;gap:12px">
      <wk-button-submit variant="primary">Send</wk-button-submit>
      <wk-button-reset>Reset</wk-button-reset>
    </div>
  </form>`;

export const SubmitAndReset: Story = {
  render: form,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('City') as HTMLInputElement;
    await userEvent.click(canvas.getByText('Send'));
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Oslo');

    await userEvent.clear(input);
    await userEvent.click(canvas.getByText('Send'));
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);

    await userEvent.type(input, 'Bergen');
    await userEvent.click(canvas.getByText('Reset'));
    await expect(input.value).toBe('Oslo');
  },
};

export const KeyboardSubmit: Story = {
  name: 'Keyboard and implicit submit',
  render: form,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    (canvas.getByText('Send') as WkButtonSubmit).focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    await expect(args.onSubmit).toHaveBeenCalledTimes(2);
    await userEvent.click(canvas.getByLabelText('City'));
    await userEvent.keyboard('{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledTimes(3);
  },
};

export const Disabled: Story = {
  render: (args) =>
    html`<form @submit=${submitHandler(args)} style="display:flex;gap:12px">
      <input name="city" value="Oslo" aria-label="City" />
      <wk-button-submit variant="primary" disabled>Send</wk-button-submit>
    </form>`,
  play: async ({ canvasElement, args }) => {
    const button = canvasElement.querySelector('wk-button-submit') as WkButtonSubmit;
    await button.updateComplete;
    button.click();
    await expect(args.onSubmit).not.toHaveBeenCalled();
    await expect(button.tabIndex).toBe(-1);
  },
};

export const DestructiveReset: Story = {
  render: () =>
    html`<form style="display:flex;gap:12px">
      <wk-button-submit variant="primary">Save</wk-button-submit>
      <wk-button-reset intent="danger">Discard changes</wk-button-reset>
    </form>`,
};

/** Every theme in light and dark, plus the company wireframe, each as its own scoped root. */
export const ThemeModeWireframeMatrix: Story = {
  name: 'Themes, light/dark and wireframe',
  parameters: {
    docs: {
      description: {
        story:
          'Illustrative: each cell sets its own `data-wk-theme`, `data-wk-mode` and `data-wk-wireframe` root.',
      },
    },
  },
  render: () =>
    html`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:12px"
    >
      ${themes.flatMap((theme) =>
        modes.flatMap((mode) =>
          ['false', 'true'].map(
            (wireframe) =>
              html`<form
                data-wk-theme=${theme}
                data-wk-mode=${mode}
                data-wk-wireframe=${wireframe}
                data-cell=${`${theme}-${mode}-${wireframe}`}
                style="padding:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:${
                  mode === 'dark' ? '#171717' : '#fff'
                };color:${mode === 'dark' ? '#fff' : '#111'}"
              >
                <span>${theme} ${mode}${wireframe === 'true' ? ' wireframe' : ''}</span>
                <wk-button-submit variant="primary">Send</wk-button-submit>
                <wk-button-reset intent="danger">Discard</wk-button-reset>
              </form>`,
          ),
        ),
      )}
    </div>`,
  play: async ({ canvasElement }) => {
    const style = (cell: string, selector: string) =>
      getComputedStyle(canvasElement.querySelector(`[data-cell=${cell}] ${selector}`)!);
    for (const theme of themes) {
      const light = style(`${theme}-light-false`, 'wk-button-submit');
      const dark = style(`${theme}-dark-false`, 'wk-button-submit');
      await expect(light.backgroundColor).not.toBe(dark.backgroundColor);

      const plain = style(`${theme}-light-false`, 'wk-button-reset');
      const wire = style(`${theme}-light-true`, 'wk-button-reset');
      await expect(wire.borderRadius).toBe('0px');
      // Wireframe keeps the semantic red of destructive actions and never turns it green.
      await expect(wire.color).toBe(plain.color);
      await expect(wire.borderColor).toBe(plain.borderColor);
    }
  },
};
