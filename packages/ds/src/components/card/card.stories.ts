import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent, within } from 'storybook/test';
import { html } from 'lit';

const meta = {
  title: 'Components/Card',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`wk-card\` is a non-interactive Lit container, not a Lion component. Consumers provide a native heading in \`slot="heading"\`, body content in the default slot and, optionally, a grouped action area in \`slot="actions"\`. Body-only cards are valid. The container adds no role, accessible name, tab stop, click behavior or navigation.

The surface is flat: \`--wk-surface\`, \`--wk-text\`, a 1px \`--wk-border\`, \`--wk-radius\`, 16px internal padding and 12px between occupied sections. Width and outer layout belong to the host page. No card-specific styling properties are provided.
`,
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const BodyOnly: Story = {
  render: () => html`<wk-card><p>A card can contain body content without a heading.</p></wk-card>`,
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('wk-card')!;
    await card.updateComplete;
    await expect(
      within(canvasElement).getByText('A card can contain body content without a heading.'),
    ).toBeVisible();
    await expect(card).not.toHaveAttribute('role');
    await expect(card).not.toHaveAttribute('tabindex');
    await expect(card.shadowRoot!.querySelectorAll('.section:not([hidden])')).toHaveLength(1);
  },
};

export const HeadingAndBody: Story = {
  render: () => html`
    <wk-card>
      <h2 slot="heading">Account overview</h2>
      <p>Review the synthetic account details below.</p>
    </wk-card>
  `,
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('wk-card')!;
    await card.updateComplete;
    await expect(
      within(canvasElement).getByRole('heading', { name: 'Account overview', level: 2 }),
    ).toBeVisible();
    await expect(card.shadowRoot!.querySelectorAll('.section:not([hidden])')).toHaveLength(2);
  },
};

export const Actions: Story = {
  render: () => html`
    <wk-card>
      <h2 slot="heading">Unsaved preferences</h2>
      <p>Changes are kept only after you save.</p>
      <div slot="actions" class="action-row">
        <wk-button-reset>Discard</wk-button-reset>
        <wk-button-submit variant="primary">Save changes</wk-button-submit>
      </div>
    </wk-card>
  `,
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('wk-card')!;
    await card.updateComplete;
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Save changes')).toBeVisible();
    await expect(canvas.getByText('Discard')).toBeVisible();
    await expect(card.shadowRoot!.querySelectorAll('.section:not([hidden])')).toHaveLength(3);
    await userEvent.tab();
    await expect(canvas.getByText('Discard').closest('wk-button-reset')).toHaveFocus();
  },
};

const wordmark = html`
  <img
    class="logo"
    alt="Wakata logo"
    width="40"
    height="40"
    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='8' fill='%232d5064'/%3E%3Cpath d='M9 10h6l5 14 5-14h6l-8 21h-6z' fill='white'/%3E%3C/svg%3E"
  />
`;

const compositionStyles = `
  .settings-page { box-sizing:border-box; width:min(100%, 960px); margin:0 auto; color:var(--wk-text); }
  .page-header { display:flex; align-items:center; justify-content:space-between; gap:20px; margin-block-end:28px; }
  .brand { display:flex; min-width:0; align-items:center; gap:12px; }
  .brand img { display:block; flex:none; filter:grayscale(1); }
  .brand-title { margin:0; font-size:14px; font-weight:700; letter-spacing:.04em; }
  .page-title { margin:0 0 8px; overflow-wrap:anywhere; }
  .intro { max-width:65ch; margin:0 0 24px; line-height:1.55; }
  .card-form { margin:0; }
  .card-body { display:grid; gap:20px; min-width:0; }
  .card-description { margin:0; line-height:1.5; }
  .fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
  .actions { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:12px; }
  .placeholder { display:flex; align-items:center; gap:12px; min-width:0; padding:12px; border:1px dashed var(--wk-border); border-radius:var(--wk-radius); }
  .placeholder-art { box-sizing:border-box; width:64px; height:48px; flex:none; border:1px solid var(--wk-border); background:linear-gradient(135deg, transparent 49%, var(--wk-border) 50%, transparent 51%); }
  .placeholder-copy { min-width:0; overflow-wrap:anywhere; }
  .current-slice { display:grid; gap:12px; }
  .current-slice .logo { display:inline-block; }
  @media(max-width:600px) {
    .settings-page { padding:0; }
    .page-header { align-items:flex-start; flex-direction:column; gap:12px; margin-block-end:24px; }
    .fields { grid-template-columns:minmax(0,1fr); gap:12px; }
    .actions { justify-content:stretch; }
    .actions > * { flex:1 1 8rem; }
  }
`;

export const CompositionCurrentSlice: Story = {
  name: 'Composition / Current Slice',
  render: () => html`
    <style>
      ${compositionStyles}
    </style>
    <main class="settings-page">
      <header class="page-header">
        <div class="brand">
          ${wordmark}
          <p class="brand-title">WAKATA WORKSPACE</p>
        </div>
        <wk-mode-switch></wk-mode-switch>
      </header>
      <h1 class="page-title">Workspace settings</h1>
      <p class="intro">
        Keep the details that help your team coordinate in one place. This synthetic settings page
        uses the actual Wakata Card, form fields, select and form buttons together.
      </p>
      <wk-form>
        <form class="card-form" @submit=${(event: SubmitEvent) => event.preventDefault()}>
          <wk-card>
            <h2 slot="heading">Workspace profile</h2>
            <div class="card-body">
              <p class="card-description">
                Update the contact details and region for this workspace.
              </p>
              <div class="fields">
                <wk-text-field
                  name="workspace"
                  label="Workspace name"
                  value="Northwind Studio"
                  required
                ></wk-text-field>
                <wk-text-field
                  name="email"
                  label="Contact email"
                  type="email"
                  value="team@example.test"
                  required
                ></wk-text-field>
                <wk-select name="region" label="Default region" required>
                  <select slot="input">
                    <option value="">Choose a region</option>
                    <option value="north">Northern region</option>
                    <option value="coast">Coastal region</option>
                  </select>
                </wk-select>
                <div class="placeholder" aria-label="Workspace identity preview">
                  <div class="placeholder-art" aria-hidden="true"></div>
                  <div class="placeholder-copy">
                    <strong>Identity preview</strong><br />
                    <span>Placeholder only; no image upload is available.</span>
                  </div>
                </div>
              </div>
            </div>
            <div slot="actions" class="actions">
              <wk-button-reset>Reset</wk-button-reset>
              <wk-button-submit variant="primary">Save settings</wk-button-submit>
            </div>
          </wk-card>
        </form>
      </wk-form>
    </main>
  `,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvasElement.querySelector('wk-card')!;
    await card.updateComplete;
    await expect(
      canvas.getByRole('heading', { name: 'Workspace profile', level: 2 }),
    ).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Workspace name' })).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Contact email' })).toBeVisible();
    await expect(canvas.getByRole('combobox', { name: 'Default region' })).toBeVisible();
    await expect(canvas.getByText('Save settings')).toBeVisible();
    const modeSwitch = canvasElement.querySelector('wk-mode-switch')!;
    await modeSwitch.updateComplete;
    await expect(modeSwitch.shadowRoot!.querySelector('fieldset legend')?.textContent?.trim()).toBe(
      'Colour mode',
    );
    await expect(modeSwitch.shadowRoot!.querySelectorAll('input[type="radio"]')).toHaveLength(3);

    const cardRect = card.getBoundingClientRect();
    const image = canvasElement.querySelector<HTMLImageElement>('.brand img')!;
    await expect(image.alt).toBe('Wakata logo');
    await expect(getComputedStyle(image).filter).toContain('grayscale');
    await expect(image.getBoundingClientRect().width).toBe(40);
    await expect(image.getBoundingClientRect().height).toBe(40);
    await expect(cardRect.width).toBeGreaterThan(0);
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
    await expect(card.shadowRoot!.querySelectorAll('.section:not([hidden])')).toHaveLength(3);
  },
};

export const LongContentAndNarrowReflow: Story = {
  render: () => html`
    <div style="width:min(100%, 960px);margin-inline:auto">
      <wk-card>
        <h2 slot="heading">
          Workspace profile for the cross-regional planning group and its extended collaboration
          schedule
        </h2>
        <p>
          This deliberately long synthetic content checks that a heading and body can wrap naturally
          without forcing horizontal scrolling or changing the card's fixed internal geometry.
        </p>
        <div slot="actions" style="display:flex;flex-wrap:wrap;gap:12px">
          <wk-button>Review regional preferences</wk-button>
          <wk-button variant="primary">Save workspace details</wk-button>
        </div>
      </wk-card>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('wk-card')!;
    await card.updateComplete;
    await expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
    await expect(getComputedStyle(card).padding).toBe('16px');
  },
};

export const ThemesModesAndWireframe: Story = {
  render: () => html`
    <div class="card-theme-grid">
      <style>
        .card-theme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
          gap: 16px;
        }
        .card-theme-grid [data-cell] {
          min-width: 0;
          padding: 12px;
          color: var(--wk-text);
          background: var(--wk-surface);
        }
      </style>
      ${(['neutral', 'studio', 'fieldwork'] as const).flatMap((theme) =>
        (['light', 'dark'] as const).flatMap((mode) =>
          ['false', 'true'].map(
            (wireframe) => html`
              <div
                data-wk-theme=${theme}
                data-wk-mode=${mode}
                data-wk-wireframe=${wireframe}
                data-cell="${theme}-${mode}-${wireframe}"
              >
                <wk-card>
                  <h3 slot="heading">
                    ${theme} ${mode}${wireframe === 'true' ? ' wireframe' : ''}
                  </h3>
                  <p>Theme-scoped, synthetic Card content.</p>
                </wk-card>
              </div>
            `,
          ),
        ),
      )}
      <div data-wk-theme="neutral" data-wk-mode="light" data-cell="nested">
        <wk-card>
          <h3 slot="heading">Neutral outer card</h3>
          <div data-wk-theme="studio" data-wk-mode="dark" style="padding:12px">
            <wk-card>
              <h4 slot="heading">Nested Studio card</h4>
              <p>Adjacent theme roots stay isolated.</p>
            </wk-card>
          </div>
        </wk-card>
      </div>
    </div>
  `,
  play: async ({ canvasElement }) => {
    const cells = [...canvasElement.querySelectorAll<HTMLElement>('[data-cell]')];
    const cards = cells.map((cell) => cell.querySelector('wk-card')!);
    await Promise.all(cards.map((card) => card.updateComplete));
    for (const theme of ['neutral', 'studio', 'fieldwork']) {
      const light = cells
        .find((cell) => cell.dataset.cell === `${theme}-light-false`)!
        .querySelector('wk-card')!;
      const dark = cells
        .find((cell) => cell.dataset.cell === `${theme}-dark-false`)!
        .querySelector('wk-card')!;
      await expect(getComputedStyle(light).backgroundColor).not.toBe(
        getComputedStyle(dark).backgroundColor,
      );
      const plain = cells
        .find((cell) => cell.dataset.cell === `${theme}-light-false`)!
        .querySelector('wk-card')!;
      const wire = cells
        .find((cell) => cell.dataset.cell === `${theme}-light-true`)!
        .querySelector('wk-card')!;
      await expect(getComputedStyle(wire).borderRadius).toBe('0px');
      await expect(getComputedStyle(wire).padding).toBe(getComputedStyle(plain).padding);
    }
    const [outer, nested] = cells
      .find((cell) => cell.dataset.cell === 'nested')!
      .querySelectorAll('wk-card');
    await expect(getComputedStyle(outer!).fontFamily).not.toBe(
      getComputedStyle(nested!).fontFamily,
    );
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
