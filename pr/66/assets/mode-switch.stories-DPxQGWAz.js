import{b as n}from"./iframe-IhVsOgoj.js";import"./preload-helper-PPVm8Dsz.js";const{expect:o,userEvent:w}=__STORYBOOK_MODULE_TEST__,h={title:"Supporting/Mode Switch",tags:["autodocs"],render:()=>n`<wk-mode-switch></wk-mode-switch>`,beforeEach:()=>{const t=document.createElement("wk-mode-switch");t.mode="system",document.body.append(t),t.remove()},parameters:{docs:{description:{component:"Provisional site-wide System/Light/Dark control with native labelled radios. Writes the document root, not local theme roots. All instances share one choice; only user changes emit wk-mode-change. Storybook’s toolbar intentionally supplies a local mode override: use the real HTML example to see document-wide switching."}}}},r=(t,e)=>t.shadowRoot.querySelector(`input[value="${e}"]`),s={play:async({canvasElement:t})=>{const e=t.querySelector("wk-mode-switch");await e.updateComplete,await o(r(e,"system")).toBeChecked(),await o(e).toHaveAttribute("mode","system")}},i={render:()=>n`<wk-mode-switch mode="light"></wk-mode-switch>`,play:async({canvasElement:t})=>{const e=t.querySelector("wk-mode-switch");await e.updateComplete,await o(r(e,"light")).toBeChecked(),await o(document.documentElement).toHaveAttribute("data-wk-mode","light")}},c={render:()=>n`<wk-mode-switch mode="dark"></wk-mode-switch>`,play:async({canvasElement:t})=>{const e=t.querySelector("wk-mode-switch");await e.updateComplete,await o(r(e,"dark")).toBeChecked(),await o(document.documentElement).toHaveAttribute("data-wk-mode","dark")}},m={render:()=>n`
    <div style="display:grid;gap:16px;max-width:24rem">
      <wk-mode-switch></wk-mode-switch>
      <section data-wk-mode="light">
        <p>Local light appearance; same site-wide choice.</p>
        <wk-mode-switch></wk-mode-switch>
      </section>
    </div>
  `,play:async({canvasElement:t})=>{const[e,a]=[...t.querySelectorAll("wk-mode-switch")];await e.updateComplete,await w.click(r(e,"dark")),await a.updateComplete,await o(r(a,"dark")).toBeChecked(),await o(document.documentElement).toHaveAttribute("data-wk-mode","dark"),await o(t.querySelector("section")).toHaveAttribute("data-wk-mode","light")}},d={render:()=>n`<div style="max-width:240px"><wk-mode-switch></wk-mode-switch></div>`,play:async({canvasElement:t})=>{const e=t.querySelector("wk-mode-switch");await e.updateComplete,await o(e.scrollWidth).toBeLessThanOrEqual(240);for(const a of e.shadowRoot.querySelectorAll("label"))await o(a.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)}},l={render:()=>n`
    <div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:16px"
    >
      ${["neutral","studio","fieldwork"].flatMap(t=>["light","dark"].flatMap(e=>["false","true"].map(a=>n`
              <section
                data-wk-theme=${t}
                data-wk-mode=${e}
                data-wk-wireframe=${a}
                style="padding:12px;background:var(--wk-surface);color:var(--wk-text)"
              >
                <p>${t} / ${e} / wireframe ${a}</p>
                <wk-mode-switch></wk-mode-switch>
              </section>
            `)))}
    </div>
  `,play:async({canvasElement:t})=>{const e=[...t.querySelectorAll("wk-mode-switch")];await Promise.all(e.map(a=>a.updateComplete)),await o(new Set(e.map(a=>getComputedStyle(a).fontFamily)).size).toBe(3),await o(new Set(e.map(a=>getComputedStyle(a.shadowRoot.querySelector("fieldset")).backgroundColor)).size).toBe(2)}},k=["System","Light","Dark","SharedChoice","Narrow","ThemesModesAndWireframe"];s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const element = canvasElement.querySelector('wk-mode-switch')!;
    await element.updateComplete;
    await expect(input(element, 'system')).toBeChecked();
    await expect(element).toHaveAttribute('mode', 'system');
  }
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-mode-switch mode="light"></wk-mode-switch>\`,
  play: async ({
    canvasElement
  }) => {
    const element = canvasElement.querySelector('wk-mode-switch')!;
    await element.updateComplete;
    await expect(input(element, 'light')).toBeChecked();
    await expect(document.documentElement).toHaveAttribute('data-wk-mode', 'light');
  }
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-mode-switch mode="dark"></wk-mode-switch>\`,
  play: async ({
    canvasElement
  }) => {
    const element = canvasElement.querySelector('wk-mode-switch')!;
    await element.updateComplete;
    await expect(input(element, 'dark')).toBeChecked();
    await expect(document.documentElement).toHaveAttribute('data-wk-mode', 'dark');
  }
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="display:grid;gap:16px;max-width:24rem">
      <wk-mode-switch></wk-mode-switch>
      <section data-wk-mode="light">
        <p>Local light appearance; same site-wide choice.</p>
        <wk-mode-switch></wk-mode-switch>
      </section>
    </div>
  \`,
  play: async ({
    canvasElement
  }) => {
    const [first, second] = [...canvasElement.querySelectorAll('wk-mode-switch')];
    await first!.updateComplete;
    await userEvent.click(input(first!, 'dark'));
    await second!.updateComplete;
    await expect(input(second!, 'dark')).toBeChecked();
    await expect(document.documentElement).toHaveAttribute('data-wk-mode', 'dark');
    await expect(canvasElement.querySelector('section')).toHaveAttribute('data-wk-mode', 'light');
  }
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="max-width:240px"><wk-mode-switch></wk-mode-switch></div>\`,
  play: async ({
    canvasElement
  }) => {
    const element = canvasElement.querySelector('wk-mode-switch')!;
    await element.updateComplete;
    await expect(element.scrollWidth).toBeLessThanOrEqual(240);
    for (const label of element.shadowRoot!.querySelectorAll('label')) {
      await expect(label.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    }
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:16px"
    >
      \${['neutral', 'studio', 'fieldwork'].flatMap(theme => ['light', 'dark'].flatMap(mode => ['false', 'true'].map(wireframe => html\`
              <section
                data-wk-theme=\${theme}
                data-wk-mode=\${mode}
                data-wk-wireframe=\${wireframe}
                style="padding:12px;background:var(--wk-surface);color:var(--wk-text)"
              >
                <p>\${theme} / \${mode} / wireframe \${wireframe}</p>
                <wk-mode-switch></wk-mode-switch>
              </section>
            \`)))}
    </div>
  \`,
  play: async ({
    canvasElement
  }) => {
    const elements = [...canvasElement.querySelectorAll('wk-mode-switch')];
    await Promise.all(elements.map(element => element.updateComplete));
    await expect(new Set(elements.map(element => getComputedStyle(element).fontFamily)).size).toBe(3);
    await expect(new Set(elements.map(element => getComputedStyle(element.shadowRoot!.querySelector('fieldset')!).backgroundColor)).size).toBe(2);
  }
}`,...l.parameters?.docs?.source}}};export{c as Dark,i as Light,d as Narrow,m as SharedChoice,s as System,l as ThemesModesAndWireframe,k as __namedExportsOrder,h as default};
