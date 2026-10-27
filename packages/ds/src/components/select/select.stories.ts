import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { html } from 'lit';
import type { WkSelect } from './index.js';

const options = () => html`
  <option value="">Choose a destination</option>
  <option value="oslo">Oslo</option>
  <option value="bergen">Bergen</option>
`;

const meta = {
  title: 'Components/Select',
  tags: ['autodocs'],
  render: () => html`
    <wk-select name="destination" label="Destination" help-text="Choose one synthetic destination.">
      <select slot="input">
        ${options()}
      </select>
    </wk-select>
  `,
  parameters: {
    docs: {
      description: {
        component:
          'Single native select using Lion and the shared scalar field facade. Supply a select in slot="input", direct option children with unique string values, and an empty first option for the prompt. The closed control has a decorative chevron; the picker remains native. Browsers supporting select:open turn it upward while open; other browsers retain the downward chevron. No readonly, search, multiselect or custom popup. Native menus vary by OS; long option text may truncate in the closed control. Use wk-input for value updates and wk-change only for commit notification.',
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Empty: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('combobox', { name: 'Destination' })).toHaveValue(
      '',
    );
  },
};

export const Selected: Story = {
  render: () => html`
    <wk-select name="destination" label="Destination" value="bergen">
      <select slot="input">
        ${options()}
      </select>
    </wk-select>
  `,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('combobox', { name: 'Destination' })).toHaveValue(
      'bergen',
    );
  },
};

export const RequiredInvalid: Story = {
  render: () => html`
    <wk-select name="destination" label="Destination" required>
      <select slot="input">
        ${options()}
      </select>
    </wk-select>
  `,
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector('wk-select') as WkSelect;
    field.submitted = true;
    await field.validate();
    await expect(field.querySelector('select')).toHaveAttribute('aria-invalid', 'true');
    await waitFor(async () => {
      const feedback = field.querySelector('[slot="feedback"]')?.shadowRoot?.textContent;
      await expect(feedback).toContain('Please select an option.');
      await expect(feedback).not.toContain('Please configure an error message');
    });
  },
};

export const Disabled: Story = {
  render: () => html`
    <wk-select name="destination" label="Destination" disabled value="oslo">
      <select slot="input">
        ${options()}
      </select>
    </wk-select>
  `,
};

export const HelpAndExternalError: Story = {
  render: () => html`
    <wk-select
      name="destination"
      label="Destination"
      help-text="Choose one synthetic destination."
      error="This destination is temporarily unavailable."
    >
      <select slot="input">
        ${options()}
      </select>
    </wk-select>
  `,
};

export const LongContent: Story = {
  render: () => html`
    <div style="max-width:280px">
      <wk-select
        label="Destination for the next synthetic regional planning workshop and team gathering"
        help-text="Native menus control their own wrapping and may truncate long option names."
      >
        <select slot="input">
          <option value="">Choose a destination</option>
          <option value="long">
            A very long synthetic destination name for a regional workshop
          </option>
        </select>
      </wk-select>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const field = canvasElement.querySelector('wk-select')!;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    await expect(
      field.querySelector('select')!.getBoundingClientRect().height,
    ).toBeGreaterThanOrEqual(44);
  },
};

export const RealForm: Story = {
  render: () => html`
    <wk-form>
      <form novalidate style="display:grid;gap:12px;max-width:24rem">
        <wk-select name="destination" label="Destination" required>
          <select slot="input">
            ${options()}
          </select>
        </wk-select>
        <div style="display:flex;gap:8px">
          <wk-button-submit variant="primary">Continue</wk-button-submit>
          <wk-button-reset>Reset</wk-button-reset>
        </div>
      </form>
    </wk-form>
  `,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvasElement.querySelector('wk-select') as WkSelect;
    await userEvent.click(canvas.getByText('Continue'));
    await expect(field.hasFeedbackFor).toContain('error');
    const select = canvas.getByRole('combobox', { name: 'Destination' });
    await userEvent.selectOptions(select, 'oslo');
    await expect(new FormData(canvasElement.querySelector('form')!).get('destination')).toBe(
      'oslo',
    );
    await userEvent.click(canvas.getByText('Reset'));
    await expect(select).toHaveValue('');
    await expect(field.submitted).toBe(false);
  },
};

export const ThemesModesAndWireframe: Story = {
  render: () => html`
    <div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:16px"
    >
      ${['neutral', 'studio', 'fieldwork'].flatMap((theme) =>
        ['light', 'dark'].flatMap((mode) =>
          ['false', 'true'].map(
            (wireframe) => html`
              <div
                data-wk-theme=${theme}
                data-wk-mode=${mode}
                data-wk-wireframe=${wireframe}
                style="padding:12px;background:var(--wk-surface);color:var(--wk-text)"
              >
                <wk-select label="${theme} ${mode}" help-text="Synthetic destination">
                  <select slot="input">
                    ${options()}
                  </select>
                </wk-select>
              </div>
            `,
          ),
        ),
      )}
    </div>
  `,
  play: async ({ canvasElement }) => {
    const fields = [...canvasElement.querySelectorAll('wk-select')];
    await expect(new Set(fields.map((field) => getComputedStyle(field).fontFamily)).size).toBe(3);
    await expect(
      new Set(
        fields.map((field) => getComputedStyle(field.querySelector('select')!).backgroundColor),
      ).size,
    ).toBe(2);
  },
};
