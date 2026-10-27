import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent } from 'storybook/test';
import { html } from 'lit';
import type { WkModeSwitch } from './index.js';

const meta = {
  title: 'Supporting/Mode Switch',
  tags: ['autodocs'],
  render: () => html`<wk-mode-switch></wk-mode-switch>`,
  beforeEach: () => {
    const reset = document.createElement('wk-mode-switch');
    reset.mode = 'system';
    document.body.append(reset);
    reset.remove();
  },
  parameters: {
    docs: {
      description: {
        component:
          'Provisional site-wide System/Light/Dark control with native labelled radios. Writes the document root, not local theme roots. All instances share one choice; only user changes emit wk-mode-change. Storybook’s toolbar intentionally supplies a local mode override: use the real HTML example to see document-wide switching.',
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const input = (element: WkModeSwitch, mode: string) =>
  element.shadowRoot!.querySelector<HTMLInputElement>(`input[value="${mode}"]`)!;

export const System: Story = {
  play: async ({ canvasElement }) => {
    const element = canvasElement.querySelector('wk-mode-switch')!;
    await element.updateComplete;
    await expect(input(element, 'system')).toBeChecked();
    await expect(element).toHaveAttribute('mode', 'system');
  },
};

export const Light: Story = {
  render: () => html`<wk-mode-switch mode="light"></wk-mode-switch>`,
  play: async ({ canvasElement }) => {
    const element = canvasElement.querySelector('wk-mode-switch')!;
    await element.updateComplete;
    await expect(input(element, 'light')).toBeChecked();
    await expect(document.documentElement).toHaveAttribute('data-wk-mode', 'light');
  },
};

export const Dark: Story = {
  render: () => html`<wk-mode-switch mode="dark"></wk-mode-switch>`,
  play: async ({ canvasElement }) => {
    const element = canvasElement.querySelector('wk-mode-switch')!;
    await element.updateComplete;
    await expect(input(element, 'dark')).toBeChecked();
    await expect(document.documentElement).toHaveAttribute('data-wk-mode', 'dark');
  },
};

export const SharedChoice: Story = {
  render: () => html`
    <div style="display:grid;gap:16px;max-width:24rem">
      <wk-mode-switch></wk-mode-switch>
      <section data-wk-mode="light">
        <p>Local light appearance; same site-wide choice.</p>
        <wk-mode-switch></wk-mode-switch>
      </section>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const [first, second] = [...canvasElement.querySelectorAll('wk-mode-switch')];
    await first!.updateComplete;
    await userEvent.click(input(first!, 'dark'));
    await second!.updateComplete;
    await expect(input(second!, 'dark')).toBeChecked();
    await expect(document.documentElement).toHaveAttribute('data-wk-mode', 'dark');
    await expect(canvasElement.querySelector('section')).toHaveAttribute('data-wk-mode', 'light');
  },
};

export const Narrow: Story = {
  render: () => html`<div style="max-width:240px"><wk-mode-switch></wk-mode-switch></div>`,
  play: async ({ canvasElement }) => {
    const element = canvasElement.querySelector('wk-mode-switch')!;
    await element.updateComplete;
    await expect(element.scrollWidth).toBeLessThanOrEqual(240);
    for (const label of element.shadowRoot!.querySelectorAll('label')) {
      await expect(label.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    }
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
              <section
                data-wk-theme=${theme}
                data-wk-mode=${mode}
                data-wk-wireframe=${wireframe}
                style="padding:12px;background:var(--wk-surface);color:var(--wk-text)"
              >
                <p>${theme} / ${mode} / wireframe ${wireframe}</p>
                <wk-mode-switch></wk-mode-switch>
              </section>
            `,
          ),
        ),
      )}
    </div>
  `,
  play: async ({ canvasElement }) => {
    const elements = [...canvasElement.querySelectorAll('wk-mode-switch')];
    await Promise.all(elements.map((element) => element.updateComplete));
    await expect(
      new Set(elements.map((element) => getComputedStyle(element).fontFamily)).size,
    ).toBe(3);
    await expect(
      new Set(
        elements.map(
          (element) =>
            getComputedStyle(element.shadowRoot!.querySelector('fieldset')!).backgroundColor,
        ),
      ).size,
    ).toBe(2);
  },
};
