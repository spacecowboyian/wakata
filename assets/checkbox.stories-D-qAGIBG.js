import{b as e}from"./iframe-CIX4NnH9.js";import"./preload-helper-PPVm8Dsz.js";const w={title:"Components/Checkbox",tags:["autodocs"],parameters:{docs:{description:{component:"\nCheckbox submits its choice value only when checked. A standalone required checkbox must be checked;\na required group needs at least one selection. User activation emits one `wk-input` and one\n`wk-change` with `{ checked, name, value }`. Programmatic changes and reset are silent.\nUse Checkbox for submitted consent and choices. Tri-state is outside this contract.\nManual assistive technology and physical device checks remain deferred.\n"}}},render:()=>e`<wk-checkbox name="consent" label="I agree to the synthetic terms"></wk-checkbox>`},o={},c={render:()=>e`<wk-checkbox name="consent" label="I agree to the synthetic terms" checked></wk-checkbox>`},t={render:()=>e`<div style="display:grid;gap:12px;max-width:28rem">
      <wk-checkbox label="Unavailable option" disabled></wk-checkbox>
      <wk-checkbox label="Previously selected option" checked disabled></wk-checkbox>
    </div>`},n={play:async({canvasElement:r})=>{const a=r.querySelector("wk-checkbox input");await r.querySelector("wk-checkbox")?.updateComplete,a.focus()}},s={render:()=>e`<wk-checkbox
      name="consent"
      label="I agree to the synthetic terms"
      help-text="This selection is required to continue."
      required
      error="Please review and accept the terms."
    ></wk-checkbox>`},d={render:()=>e`<wk-checkbox-group
      name="features[]"
      label="Features to review"
      help-text="Choose at least one."
      required
    >
      <wk-checkbox name="features[]" label="Bodywork" .choiceValue=${"bodywork"}></wk-checkbox>
      <wk-checkbox name="features[]" label="Engine" .choiceValue=${"engine"}></wk-checkbox>
      <wk-checkbox name="features[]" label="Interior" .choiceValue=${"interior"}></wk-checkbox>
    </wk-checkbox-group>`},i={render:()=>e`<wk-checkbox-group
      name="features[]"
      label="Features to review"
      help-text="Choose at least one."
      error="Select a feature before continuing."
    >
      <wk-checkbox name="features[]" label="Bodywork" .choiceValue=${"bodywork"}></wk-checkbox>
      <wk-checkbox name="features[]" label="Engine" .choiceValue=${"engine"}></wk-checkbox>
    </wk-checkbox-group>`},k={render:()=>e`<div style="max-width:240px">
      <wk-checkbox
        name="consent"
        label="Send me a detailed synthetic report about the inspection, ownership history, and all items I selected for review."
      ></wk-checkbox>
    </div>`},l={name:"Themes, modes and wireframe",render:()=>e`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));gap:16px"
    >
      ${["neutral","studio","fieldwork"].flatMap(r=>["light","dark"].flatMap(a=>["false","true"].map(m=>e`<section
                data-wk-theme=${r}
                data-wk-mode=${a}
                data-wk-wireframe=${m}
                style="padding:16px;background:var(--wk-surface);color:var(--wk-text);border:1px solid var(--wk-border)"
              >
                <p>${r} / ${a} / wireframe ${m}</p>
                <wk-checkbox label="Selected option" checked></wk-checkbox>
              </section>`)))}
    </div>`},h={name:"Adjacent and nested themes",render:()=>e`<div
      data-wk-theme="neutral"
      data-wk-mode="light"
      style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
    >
      <wk-checkbox label="Neutral choice" checked></wk-checkbox>
      <div
        data-wk-theme="studio"
        data-wk-mode="dark"
        style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        <wk-checkbox label="Nested studio choice" checked></wk-checkbox>
      </div>
      <wk-checkbox label="Neutral choice again"></wk-checkbox>
    </div>`},p=["Unchecked","Checked","Disabled","Focused","RequiredAndError","RequiredGroup","GroupError","LongLabelNarrow","ThemesModesWireframe","NestedScope"];o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:"{}",...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:'{\n  render: () => html`<wk-checkbox name="consent" label="I agree to the synthetic terms" checked></wk-checkbox>`\n}',...c.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="display:grid;gap:12px;max-width:28rem">
      <wk-checkbox label="Unavailable option" disabled></wk-checkbox>
      <wk-checkbox label="Previously selected option" checked disabled></wk-checkbox>
    </div>\`
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const control = canvasElement.querySelector('wk-checkbox input') as HTMLInputElement;
    await (canvasElement.querySelector('wk-checkbox') as WkCheckbox)?.updateComplete;
    control.focus();
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-checkbox
      name="consent"
      label="I agree to the synthetic terms"
      help-text="This selection is required to continue."
      required
      error="Please review and accept the terms."
    ></wk-checkbox>\`
}`,...s.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-checkbox-group
      name="features[]"
      label="Features to review"
      help-text="Choose at least one."
      required
    >
      <wk-checkbox name="features[]" label="Bodywork" .choiceValue=\${'bodywork'}></wk-checkbox>
      <wk-checkbox name="features[]" label="Engine" .choiceValue=\${'engine'}></wk-checkbox>
      <wk-checkbox name="features[]" label="Interior" .choiceValue=\${'interior'}></wk-checkbox>
    </wk-checkbox-group>\`
}`,...d.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-checkbox-group
      name="features[]"
      label="Features to review"
      help-text="Choose at least one."
      error="Select a feature before continuing."
    >
      <wk-checkbox name="features[]" label="Bodywork" .choiceValue=\${'bodywork'}></wk-checkbox>
      <wk-checkbox name="features[]" label="Engine" .choiceValue=\${'engine'}></wk-checkbox>
    </wk-checkbox-group>\`
}`,...i.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="max-width:240px">
      <wk-checkbox
        name="consent"
        label="Send me a detailed synthetic report about the inspection, ownership history, and all items I selected for review."
      ></wk-checkbox>
    </div>\`
}`,...k.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
                <wk-checkbox label="Selected option" checked></wk-checkbox>
              </section>\`)))}
    </div>\`
}`,...l.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'Adjacent and nested themes',
  render: () => html\`<div
      data-wk-theme="neutral"
      data-wk-mode="light"
      style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
    >
      <wk-checkbox label="Neutral choice" checked></wk-checkbox>
      <div
        data-wk-theme="studio"
        data-wk-mode="dark"
        style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        <wk-checkbox label="Nested studio choice" checked></wk-checkbox>
      </div>
      <wk-checkbox label="Neutral choice again"></wk-checkbox>
    </div>\`
}`,...h.parameters?.docs?.source}}};export{c as Checked,t as Disabled,n as Focused,i as GroupError,k as LongLabelNarrow,h as NestedScope,s as RequiredAndError,d as RequiredGroup,l as ThemesModesWireframe,o as Unchecked,p as __namedExportsOrder,w as default};
