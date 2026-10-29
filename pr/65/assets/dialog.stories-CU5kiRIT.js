import{b as c}from"./iframe-CIX4NnH9.js";import"./preload-helper-PPVm8Dsz.js";const{expect:e,userEvent:w,within:u}=__STORYBOOK_MODULE_TEST__,b={title:"Components/Dialog",tags:["autodocs"],parameters:{docs:{description:{component:"\n`wk-dialog` is a provisional modal built on Lion 0.25's public dialog API. Its content root needs a title via `aria-label` or `aria-labelledby`; `aria-describedby` references IDs inside that root. The modal traps focus, makes background content unavailable, locks page scrolling, closes on Escape and does not close from its desktop backdrop. At phone width (max 600px), tapping the exposed dimmed strip above the sheet also closes it without activating background content; taps inside the sheet do not. Manual accessibility and real-device touch testing are tracked in #59.\n"}}}},p=n=>{if(!n.composedPath().some(t=>t instanceof HTMLElement&&t.hasAttribute("data-review-close")))return;n.currentTarget.querySelector("wk-dialog").close()},h=`
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
`,v=`
  .sheet-context { margin:0 0 24px; padding:8px 12px; color:var(--wk-text); background:var(--wk-surface); font-size:12px; font-weight:700; letter-spacing:.08em; }
  @media(max-width:600px) { .sheet-context { position:fixed; inset:0 0 auto; z-index:1; height:40px; box-sizing:border-box; margin:0; } }
`,g=async(n,o)=>{const t=Date.now()+1500;for(;n.hasAttribute("opened")||o.hasAttribute("data-wk-dialog-content");){if(Date.now()>=t)throw new Error("Dialog did not finish closing.");await new Promise(a=>setTimeout(a,20))}},r={name:"Review Dialog / Combined Slice",render:()=>c`
    <style>
      ${h}
    </style>
    <main class="review-page" data-wk-theme="fieldwork" data-review-origin @click=${p}>
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
  `,play:async({canvasElement:n})=>{const o=u(n),t=n.querySelector("wk-dialog"),a=n.querySelector('[slot="content"]');await e(o.getByText("Review changes")).toBeVisible(),await t.open(),await e(t.opened).toBe(!0),await e(a.getAttribute("role")).toBe("dialog"),await e(a.getAttribute("aria-modal")).toBe("true"),await e(a.getAttribute("aria-labelledby")).toBe("review-dialog-title"),await e(a.getAttribute("aria-describedby")).toBe("review-dialog-description"),await e(a.contains(document.activeElement)).toBe(!0),await e(document.body.classList.contains("overlays-scroll-lock")).toBe(!0),await w.tab(),await e(a.contains(document.activeElement)).toBe(!0);const i=n.querySelector("[data-review-origin]");i.dataset.wkMode="dark",i.dataset.wkWireframe="true",i.dataset.wkTheme="fieldwork",i.style.setProperty("--wk-font","monospace"),await new Promise(d=>setTimeout(d,0)),await e(a.dataset.wkMode).toBe("dark"),await e(a.dataset.wkTheme).toBe("fieldwork"),await e(a.dataset.wkWireframe).toBe("true"),await e(getComputedStyle(a).fontFamily).toContain("monospace"),await e(getComputedStyle(a).borderRadius).toBe("0px");const m=t.shadowRoot?.querySelector(".overlays__backdrop");m&&!matchMedia("(max-width: 600px)").matches&&(await w.click(m),await e(t.opened).toBe(!0)),a.dispatchEvent(new KeyboardEvent("keyup",{key:"Escape",bubbles:!0,composed:!0})),await g(t,a),await e(t.opened).toBe(!1),await e(a.hasAttribute("data-wk-dialog-content")).toBe(!1),i.dataset.wkTheme="fieldwork",i.dataset.wkWireframe="false",i.style.removeProperty("--wk-font");for(const d of["Cancel","Confirm changes"])await t.open(),await w.click(u(a).getByText(d)),await g(t,a),await e(t.opened).toBe(!1);t.dataset.reviewPlayComplete="true"}},s={name:"Mobile Sheet / Short Content",parameters:{a11y:{test:"todo"}},render:()=>c`
    <style>
      ${h}
      ${v}
    </style>
    <main class="review-page" data-wk-theme="fieldwork" @click=${p}>
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
  `,play:async({canvasElement:n})=>{const o=n.querySelector("wk-dialog");await o.open(),await e(o.opened).toBe(!0),o.dataset.sheetPlayComplete="true"}},l={name:"Mobile Sheet / Long Content",parameters:{a11y:{test:"todo"}},render:()=>c`
    <style>
      ${h}
      ${v}
    </style>
    <main class="review-page" data-wk-theme="fieldwork" @click=${p}>
      <header class="sheet-context">WAKATA WORKSPACE</header>
      <h1>Workspace request</h1>
      <p>A synthetic request with a longer review is ready.</p>
      <wk-dialog>
        <wk-button slot="invoker">Open long review</wk-button>
        <section slot="content" aria-labelledby="long-title" aria-describedby="long-body">
          <h2 id="long-title">Review extended request</h2>
          <div id="long-body">
            <p>This synthetic request has several review notes. Nothing is sent.</p>
            ${Array.from({length:12},(n,o)=>c`<p>Review note ${o+1}: check the proposed workspace details.</p>`)}
          </div>
          <div class="review-actions">
            <wk-button data-review-close>Cancel</wk-button>
            <wk-button variant="primary" data-review-close>Confirm</wk-button>
          </div>
        </section>
      </wk-dialog>
    </main>
  `,play:async({canvasElement:n})=>{const o=n.querySelector("wk-dialog"),t=n.querySelector('[slot="content"]');await o.open(),await e(t.scrollWidth).toBeLessThanOrEqual(t.clientWidth),await e(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth),await e(getComputedStyle(t).padding).toBe(window.matchMedia("(max-width: 600px)").matches?"0px":"24px"),o.dataset.longPlayComplete="true"}},x=["ReviewDialog","MobileSheetShort","LongContentAndNarrowReflow"];r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'Review Dialog / Combined Slice',
  render: () => html\`
    <style>
      \${reviewStyles}
    </style>
    <main class="review-page" data-wk-theme="fieldwork" data-review-origin @click=\${closeReview}>
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
    if (backdrop && !matchMedia('(max-width: 600px)').matches) {
      await userEvent.click(backdrop);
      await expect(dialog.opened).toBe(true);
    }
    content.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'Escape',
      bubbles: true,
      composed: true
    }));
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
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'Mobile Sheet / Short Content',
  parameters: {
    // Lion's native outer <dialog role="none"> triggers axe while open; #14 tracks manual AT review.
    a11y: {
      test: 'todo'
    }
  },
  render: () => html\`
    <style>
      \${reviewStyles}
      \${sheetContextStyles}
    </style>
    <main class="review-page" data-wk-theme="fieldwork" @click=\${closeReview}>
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
  \`,
  play: async ({
    canvasElement
  }) => {
    const dialog = canvasElement.querySelector('wk-dialog')!;
    await dialog.open();
    await expect(dialog.opened).toBe(true);
    dialog.dataset.sheetPlayComplete = 'true';
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: 'Mobile Sheet / Long Content',
  parameters: {
    // Keep the sheet open for visual review; the upstream outer-dialog role remains an AT gate item.
    a11y: {
      test: 'todo'
    }
  },
  render: () => html\`
    <style>
      \${reviewStyles}
      \${sheetContextStyles}
    </style>
    <main class="review-page" data-wk-theme="fieldwork" @click=\${closeReview}>
      <header class="sheet-context">WAKATA WORKSPACE</header>
      <h1>Workspace request</h1>
      <p>A synthetic request with a longer review is ready.</p>
      <wk-dialog>
        <wk-button slot="invoker">Open long review</wk-button>
        <section slot="content" aria-labelledby="long-title" aria-describedby="long-body">
          <h2 id="long-title">Review extended request</h2>
          <div id="long-body">
            <p>This synthetic request has several review notes. Nothing is sent.</p>
            \${Array.from({
    length: 12
  }, (_, index) => html\`<p>Review note \${index + 1}: check the proposed workspace details.</p>\`)}
          </div>
          <div class="review-actions">
            <wk-button data-review-close>Cancel</wk-button>
            <wk-button variant="primary" data-review-close>Confirm</wk-button>
          </div>
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
    await expect(getComputedStyle(content).padding).toBe(window.matchMedia('(max-width: 600px)').matches ? '0px' : '24px');
    dialog.dataset.longPlayComplete = 'true';
  }
}`,...l.parameters?.docs?.source}}};export{l as LongContentAndNarrowReflow,s as MobileSheetShort,r as ReviewDialog,x as __namedExportsOrder,b as default};
