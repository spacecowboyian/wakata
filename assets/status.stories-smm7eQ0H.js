import{b as e}from"./iframe-DeFYSg41.js";import"./preload-helper-PPVm8Dsz.js";const{expect:s}=__STORYBOOK_MODULE_TEST__,p={title:"Components/Status",tags:["autodocs"],parameters:{docs:{description:{component:'\n`wk-status` is a provisional, non-interactive Lit component. Variants: `informational` (default), `success`, `warning`, `danger`. Text must state the meaning; color is secondary. The optional `icon` slot is decorative (`aria-hidden`); no icon library is shipped. There is no live region by default. Set `live="polite"` (role=status) or `live="assertive"` (role=alert) to opt in; the role sits on a persistent inner element with no `aria-live` attribute, so unchanged content is not re-announced. Uses existing `--wk-accent`, `--wk-positive`, `--wk-danger`, `--wk-text`, `--wk-surface` tokens only; warning has no token and is distinguished by a dashed border plus text. Green is for success/status only; red for danger/error.\n'}}}},r={render:()=>e`<div style="display:grid;gap:8px;justify-items:start">
      <wk-status>Information: draft saved locally</wk-status>
      <wk-status variant="success">Success: changes published</wk-status>
      <wk-status variant="warning">Warning: session expires soon</wk-status>
      <wk-status variant="danger">Error: payment failed</wk-status>
    </div>`,play:async({canvasElement:a})=>{for(const t of a.querySelectorAll("wk-status"))await t.updateComplete,await s(t.shadowRoot.querySelector("[role]")).toBeNull()}},n={render:()=>e`<wk-status variant="success"><span slot="icon">✓</span>Saved</wk-status>
      <wk-status variant="danger"><span slot="icon">✕</span>Failed</wk-status>`,play:async({canvasElement:a})=>{const t=a.querySelector("wk-status");await t.updateComplete,await s(t.shadowRoot.querySelector(".icon")).toHaveAttribute("aria-hidden","true")}},o={render:()=>e`<div style="width:min(220px, 100%)">
      <wk-status variant="warning"
        >Averyveryverylongunbrokenidentifier_that_must_wrap_instead_of_overflowing_the_container and
        more text that wraps across lines.</wk-status
      >
    </div>`,play:async({canvasElement:a})=>{const t=a.querySelector("wk-status");await t.updateComplete,await s(t.scrollWidth).toBeLessThanOrEqual(t.clientWidth+1)}},i={render:()=>e`<wk-status live="polite">Polite update</wk-status>
      <wk-status live="assertive" variant="danger">Assertive error</wk-status>`,play:async({canvasElement:a})=>{const[t,u]=Array.from(a.querySelectorAll("wk-status"));await t.updateComplete,await u.updateComplete,await s(t.shadowRoot.querySelector("[role]")).toHaveAttribute("role","status"),await s(u.shadowRoot.querySelector("[role]")).toHaveAttribute("role","alert")}},d={render:()=>e`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px"
    >
      ${["neutral","studio","fieldwork"].flatMap(a=>["light","dark"].map(t=>e`<div
              data-wk-theme=${a}
              data-wk-mode=${t}
              style="display:grid;gap:8px;padding:12px;color:var(--wk-text);background:var(--wk-surface)"
            >
              <wk-status variant="success">${a} ${t}: saved</wk-status>
              <wk-status variant="danger">${a} ${t}: failed</wk-status>
            </div>`))}
      <div data-wk-wireframe="true" style="padding:12px">
        <wk-status variant="warning">Wireframe: warning</wk-status>
      </div>
      <div data-wk-theme="neutral" data-wk-mode="light" style="padding:12px">
        <wk-status>Neutral outer</wk-status>
        <div data-wk-theme="studio" data-wk-mode="dark" style="padding:8px">
          <wk-status variant="success">Studio nested: saved</wk-status>
        </div>
      </div>
    </div>`},l={render:()=>e`<wk-card>
        <wk-status variant="success">Card: profile saved</wk-status>
        <form><wk-status variant="danger">Form: email is required</wk-status></form>
      </wk-card>
      <wk-dialog>
        <wk-button slot="invoker">Open status example</wk-button>
        <section slot="content" aria-label="Status example">
          <wk-status live="assertive" variant="danger">Dialog: delete failed</wk-status>
        </section>
      </wk-dialog>`},k=["Variants","WithIcons","LongText","LiveOptIn","Themes","InCardFormDialog"];r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="display:grid;gap:8px;justify-items:start">
      <wk-status>Information: draft saved locally</wk-status>
      <wk-status variant="success">Success: changes published</wk-status>
      <wk-status variant="warning">Warning: session expires soon</wk-status>
      <wk-status variant="danger">Error: payment failed</wk-status>
    </div>\`,
  play: async ({
    canvasElement
  }) => {
    for (const el of canvasElement.querySelectorAll('wk-status')) {
      await el.updateComplete;
      await expect(el.shadowRoot!.querySelector('[role]')).toBeNull();
    }
  }
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-status variant="success"><span slot="icon">✓</span>Saved</wk-status>
      <wk-status variant="danger"><span slot="icon">✕</span>Failed</wk-status>\`,
  play: async ({
    canvasElement
  }) => {
    const el = canvasElement.querySelector('wk-status')!;
    await el.updateComplete;
    await expect(el.shadowRoot!.querySelector('.icon')).toHaveAttribute('aria-hidden', 'true');
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="width:min(220px, 100%)">
      <wk-status variant="warning"
        >Averyveryverylongunbrokenidentifier_that_must_wrap_instead_of_overflowing_the_container and
        more text that wraps across lines.</wk-status
      >
    </div>\`,
  play: async ({
    canvasElement
  }) => {
    const el = canvasElement.querySelector('wk-status')!;
    await el.updateComplete;
    await expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth + 1);
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-status live="polite">Polite update</wk-status>
      <wk-status live="assertive" variant="danger">Assertive error</wk-status>\`,
  play: async ({
    canvasElement
  }) => {
    const [a, b] = Array.from(canvasElement.querySelectorAll('wk-status')) as [HTMLElementTagNameMap['wk-status'], HTMLElementTagNameMap['wk-status']];
    await a.updateComplete;
    await b.updateComplete;
    await expect(a.shadowRoot!.querySelector('[role]')).toHaveAttribute('role', 'status');
    await expect(b.shadowRoot!.querySelector('[role]')).toHaveAttribute('role', 'alert');
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px"
    >
      \${(['neutral', 'studio', 'fieldwork'] as const).flatMap(theme => (['light', 'dark'] as const).map(mode => html\`<div
              data-wk-theme=\${theme}
              data-wk-mode=\${mode}
              style="display:grid;gap:8px;padding:12px;color:var(--wk-text);background:var(--wk-surface)"
            >
              <wk-status variant="success">\${theme} \${mode}: saved</wk-status>
              <wk-status variant="danger">\${theme} \${mode}: failed</wk-status>
            </div>\`))}
      <div data-wk-wireframe="true" style="padding:12px">
        <wk-status variant="warning">Wireframe: warning</wk-status>
      </div>
      <div data-wk-theme="neutral" data-wk-mode="light" style="padding:12px">
        <wk-status>Neutral outer</wk-status>
        <div data-wk-theme="studio" data-wk-mode="dark" style="padding:8px">
          <wk-status variant="success">Studio nested: saved</wk-status>
        </div>
      </div>
    </div>\`
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-card>
        <wk-status variant="success">Card: profile saved</wk-status>
        <form><wk-status variant="danger">Form: email is required</wk-status></form>
      </wk-card>
      <wk-dialog>
        <wk-button slot="invoker">Open status example</wk-button>
        <section slot="content" aria-label="Status example">
          <wk-status live="assertive" variant="danger">Dialog: delete failed</wk-status>
        </section>
      </wk-dialog>\`
}`,...l.parameters?.docs?.source}}};export{l as InCardFormDialog,i as LiveOptIn,o as LongText,d as Themes,r as Variants,n as WithIcons,k as __namedExportsOrder,p as default};
