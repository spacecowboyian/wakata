import{b as u}from"./iframe-DudFES9K.js";import"./preload-helper-PPVm8Dsz.js";const{expect:e,userEvent:c,within:w}=__STORYBOOK_MODULE_TEST__,h={title:"Components/Dialog",tags:["autodocs"],parameters:{docs:{description:{component:"\n`wk-dialog` is a provisional modal built on Lion 0.25's public dialog API. Its content root needs a title via `aria-label` or `aria-labelledby`; `aria-describedby` references IDs inside that root. The modal traps focus, makes background content unavailable, locks page scrolling, closes on Escape and does not close from its backdrop.\n"}}}},g=n=>{if(!n.composedPath().some(t=>t instanceof HTMLElement&&t.hasAttribute("data-review-close")))return;n.currentTarget.querySelector("wk-dialog").close()},m=`
  .review-page { box-sizing:border-box; width:min(100%, 960px); margin:0 auto; padding:24px; color:var(--wk-text); background:var(--wk-surface); }
  .review-header { display:flex; align-items:center; justify-content:space-between; gap:16px; }
  .review-page h1, .review-page h2 { overflow-wrap:anywhere; }
  .review-summary { max-width:65ch; line-height:1.55; }
  .review-actions { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:12px; margin-block-start:20px; }
  .review-actions > * { min-width:8rem; }
  @media(max-width:600px) {
    .review-header { align-items:flex-start; flex-direction:column; }
    .review-actions { justify-content:stretch; }
    .review-actions > * { flex:1 1 8rem; }
  }
`,p=async(n,o)=>{const t=Date.now()+1500;for(;n.hasAttribute("opened")||o.hasAttribute("data-wk-dialog-content");){if(Date.now()>=t)throw new Error("Dialog did not finish closing.");await new Promise(a=>setTimeout(a,20))}},r={name:"Review Dialog / Combined Slice",render:()=>u`
    <style>
      ${m}
    </style>
    <main
      class="review-page"
      data-wk-theme="studio"
      data-review-origin
      @click=${g}
      style="--wk-font: Georgia, serif; background:var(--wk-surface);color:var(--wk-text)"
    >
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
      <div
        data-wk-theme="fieldwork"
        data-wk-mode="dark"
        data-nested-theme
        style="padding:12px;background:var(--wk-surface);color:var(--wk-text)"
      >
        <p>Nested Fieldwork preview remains independent of the dialog origin.</p>
      </div>
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
  `,play:async({canvasElement:n})=>{const o=w(n),t=n.querySelector("wk-dialog"),a=n.querySelector('[slot="content"]');await e(o.getByText("Review changes")).toBeVisible(),await t.open(),await e(t.opened).toBe(!0),await e(a.getAttribute("role")).toBe("dialog"),await e(a.getAttribute("aria-modal")).toBe("true"),await e(a.getAttribute("aria-labelledby")).toBe("review-dialog-title"),await e(a.getAttribute("aria-describedby")).toBe("review-dialog-description"),await e(a.contains(document.activeElement)).toBe(!0),await e(document.body.classList.contains("overlays-scroll-lock")).toBe(!0),await c.tab(),await e(a.contains(document.activeElement)).toBe(!0);const i=n.querySelector("[data-review-origin]");i.dataset.wkMode="dark",i.dataset.wkWireframe="true",i.dataset.wkTheme="fieldwork",i.style.setProperty("--wk-font","monospace"),await new Promise(l=>setTimeout(l,0)),await e(a.dataset.wkMode).toBe("dark"),await e(a.dataset.wkTheme).toBe("fieldwork"),await e(a.dataset.wkWireframe).toBe("true"),await e(getComputedStyle(a).fontFamily).toContain("monospace"),await e(getComputedStyle(a).borderRadius).toBe("0px");const d=t.shadowRoot?.querySelector(".overlays__backdrop");d&&await c.click(d),await e(t.opened).toBe(!0),a.dispatchEvent(new KeyboardEvent("keyup",{key:"Escape",bubbles:!0,composed:!0})),await p(t,a),await e(t.opened).toBe(!1),await e(a.hasAttribute("data-wk-dialog-content")).toBe(!1),i.dataset.wkTheme="studio",i.dataset.wkWireframe="false",i.style.removeProperty("--wk-font");for(const l of["Cancel","Confirm changes"])await t.open(),await c.click(w(a).getByText(l)),await p(t,a),await e(t.opened).toBe(!1);t.dataset.reviewPlayComplete="true"}},s={render:()=>u`
    <main style="width:min(100%, 960px);margin-inline:auto">
      <wk-dialog>
        <button slot="invoker">Open long review</button>
        <section slot="content" aria-labelledby="long-title">
          <h2 id="long-title">
            Review for the cross-regional planning group and its extended collaboration schedule
          </h2>
          <p>
            This synthetic, intentionally long review description verifies viewport-constrained
            scrolling without page overflow or changes to the modal geometry.
          </p>
          <wk-button slot="actions" variant="primary">Confirm extended review</wk-button>
        </section>
      </wk-dialog>
    </main>
  `,play:async({canvasElement:n})=>{const o=n.querySelector("wk-dialog"),t=n.querySelector('[slot="content"]');await o.open(),await e(t.scrollWidth).toBeLessThanOrEqual(t.clientWidth),await e(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth),await e(getComputedStyle(t).padding).toBe("24px"),await o.close()}},b=["ReviewDialog","LongContentAndNarrowReflow"];r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'Review Dialog / Combined Slice',
  render: () => html\`
    <style>
      \${reviewStyles}
    </style>
    <main
      class="review-page"
      data-wk-theme="studio"
      data-review-origin
      @click=\${closeReview}
      style="--wk-font: Georgia, serif; background:var(--wk-surface);color:var(--wk-text)"
    >
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
      <div
        data-wk-theme="fieldwork"
        data-wk-mode="dark"
        data-nested-theme
        style="padding:12px;background:var(--wk-surface);color:var(--wk-text)"
      >
        <p>Nested Fieldwork preview remains independent of the dialog origin.</p>
      </div>
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
  \`,
  play: async ({
    canvasElement
  }) => {
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
    await new Promise(resolve => setTimeout(resolve, 0));
    await expect(content.dataset.wkMode).toBe('dark');
    await expect(content.dataset.wkTheme).toBe('fieldwork');
    await expect(content.dataset.wkWireframe).toBe('true');
    await expect(getComputedStyle(content).fontFamily).toContain('monospace');
    await expect(getComputedStyle(content).borderRadius).toBe('0px');
    const backdrop = dialog.shadowRoot?.querySelector<HTMLElement>('.overlays__backdrop');
    if (backdrop) await userEvent.click(backdrop);
    await expect(dialog.opened).toBe(true);
    content.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'Escape',
      bubbles: true,
      composed: true
    }));
    await waitForClosedContent(dialog, content);
    await expect(dialog.opened).toBe(false);
    await expect(content.hasAttribute('data-wk-dialog-content')).toBe(false);
    root.dataset.wkTheme = 'studio';
    root.dataset.wkWireframe = 'false';
    root.style.removeProperty('--wk-font');
    for (const label of ['Cancel', 'Confirm changes']) {
      await dialog.open();
      await userEvent.click(within(content).getByText(label));
      await waitForClosedContent(dialog, content);
      await expect(dialog.opened).toBe(false);
    }
    dialog.dataset.reviewPlayComplete = 'true';
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <main style="width:min(100%, 960px);margin-inline:auto">
      <wk-dialog>
        <button slot="invoker">Open long review</button>
        <section slot="content" aria-labelledby="long-title">
          <h2 id="long-title">
            Review for the cross-regional planning group and its extended collaboration schedule
          </h2>
          <p>
            This synthetic, intentionally long review description verifies viewport-constrained
            scrolling without page overflow or changes to the modal geometry.
          </p>
          <wk-button slot="actions" variant="primary">Confirm extended review</wk-button>
        </section>
      </wk-dialog>
    </main>
  \`,
  play: async ({
    canvasElement
  }) => {
    const dialog = canvasElement.querySelector('wk-dialog')!;
    const content = canvasElement.querySelector<HTMLElement>('[slot="content"]')!;
    await dialog.open();
    await expect(content.scrollWidth).toBeLessThanOrEqual(content.clientWidth);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
    await expect(getComputedStyle(content).padding).toBe('24px');
    await dialog.close();
  }
}`,...s.parameters?.docs?.source}}};export{s as LongContentAndNarrowReflow,r as ReviewDialog,b as __namedExportsOrder,h as default};
