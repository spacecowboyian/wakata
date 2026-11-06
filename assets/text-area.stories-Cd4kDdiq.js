import{b as r}from"./iframe-DBHZ5tyn.js";import"./preload-helper-PPVm8Dsz.js";const{expect:t,userEvent:g,within:v}=__STORYBOOK_MODULE_TEST__,b=["neutral","studio","fieldwork"],h=["light","dark"],k=e=>Array.from({length:e},(a,n)=>`Line ${n+1}`).join(`
`),$=async(e,a,n)=>{const s=e.shadowRoot.querySelector(".input-group__container"),o=getComputedStyle(s);await t(getComputedStyle(a).outlineStyle).toBe("none"),await t(o.borderColor).not.toBe(n),await t(o.boxShadow).not.toBe("none"),await t(o.borderTopLeftRadius).toBe(getComputedStyle(e).getPropertyValue("--wk-radius").trim()||"0px")},q={title:"Components/Text Area",tags:["autodocs"],parameters:{docs:{description:{component:"\n`<wk-text-area>` is a Lion `LionTextarea` with Wakata's shared scalar form behavior.\nIt auto-grows from `rows` (default 2) up to `max-rows` (default 6), then scrolls. Drag resizing is disabled.\nLine breaks are preserved in the native value and FormData. User edits emit `wk-input`; the native\ncommit boundary emits `wk-change`. Programmatic value updates and reset are silent.\n\nAutomated package checks run in Chromium, Firefox and WebKit; the React controlled and Angular\nreactive-form example checks run in Chromium. Manual assistive-technology and physical-device\nchecks have not been run. The contract is provisional.\n"}}},argTypes:{label:{control:"text"},required:{control:"boolean"},disabled:{control:"boolean"},readOnly:{control:"boolean",name:"readonly"},helpText:{control:"text"},error:{control:"text",description:"External error text."},rows:{control:"number",description:"Initial visible rows.",table:{defaultValue:{summary:"2"}}},maxRows:{control:"number",description:"Maximum auto-grow rows.",table:{defaultValue:{summary:"6"}}}},args:{label:"Notes",required:!1,disabled:!1,readOnly:!1,helpText:"",error:"",rows:2,maxRows:6},render:e=>r`<wk-text-area
      name="notes"
      label=${e.label}
      rows=${e.rows}
      max-rows=${e.maxRows}
      ?required=${e.required}
      ?disabled=${e.disabled}
      ?readonly=${e.readOnly}
      help-text=${e.helpText}
      error=${e.error}
    ></wk-text-area>`},l={play:async({canvasElement:e})=>{await t(v(e).getByRole("textbox",{name:"Notes"})).toHaveValue("")}},d={render:()=>r`
    ${b.flatMap(e=>h.map(a=>r`<div
            data-wk-theme=${e}
            data-wk-mode=${a}
            style="padding:12px;background:var(--wk-surface, #fff)"
          >
            <wk-text-area name="focus-${e}-${a}" label="Notes"></wk-text-area>
          </div>`))}
  `,play:async({canvasElement:e})=>{const a=Array.from(e.querySelectorAll("wk-text-area"));for(const n of a){const s=n.querySelector('[slot="input"]'),o=n.shadowRoot.querySelector(".input-group__container"),f=getComputedStyle(o).borderColor;await g.tab(),await t(s).toHaveFocus(),await $(n,s,f)}}},i={render:()=>r`<wk-text-area name="notes" label="Notes" .value=${"Short note"}></wk-text-area>`},m={render:()=>r`<div style="max-width:20rem">
      <wk-text-area
        name="notes"
        label="Notes"
        .value=${`First line
Second line
${"unbrokenlongcontent".repeat(8)}`}
      ></wk-text-area>
    </div>`},c={args:{helpText:"Persistent guidance.",error:"This note was rejected."},play:async({canvasElement:e})=>{const a=v(e).getByRole("textbox",{name:"Notes"});await t(a).toHaveAttribute("aria-invalid","true")}},u={args:{required:!0},play:async({canvasElement:e})=>{const a=e.querySelector("wk-text-area");a.submitted=!0,await a.validate(),await t(a.querySelector("textarea").getAttribute("aria-invalid")).toBe("true")}},p={name:"Disabled and read-only",render:()=>r`<div style="display:grid;gap:16px;max-width:32rem">
      <wk-text-area name="d" label="Disabled" .value=${"Unavailable"} disabled></wk-text-area>
      <wk-text-area name="r" label="Read only" .value=${"Copyable"} readonly></wk-text-area>
    </div>`,play:async({canvasElement:e})=>{const a=[...e.querySelectorAll("wk-text-area")];await t(a[0]?.querySelector("textarea")?.disabled).toBe(!0),await t(a[1]?.querySelector("textarea")?.readOnly).toBe(!0)}},w={name:"Auto-grow and maximum rows",render:()=>r`<div style="display:grid;gap:16px;max-width:24rem">
      <wk-text-area name="a" label="Default (2 to 6 rows)" .value=${k(4)}></wk-text-area>
      <wk-text-area name="b" label="Beyond maximum (scrolls)" .value=${k(12)}></wk-text-area>
    </div>`},x={name:"Themes, light/dark and wireframe",render:()=>r`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:16px"
    >
      ${b.flatMap(e=>h.flatMap(a=>["false","true"].map(n=>r`<div
                data-wk-theme=${e}
                data-wk-mode=${a}
                data-wk-wireframe=${n}
                style="padding:12px;background:${a==="dark"?"#171717":"#fff"};color:${a==="dark"?"#fff":"#111"}"
              >
                <wk-text-area label="Notes" help-text="Synthetic value."></wk-text-area>
              </div>`)))}
    </div>`},y={render:()=>r`<div data-wk-theme="studio" data-wk-mode="light">
      <wk-text-area label="Outer" name="o"></wk-text-area>
      <div data-wk-theme="fieldwork" data-wk-mode="dark" style="padding:12px;background:#171717">
        <wk-text-area label="Inner" name="i"></wk-text-area>
      </div>
    </div>`},E=["Empty","Focus","Filled","MultilineLongContent","HelpAndExternalError","RequiredInvalid","DisabledAndReadOnly","AutoGrowAndMaxRows","ThemesModesAndWireframe","NestedScope"];l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByRole('textbox', {
      name: 'Notes'
    })).toHaveValue('');
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    \${themes.flatMap(theme => modes.map(mode => html\`<div
            data-wk-theme=\${theme}
            data-wk-mode=\${mode}
            style="padding:12px;background:var(--wk-surface, #fff)"
          >
            <wk-text-area name="focus-\${theme}-\${mode}" label="Notes"></wk-text-area>
          </div>\`))}
  \`,
  play: async ({
    canvasElement
  }) => {
    const hosts = Array.from(canvasElement.querySelectorAll('wk-text-area'));
    for (const host of hosts) {
      const control = host.querySelector('[slot="input"]')!;
      const wrapper = host.shadowRoot!.querySelector<HTMLElement>('.input-group__container')!;
      const beforeBorder = getComputedStyle(wrapper).borderColor;
      await userEvent.tab();
      await expect(control).toHaveFocus();
      await expectFocusGeometry(host, control, beforeBorder);
    }
  }
}`,...d.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-text-area name="notes" label="Notes" .value=\${'Short note'}></wk-text-area>\`
}`,...i.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="max-width:20rem">
      <wk-text-area
        name="notes"
        label="Notes"
        .value=\${\`First line\\nSecond line\\n\${'unbrokenlongcontent'.repeat(8)}\`}
      ></wk-text-area>
    </div>\`
}`,...m.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    helpText: 'Persistent guidance.',
    error: 'This note was rejected.'
  },
  play: async ({
    canvasElement
  }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Notes'
    });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
  }
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    required: true
  },
  play: async ({
    canvasElement
  }) => {
    const field = canvasElement.querySelector('wk-text-area') as WkTextArea;
    field.submitted = true;
    await field.validate();
    await expect(field.querySelector('textarea')!.getAttribute('aria-invalid')).toBe('true');
  }
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Disabled and read-only',
  render: () => html\`<div style="display:grid;gap:16px;max-width:32rem">
      <wk-text-area name="d" label="Disabled" .value=\${'Unavailable'} disabled></wk-text-area>
      <wk-text-area name="r" label="Read only" .value=\${'Copyable'} readonly></wk-text-area>
    </div>\`,
  play: async ({
    canvasElement
  }) => {
    const fields = [...canvasElement.querySelectorAll('wk-text-area')] as WkTextArea[];
    await expect(fields[0]?.querySelector('textarea')?.disabled).toBe(true);
    await expect(fields[1]?.querySelector('textarea')?.readOnly).toBe(true);
  }
}`,...p.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'Auto-grow and maximum rows',
  render: () => html\`<div style="display:grid;gap:16px;max-width:24rem">
      <wk-text-area name="a" label="Default (2 to 6 rows)" .value=\${lines(4)}></wk-text-area>
      <wk-text-area name="b" label="Beyond maximum (scrolls)" .value=\${lines(12)}></wk-text-area>
    </div>\`
}`,...w.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Themes, light/dark and wireframe',
  render: () => html\`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:16px"
    >
      \${themes.flatMap(theme => modes.flatMap(mode => ['false', 'true'].map(wireframe => html\`<div
                data-wk-theme=\${theme}
                data-wk-mode=\${mode}
                data-wk-wireframe=\${wireframe}
                style="padding:12px;background:\${mode === 'dark' ? '#171717' : '#fff'};color:\${mode === 'dark' ? '#fff' : '#111'}"
              >
                <wk-text-area label="Notes" help-text="Synthetic value."></wk-text-area>
              </div>\`)))}
    </div>\`
}`,...x.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div data-wk-theme="studio" data-wk-mode="light">
      <wk-text-area label="Outer" name="o"></wk-text-area>
      <div data-wk-theme="fieldwork" data-wk-mode="dark" style="padding:12px;background:#171717">
        <wk-text-area label="Inner" name="i"></wk-text-area>
      </div>
    </div>\`
}`,...y.parameters?.docs?.source}}};export{w as AutoGrowAndMaxRows,p as DisabledAndReadOnly,l as Empty,i as Filled,d as Focus,c as HelpAndExternalError,m as MultilineLongContent,y as NestedScope,u as RequiredInvalid,x as ThemesModesAndWireframe,E as __namedExportsOrder,q as default};
