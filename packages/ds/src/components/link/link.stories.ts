import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, within } from 'storybook/test';
import { html } from 'lit';

const meta = {
  title: 'Components/Link',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`wk-link\` is a provisional Lit component wrapping a native anchor. It takes \`href\`, \`target\`, \`rel\` and \`variant\` (\`inline\` default, or \`standalone\`). The native link name, keyboard activation and browser affordances are kept. Without an href (or with a \`javascript:\`, \`data:\`, or \`vbscript:\` href) it renders plain text: no role, tab stop or disabled/button behavior. \`target="_blank"\` always adds \`noopener noreferrer\` to the effective rel. Both treatments remain underlined so link affordance does not depend on color. Colors come from existing \`--wk-accent\` and \`--wk-focus\` tokens; no new tokens.
`,
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Inline: Story = {
  render: () =>
    html`<p>Read the <wk-link href="#guide">style guide</wk-link> before contributing.</p>`,
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('wk-link')!;
    await host.updateComplete;
    const a = host.shadowRoot!.querySelector('a')!;
    await expect(a).toHaveAttribute('href', '#guide');
    a.focus();
    await expect(host.shadowRoot!.activeElement).toBe(a);
  },
};

export const Standalone: Story = {
  render: () => html`<wk-link variant="standalone" href="#next">Continue to next step</wk-link>`,
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('wk-link')!;
    await host.updateComplete;
    await expect(getComputedStyle(host).display).toBe('inline-block');
    await expect(within(canvasElement).getByText('Continue to next step')).toBeVisible();
  },
};

export const NewTab: Story = {
  render: () =>
    html`<wk-link href="https://example.com" target="_blank" rel="author"
      >External example</wk-link
    >`,
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('wk-link')!;
    await host.updateComplete;
    const rel = host.shadowRoot!.querySelector('a')!.getAttribute('rel')!.split(' ');
    await expect(rel).toEqual(expect.arrayContaining(['author', 'noopener', 'noreferrer']));
  },
};

export const NoHref: Story = {
  render: () =>
    html`<p>
      Plain <wk-link>text without href</wk-link> and
      <wk-link href="javascript:alert(1)">unsafe</wk-link>.
    </p>`,
  play: async ({ canvasElement }) => {
    for (const host of canvasElement.querySelectorAll('wk-link')) {
      await host.updateComplete;
      await expect(host.shadowRoot!.querySelector('a')).toBeNull();
    }
  },
};

export const LongWrapped: Story = {
  render: () =>
    html`<div style="width:min(220px, 100%)">
      <p>
        Review <wk-link href="#long">a-very-long-reference-with-no-breaks-1234567890</wk-link>
        before continuing.
      </p>
      <wk-link variant="standalone" href="#next">Continue to a longer named destination</wk-link>
    </div>`,
  play: async ({ canvasElement }) => {
    const frame = canvasElement.querySelector('div')!;
    for (const link of frame.querySelectorAll('wk-link')) await link.updateComplete;
    await expect(frame.scrollWidth).toBeLessThanOrEqual(frame.clientWidth + 1);
  },
};

export const Themes: Story = {
  render: () =>
    html`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px"
    >
      ${(['neutral', 'studio', 'fieldwork'] as const).flatMap((theme) =>
        (['light', 'dark'] as const).map(
          (mode) =>
            html`<div
              data-wk-theme=${theme}
              data-wk-mode=${mode}
              style="padding:12px;color:var(--wk-text);background:var(--wk-surface)"
            >
              <p>${theme} ${mode}: <wk-link href="#example">Inline link</wk-link></p>
              <wk-link variant="standalone" href="#next">Standalone link</wk-link>
            </div>`,
        ),
      )}
      <div
        data-wk-wireframe="true"
        style="padding:12px;color:var(--wk-text);background:var(--wk-surface)"
      >
        <wk-link href="#wireframe">Wireframe link</wk-link>
      </div>
    </div>`,
};
