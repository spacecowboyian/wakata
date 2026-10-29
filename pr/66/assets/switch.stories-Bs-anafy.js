import{b as e}from"./iframe-IhVsOgoj.js";import"./preload-helper-PPVm8Dsz.js";const h={title:"Components/Switch",tags:["autodocs"],parameters:{docs:{description:{component:"\nSwitch changes an immediate setting and does not submit a form value. Keep its label stable\nbetween states. User activation emits one `wk-input` and one `wk-change` with\n`{ checked, name }`; programmatic changes are silent. It has no required or readonly API.\nManual assistive technology and physical device checks remain deferred.\n"}}},render:()=>e`<wk-switch name="alerts" label="Synthetic alerts"></wk-switch>`},r={},s={render:()=>e`<wk-switch name="alerts" label="Synthetic alerts" checked></wk-switch>`},i={play:async({canvasElement:t})=>{const a=t.querySelector("wk-switch");await a?.updateComplete,a.querySelector('[role="switch"]')?.focus()}},d={render:()=>e`<div style="display:grid;gap:12px;max-width:28rem">
      <wk-switch label="Unavailable setting" disabled></wk-switch>
      <wk-switch label="Previously enabled setting" checked disabled></wk-switch>
    </div>`},n={render:()=>e`<div style="max-width:240px">
      <wk-switch
        label="Show the full synthetic inspection history with every optional detail"
      ></wk-switch>
    </div>`},c={name:"Themes, modes and wireframe",render:()=>e`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));gap:16px"
    >
      ${["neutral","studio","fieldwork"].flatMap(t=>["light","dark"].flatMap(a=>["false","true"].map(l=>e`<section
                data-wk-theme=${t}
                data-wk-mode=${a}
                data-wk-wireframe=${l}
                style="padding:16px;background:var(--wk-surface);color:var(--wk-text);border:1px solid var(--wk-border)"
              >
                <p>${t} / ${a} / wireframe ${l}</p>
                <wk-switch label="Alerts" checked></wk-switch>
              </section>`)))}
    </div>`},o={name:"Adjacent and nested themes",render:()=>e`<div
      data-wk-theme="neutral"
      data-wk-mode="light"
      style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
    >
      <wk-switch label="Neutral alerts" checked></wk-switch>
      <div
        data-wk-theme="studio"
        data-wk-mode="dark"
        style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        <wk-switch label="Nested studio alerts" checked></wk-switch>
      </div>
      <wk-switch label="Neutral alerts again"></wk-switch>
    </div>`},p=["Off","On","Focused","Disabled","LongLabelNarrow","ThemesModesWireframe","NestedScope"];r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:"{}",...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:'{\n  render: () => html`<wk-switch name="alerts" label="Synthetic alerts" checked></wk-switch>`\n}',...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const field = canvasElement.querySelector('wk-switch') as WkSwitch;
    await field?.updateComplete;
    field.querySelector<HTMLElement>('[role="switch"]')?.focus();
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="display:grid;gap:12px;max-width:28rem">
      <wk-switch label="Unavailable setting" disabled></wk-switch>
      <wk-switch label="Previously enabled setting" checked disabled></wk-switch>
    </div>\`
}`,...d.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="max-width:240px">
      <wk-switch
        label="Show the full synthetic inspection history with every optional detail"
      ></wk-switch>
    </div>\`
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Themes, modes and wireframe',
  render: () => html\`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));gap:16px"
    >
      \${(['neutral', 'studio', 'fieldwork'] as const).flatMap(theme => (['light', 'dark'] as const).flatMap(mode => (['false', 'true'] as const).map(wireframe => html\`<section
                data-wk-theme=\${theme}
                data-wk-mode=\${mode}
                data-wk-wireframe=\${wireframe}
                style="padding:16px;background:var(--wk-surface);color:var(--wk-text);border:1px solid var(--wk-border)"
              >
                <p>\${theme} / \${mode} / wireframe \${wireframe}</p>
                <wk-switch label="Alerts" checked></wk-switch>
              </section>\`)))}
    </div>\`
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: 'Adjacent and nested themes',
  render: () => html\`<div
      data-wk-theme="neutral"
      data-wk-mode="light"
      style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
    >
      <wk-switch label="Neutral alerts" checked></wk-switch>
      <div
        data-wk-theme="studio"
        data-wk-mode="dark"
        style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        <wk-switch label="Nested studio alerts" checked></wk-switch>
      </div>
      <wk-switch label="Neutral alerts again"></wk-switch>
    </div>\`
}`,...o.parameters?.docs?.source}}};export{d as Disabled,i as Focused,n as LongLabelNarrow,o as NestedScope,r as Off,s as On,c as ThemesModesWireframe,p as __namedExportsOrder,h as default};
