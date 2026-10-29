import{b as r}from"./iframe-DoOAqjgx.js";import"./preload-helper-PPVm8Dsz.js";const{expect:n,within:k}=__STORYBOOK_MODULE_TEST__,m={title:"Components/Link",tags:["autodocs"],parameters:{docs:{description:{component:'\n`wk-link` is a provisional Lit component wrapping a native anchor. It takes `href`, `target`, `rel` and `variant` (`inline` default, or `standalone`). The native link name, keyboard activation and browser affordances are kept. Without an href (or with a `javascript:`, `data:`, or `vbscript:` href) it renders plain text: no role, tab stop or disabled/button behavior. `target="_blank"` always adds `noopener noreferrer` to the effective rel. Both treatments remain underlined so link affordance does not depend on color. Colors come from existing `--wk-accent` and `--wk-focus` tokens; no new tokens.\n'}}}},o={render:()=>r`<p>Read the <wk-link href="#guide">style guide</wk-link> before contributing.</p>`,play:async({canvasElement:t})=>{const e=t.querySelector("wk-link");await e.updateComplete;const a=e.shadowRoot.querySelector("a");await n(a).toHaveAttribute("href","#guide"),a.focus(),await n(e.shadowRoot.activeElement).toBe(a)}},i={render:()=>r`<wk-link variant="standalone" href="#next">Continue to next step</wk-link>`,play:async({canvasElement:t})=>{const e=t.querySelector("wk-link");await e.updateComplete,await n(getComputedStyle(e).display).toBe("inline-block"),await n(k(t).getByText("Continue to next step")).toBeVisible()}},l={render:()=>r`<wk-link href="https://example.com" target="_blank" rel="author"
      >External example</wk-link
    >`,play:async({canvasElement:t})=>{const e=t.querySelector("wk-link");await e.updateComplete;const a=e.shadowRoot.querySelector("a").getAttribute("rel").split(" ");await n(a).toEqual(n.arrayContaining(["author","noopener","noreferrer"]))}},s={render:()=>r`<p>
      Plain <wk-link>text without href</wk-link> and
      <wk-link href="javascript:alert(1)">unsafe</wk-link>.
    </p>`,play:async({canvasElement:t})=>{for(const e of t.querySelectorAll("wk-link"))await e.updateComplete,await n(e.shadowRoot.querySelector("a")).toBeNull()}},c={render:()=>r`<div style="width:min(220px, 100%)">
      <p>
        Review <wk-link href="#long">a-very-long-reference-with-no-breaks-1234567890</wk-link>
        before continuing.
      </p>
      <wk-link variant="standalone" href="#next">Continue to a longer named destination</wk-link>
    </div>`,play:async({canvasElement:t})=>{const e=t.querySelector("div");for(const a of e.querySelectorAll("wk-link"))await a.updateComplete;await n(e.scrollWidth).toBeLessThanOrEqual(e.clientWidth+1)}},d={render:()=>r`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px"
    >
      ${["neutral","studio","fieldwork"].flatMap(t=>["light","dark"].map(e=>r`<div
              data-wk-theme=${t}
              data-wk-mode=${e}
              style="padding:12px;color:var(--wk-text);background:var(--wk-surface)"
            >
              <p>${t} ${e}: <wk-link href="#example">Inline link</wk-link></p>
              <wk-link variant="standalone" href="#next">Standalone link</wk-link>
            </div>`))}
      <div
        data-wk-wireframe="true"
        style="padding:12px;color:var(--wk-text);background:var(--wk-surface)"
      >
        <wk-link href="#wireframe">Wireframe link</wk-link>
      </div>
    </div>`},u=["Inline","Standalone","NewTab","NoHref","LongWrapped","Themes"];o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`<p>Read the <wk-link href="#guide">style guide</wk-link> before contributing.</p>\`,
  play: async ({
    canvasElement
  }) => {
    const host = canvasElement.querySelector('wk-link')!;
    await host.updateComplete;
    const a = host.shadowRoot!.querySelector('a')!;
    await expect(a).toHaveAttribute('href', '#guide');
    a.focus();
    await expect(host.shadowRoot!.activeElement).toBe(a);
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-link variant="standalone" href="#next">Continue to next step</wk-link>\`,
  play: async ({
    canvasElement
  }) => {
    const host = canvasElement.querySelector('wk-link')!;
    await host.updateComplete;
    await expect(getComputedStyle(host).display).toBe('inline-block');
    await expect(within(canvasElement).getByText('Continue to next step')).toBeVisible();
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-link href="https://example.com" target="_blank" rel="author"
      >External example</wk-link
    >\`,
  play: async ({
    canvasElement
  }) => {
    const host = canvasElement.querySelector('wk-link')!;
    await host.updateComplete;
    const rel = host.shadowRoot!.querySelector('a')!.getAttribute('rel')!.split(' ');
    await expect(rel).toEqual(expect.arrayContaining(['author', 'noopener', 'noreferrer']));
  }
}`,...l.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => html\`<p>
      Plain <wk-link>text without href</wk-link> and
      <wk-link href="javascript:alert(1)">unsafe</wk-link>.
    </p>\`,
  play: async ({
    canvasElement
  }) => {
    for (const host of canvasElement.querySelectorAll('wk-link')) {
      await host.updateComplete;
      await expect(host.shadowRoot!.querySelector('a')).toBeNull();
    }
  }
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="width:min(220px, 100%)">
      <p>
        Review <wk-link href="#long">a-very-long-reference-with-no-breaks-1234567890</wk-link>
        before continuing.
      </p>
      <wk-link variant="standalone" href="#next">Continue to a longer named destination</wk-link>
    </div>\`,
  play: async ({
    canvasElement
  }) => {
    const frame = canvasElement.querySelector('div')!;
    for (const link of frame.querySelectorAll('wk-link')) await link.updateComplete;
    await expect(frame.scrollWidth).toBeLessThanOrEqual(frame.clientWidth + 1);
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px"
    >
      \${(['neutral', 'studio', 'fieldwork'] as const).flatMap(theme => (['light', 'dark'] as const).map(mode => html\`<div
              data-wk-theme=\${theme}
              data-wk-mode=\${mode}
              style="padding:12px;color:var(--wk-text);background:var(--wk-surface)"
            >
              <p>\${theme} \${mode}: <wk-link href="#example">Inline link</wk-link></p>
              <wk-link variant="standalone" href="#next">Standalone link</wk-link>
            </div>\`))}
      <div
        data-wk-wireframe="true"
        style="padding:12px;color:var(--wk-text);background:var(--wk-surface)"
      >
        <wk-link href="#wireframe">Wireframe link</wk-link>
      </div>
    </div>\`
}`,...d.parameters?.docs?.source}}};export{o as Inline,c as LongWrapped,l as NewTab,s as NoHref,i as Standalone,d as Themes,u as __namedExportsOrder,m as default};
