import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent, within } from 'storybook/test';
import { html } from 'lit';

const meta = {
  title: 'Components/Dialog',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
\`wk-dialog\` is a provisional modal built on Lion 0.25's public dialog API. Its content root needs a title via \`aria-label\` or \`aria-labelledby\`; \`aria-describedby\` references IDs inside that root. The modal traps focus, makes background content unavailable, locks page scrolling, closes on Escape and does not close from its backdrop.
`,
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const closeReview = (event: Event): void => {
  if (
    !event
      .composedPath()
      .some((node) => node instanceof HTMLElement && node.hasAttribute('data-review-close'))
  )
    return;
  const origin = event.currentTarget as HTMLElement;
  void origin.querySelector('wk-dialog')!.close();
};

const reviewStyles = `
  .review-page { box-sizing:border-box; width:min(100%, 960px); min-height:calc(100vh - 48px); margin:0 auto; padding:24px; color:var(--wk-text); background:var(--wk-surface); font-family:var(--wk-font); }
  .review-header { display:flex; align-items:center; justify-content:space-between; gap:16px; }
  .review-page h1, .review-page h2 { overflow-wrap:anywhere; }
  .review-page h1 { margin:4px 0 0; font-size:clamp(1.5rem, 3vw, 2rem); line-height:1.2; }
  .review-header p { margin:0; font-size:12px; font-weight:700; letter-spacing:.08em; }
  .review-summary { max-width:65ch; line-height:1.55; }
  .review-actions { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:8px; margin-block-start:24px; }
  .review-actions > * { min-width:8.5rem; }
  @media(max-width:600px) {
    .review-page { padding:20px; }
    .review-header { align-items:flex-start; flex-direction:column; }
    [data-wk-dialog-content] .review-actions { flex-direction:column; }
    [data-wk-dialog-content] .review-actions > * { width:100%; }
    .review-page wk-card .review-actions > * { flex:1 1 8rem; }
  }
`;

const sheetContextStyles = `
  .sheet-context { margin:0 0 24px; padding:8px 12px; color:var(--wk-text); background:var(--wk-surface); font-size:12px; font-weight:700; letter-spacing:.08em; }
  @media(max-width:600px) { .sheet-context { position:fixed; inset:0 0 auto; z-index:1; height:40px; box-sizing:border-box; margin:0; } }
`;

const waitForClosedContent = async (dialog: HTMLElement, content: HTMLElement): Promise<void> => {
  const deadline = Date.now() + 1500;
  while (dialog.hasAttribute('opened') || content.hasAttribute('data-wk-dialog-content')) {
    if (Date.now() >= deadline) {
      throw new Error('Dialog did not finish closing.');
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
};

export const ReviewDialog: Story = {
  name: 'Review Dialog / Combined Slice',
  render: () => html`
    <style>
      ${reviewStyles}
    </style>
    <main class="review-page" data-wk-theme="fieldwork" data-review-origin @click=${closeReview}>
      <header class="review-header">
        <div>
          <p>WAKATA WORKSPACE</p>
          <h1>Workspace settings</h1>
        </div>
        <wk-mode-switch></wk-mode-switch>
      </header>
      <p class="review-summary">
        Review a synthetic settings update in the context of the current Wakata component slice.
      </p>
      <wk-card>
        <h2 slot="heading">Workspace profile</h2>
        <p>Northwind Studio · Coastal region</p>
        <div slot="actions" class="review-actions">
          <wk-button variant="secondary">Edit profile</wk-button>
          <wk-button variant="primary">Save settings</wk-button>
        </div>
      </wk-card>
      <wk-dialog>
        <wk-button slot="invoker">Review changes</wk-button>
        <section
          slot="content"
          aria-labelledby="review-dialog-title"
          aria-describedby="review-dialog-description"
        >
          <h2 id="review-dialog-title">Review workspace changes</h2>
          <p id="review-dialog-description">
            These example changes affect only a synthetic workspace.
          </p>
          <div class="review-actions">
            <wk-button data-review-close>Cancel</wk-button>
            <wk-button variant="primary" data-review-close>Confirm changes</wk-button>
          </div>
        </section>
      </wk-dialog>
    </main>
  `,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = canvasElement.querySelector('wk-dialog')!;
    const content = canvasElement.querySelector<HTMLElement>('[slot="content"]')!;
    await expect(canvas.getByText('Review changes')).toBeVisible();
    await dialog.open();
    await expect(dialog.opened).toBe(true);
    await expect(content.getAttribute('role')).toBe('dialog');
    await expect(content.getAttribute('aria-modal')).toBe('true');
    await expect(content.getAttribute('aria-labelledby')).toBe('review-dialog-title');
    await expect(content.getAttribute('aria-describedby')).toBe('review-dialog-description');
    await expect(content.contains(document.activeElement)).toBe(true);
    await expect(document.body.classList.contains('overlays-scroll-lock')).toBe(true);
    await userEvent.tab();
    await expect(content.contains(document.activeElement)).toBe(true);

    const root = canvasElement.querySelector<HTMLElement>('[data-review-origin]')!;
    root.dataset.wkMode = 'dark';
    root.dataset.wkWireframe = 'true';
    root.dataset.wkTheme = 'fieldwork';
    root.style.setProperty('--wk-font', 'monospace');
    await new Promise((resolve) => setTimeout(resolve, 0));
    await expect(content.dataset.wkMode).toBe('dark');
    await expect(content.dataset.wkTheme).toBe('fieldwork');
    await expect(content.dataset.wkWireframe).toBe('true');
    await expect(getComputedStyle(content).fontFamily).toContain('monospace');
    await expect(getComputedStyle(content).borderRadius).toBe('0px');

    const backdrop = dialog.shadowRoot?.querySelector<HTMLElement>('.overlays__backdrop');
    if (backdrop) await userEvent.click(backdrop);
    await expect(dialog.opened).toBe(true);
    content.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Escape', bubbles: true, composed: true }),
    );
    await waitForClosedContent(dialog, content);
    await expect(dialog.opened).toBe(false);
    await expect(content.hasAttribute('data-wk-dialog-content')).toBe(false);
    root.dataset.wkTheme = 'fieldwork';
    root.dataset.wkWireframe = 'false';
    root.style.removeProperty('--wk-font');
    for (const label of ['Cancel', 'Confirm changes']) {
      await dialog.open();
      await userEvent.click(within(content).getByText(label));
      await waitForClosedContent(dialog, content);
      await expect(dialog.opened).toBe(false);
    }
    dialog.dataset.reviewPlayComplete = 'true';
  },
};

export const MobileSheetShort: Story = {
  name: 'Mobile Sheet / Short Content',
  parameters: {
    // Lion's native outer <dialog role="none"> triggers axe while open; #14 tracks manual AT review.
    a11y: { test: 'todo' },
  },
  render: () => html`
    <style>
      ${reviewStyles}
      ${sheetContextStyles}
    </style>
    <main class="review-page" data-wk-theme="fieldwork" @click=${closeReview}>
      <header class="sheet-context">WAKATA WORKSPACE</header>
      <h1>Workspace request</h1>
      <p>A synthetic request is ready to review.</p>
      <wk-dialog>
        <wk-button slot="invoker">Open short review</wk-button>
        <section
          slot="content"
          aria-labelledby="sheet-short-title"
          aria-describedby="sheet-short-body"
        >
          <h2 id="sheet-short-title">Review request</h2>
          <p id="sheet-short-body">Confirm this synthetic workspace change. Nothing is sent.</p>
          <div class="review-actions">
            <wk-button data-review-close>Cancel</wk-button>
            <wk-button variant="primary" data-review-close>Confirm</wk-button>
          </div>
        </section>
      </wk-dialog>
    </main>
  `,
  play: async ({ canvasElement }) => {
    const dialog = canvasElement.querySelector('wk-dialog')!;
    await dialog.open();
    await expect(dialog.opened).toBe(true);
    dialog.dataset.sheetPlayComplete = 'true';
  },
};

export const LongContentAndNarrowReflow: Story = {
  name: 'Mobile Sheet / Long Content',
  parameters: {
    // Keep the sheet open for visual review; the upstream outer-dialog role remains an AT gate item.
    a11y: { test: 'todo' },
  },
  render: () => html`
    <style>
      ${reviewStyles}
      ${sheetContextStyles}
    </style>
    <main class="review-page" data-wk-theme="fieldwork" @click=${closeReview}>
      <header class="sheet-context">WAKATA WORKSPACE</header>
      <h1>Workspace request</h1>
      <p>A synthetic request with a longer review is ready.</p>
      <wk-dialog>
        <wk-button slot="invoker">Open long review</wk-button>
        <section slot="content" aria-labelledby="long-title" aria-describedby="long-body">
          <h2 id="long-title">Review extended request</h2>
          <div id="long-body">
            <p>This synthetic request has several review notes. Nothing is sent.</p>
            ${Array.from(
              { length: 12 },
              (_, index) =>
                html`<p>Review note ${index + 1}: check the proposed workspace details.</p>`,
            )}
          </div>
          <div class="review-actions">
            <wk-button data-review-close>Cancel</wk-button>
            <wk-button variant="primary" data-review-close>Confirm</wk-button>
          </div>
        </section>
      </wk-dialog>
    </main>
  `,
  play: async ({ canvasElement }) => {
    const dialog = canvasElement.querySelector('wk-dialog')!;
    const content = canvasElement.querySelector<HTMLElement>('[slot="content"]')!;
    await dialog.open();
    await expect(content.scrollWidth).toBeLessThanOrEqual(content.clientWidth);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(
      document.documentElement.clientWidth,
    );
    await expect(getComputedStyle(content).padding).toBe('24px');
    dialog.dataset.longPlayComplete = 'true';
  },
};
