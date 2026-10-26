import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { html } from 'lit';
import type { WkButton, WkButtonIntent, WkButtonSize, WkButtonVariant } from './index.js';

interface ButtonArgs {
  label: string;
  variant: WkButtonVariant;
  intent: WkButtonIntent;
  size: WkButtonSize;
  disabled: boolean;
  loading: boolean;
  onClick: (event: MouseEvent) => void;
}

const variants: WkButtonVariant[] = ['primary', 'secondary', 'tertiary'];
const intents: WkButtonIntent[] = ['normal', 'danger'];
const sizes: WkButtonSize[] = ['small', 'medium', 'large'];

const row = 'display:flex;flex-wrap:wrap;gap:16px;align-items:center';

const meta = {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`<wk-button>\` is an **action-only** button: a Wakata subclass of Lion's \`LionButton\` that keeps Lion's
role, keyboard activation and disabled behaviour. Form submit/reset are out of scope for this component.

**Real behaviour** (covered by browser tests): Enter and Space each activate once via the normal \`click\`
event; \`disabled\` suppresses activation and leaves the tab order; \`loading\` blocks mouse, keyboard and
programmatic activation while keeping the label, size and tab stop, and exposes \`aria-busy\` and
\`aria-disabled\`.

**Usage guidance:** use a verb-led visible label (the label is the accessible name); use one primary
action per region; reserve \`intent="danger"\` for destructive actions and pair it with clear wording;
prefer \`loading\` over swapping the label so the name stays stable.

**Illustrative only:** theme, mode and wireframe toolbar choices, and the Studio/Fieldwork themes, are
example appearances. Automated axe checks cover representative light and dark themes and are not a full
WCAG or assistive-technology evaluation.
`,
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Slot content / accessible name (story-only arg).' },
    variant: {
      control: 'inline-radio',
      options: variants,
      description: 'Visual emphasis.',
      table: { defaultValue: { summary: 'secondary' } },
    },
    intent: {
      control: 'inline-radio',
      options: intents,
      description: 'Semantic intent.',
      table: { defaultValue: { summary: 'normal' } },
    },
    size: {
      control: 'inline-radio',
      options: sizes,
      description: 'Control size.',
      table: { defaultValue: { summary: 'medium' } },
    },
    disabled: { control: 'boolean', description: 'Lion disabled behaviour; skipped in tab order.' },
    loading: {
      control: 'boolean',
      description: 'Busy: keeps label and tab stop, blocks activation.',
    },
    onClick: { action: 'click', description: 'Native click event.' },
  },
  args: {
    label: 'Save changes',
    variant: 'secondary',
    intent: 'normal',
    size: 'medium',
    disabled: false,
    loading: false,
    onClick: fn(),
  },
  render: (args) =>
    html`<wk-button
      variant=${args.variant}
      intent=${args.intent}
      size=${args.size}
      ?disabled=${args.disabled}
      ?loading=${args.loading}
      @click=${args.onClick}
      >${args.label}</wk-button
    >`,
} satisfies Meta<ButtonArgs>;

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) =>
    html`<div style=${row}>
      ${variants.map(
        (variant) =>
          html`<wk-button variant=${variant} @click=${args.onClick}>${variant} action</wk-button>`,
      )}
    </div>`,
};

export const Intents: Story = {
  render: (args) =>
    html`<div style=${row}>
      ${intents.map(
        (intent) =>
          html`<wk-button intent=${intent} @click=${args.onClick}>${intent} intent</wk-button>`,
      )}
      ${intents.map(
        (intent) =>
          html`<wk-button variant="primary" intent=${intent} @click=${args.onClick}
            >${intent} primary</wk-button
          >`,
      )}
    </div>`,
};

export const Sizes: Story = {
  render: (args) =>
    html`<div style=${row}>
      ${sizes.map((size) => html`<wk-button size=${size} @click=${args.onClick}>${size}</wk-button>`)}
    </div>`,
};

export const Disabled: Story = {
  args: { disabled: true, label: 'Unavailable' },
  play: async ({ canvasElement, args }) => {
    const button = canvasElement.querySelector('wk-button') as WkButton;
    await button.updateComplete;
    button.click();
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await expect(args.onClick).not.toHaveBeenCalled();
    await expect(button.tabIndex).toBe(-1);
  },
};

export const DisabledSkippedByTab: Story = {
  name: 'Disabled is skipped by Tab',
  render: (args) =>
    html`<div style=${row}>
      <wk-button @click=${args.onClick}>First</wk-button>
      <wk-button disabled @click=${args.onClick}>Unavailable</wk-button>
      <wk-button @click=${args.onClick}>Last</wk-button>
    </div>`,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByText('First')).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByText('Last')).toHaveFocus();
  },
};

export const Loading: Story = {
  args: { loading: true, label: 'Saving' },
  play: async ({ canvasElement, args }) => {
    const button = canvasElement.querySelector('wk-button') as WkButton;
    await button.updateComplete;
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await expect(button.tabIndex).toBe(0);
    await expect(button.textContent?.trim()).toBe('Saving');

    button.click();
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const LoadingPreservesGeometryAndRestores: Story = {
  name: 'Loading preserves geometry and restores',
  args: { label: 'Run preview' },
  play: async ({ canvasElement, args }) => {
    const button = canvasElement.querySelector('wk-button') as WkButton;
    await button.updateComplete;
    const before = button.getBoundingClientRect();
    button.loading = true;
    await button.updateComplete;
    const after = button.getBoundingClientRect();
    await expect([after.width, after.height]).toEqual([before.width, before.height]);
    await expect(button.textContent?.trim()).toBe('Run preview');
    await expect(button.tabIndex).toBe(0);
    button.loading = false;
    await button.updateComplete;
    await expect(button).not.toHaveAttribute('aria-busy');
    await expect(button).not.toHaveAttribute('aria-disabled');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const KeyboardActivation: Story = {
  name: 'Enter and Space activate once each',
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button');
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  },
};

export const MouseActivation: Story = {
  name: 'Click activates once',
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button'));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const LongLabel: Story = {
  args: {
    label: 'Approve the quarterly supplier agreement and notify every regional finance contact',
  },
  decorators: [(story) => html`<div style="max-width:320px">${story()}</div>`],
};

export const ThemeComparison: Story = {
  parameters: {
    docs: { description: { story: 'Illustrative: the same markup under each theme.' } },
  },
  render: (args) =>
    html`<div style="display:grid;gap:16px">
      ${(['neutral', 'studio', 'fieldwork'] as const).map(
        (theme) =>
          html`<div data-wk-theme=${theme} style=${row}>
            <span style="min-width:90px">${theme}</span>
            ${variants.map(
              (variant) =>
                html`<wk-button variant=${variant} @click=${args.onClick}>${variant}</wk-button>`,
            )}
            <wk-button intent="danger" @click=${args.onClick}>Delete</wk-button>
          </div>`,
      )}
    </div>`,
};

export const ScopedThemes: Story = {
  name: 'Independently scoped themes',
  parameters: {
    docs: {
      description: {
        story:
          'Each scope sets `data-wk-theme` on its own root, so themes stay independent of the toolbar theme.',
      },
    },
  },
  render: (args) =>
    html`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,10rem),1fr));gap:16px"
    >
      ${(['neutral', 'studio', 'fieldwork'] as const).map(
        (theme) =>
          html`<div
            data-wk-theme=${theme}
            data-testid=${theme}
            style="padding:16px;border:1px solid #999"
          >
            <wk-button variant="primary" @click=${args.onClick}>Same component</wk-button>
          </div>`,
      )}
    </div>`,
  play: async ({ canvasElement }) => {
    const styles = ['neutral', 'studio', 'fieldwork'].map((theme) =>
      getComputedStyle(canvasElement.querySelector(`[data-testid=${theme}] wk-button`) as WkButton),
    );
    await expect(new Set(styles.map((s) => s.fontFamily)).size).toBe(3);
    await expect(new Set(styles.map((s) => s.borderRadius)).size).toBe(3);
    await expect(new Set(styles.map((s) => s.backgroundColor)).size).toBe(3);
  },
};

export const ScopedThemesNarrow: Story = {
  ...ScopedThemes,
  name: 'Scoped themes at narrow width',
  decorators: [(story) => html`<div data-testid="narrow" style="width:320px">${story()}</div>`],
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('[data-testid=narrow]') as HTMLElement;
    await expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth);
    for (const cell of host.querySelectorAll('[data-wk-theme]')) {
      await expect(cell.getBoundingClientRect().right).toBeLessThanOrEqual(
        host.getBoundingClientRect().right,
      );
    }
  },
};

export const DarkTheme: Story = {
  globals: { mode: 'dark' },
  render: (args) =>
    html`<div style=${row}>
      ${variants.map(
        (variant) =>
          html`<wk-button variant=${variant} @click=${args.onClick}>${variant}</wk-button>`,
      )}
      <wk-button intent="danger" @click=${args.onClick}>Delete</wk-button>
      <wk-button disabled @click=${args.onClick}>Unavailable</wk-button>
    </div>`,
};

export const DarkStudio: Story = {
  ...DarkTheme,
  globals: { mode: 'dark', theme: 'studio' },
};

export const Wireframe: Story = {
  ...ThemeComparison,
  globals: { wireframe: 'on', theme: 'studio' },
  parameters: {
    docs: {
      description: {
        story:
          'Company wireframe keeps typography and dimensions, squares corners and grays the accent.',
      },
    },
  },
};
