import{b as n}from"./iframe-BTaqqi5X.js";import"./preload-helper-PPVm8Dsz.js";const{expect:r,userEvent:b,within:y}=__STORYBOOK_MODULE_TEST__,v=["neutral","studio","fieldwork"],h=["light","dark"],k=e=>Array.from({length:e},(a,t)=>`Line ${t+1}`).join(`
`),f=async(e,a)=>{const t=getComputedStyle(a);await r(t.outlineStyle).toBe("solid"),await r(t.outlineWidth).toBe("2px"),await r(t.outlineOffset).toBe("2px"),await r(t.borderTopLeftRadius).toBe(getComputedStyle(e).getPropertyValue("--wk-radius").trim()||"0px")},S={title:"Components/Text Area",tags:["autodocs"],parameters:{docs:{description:{component:"\n`<wk-text-area>` is a Lion `LionTextarea` with Wakata's shared scalar form behavior.\nIt auto-grows from `rows` (default 2) up to `max-rows` (default 6), then scrolls. Drag resizing is disabled.\nLine breaks are preserved in the native value and FormData. User edits emit `wk-input`; the native\ncommit boundary emits `wk-change`. Programmatic value updates and reset are silent.\n\nAutomated package checks run in Chromium, Firefox and WebKit; the React controlled and Angular\nreactive-form example checks run in Chromium. Manual assistive-technology and physical-device\nchecks have not been run. The contract is provisional.\n"}}},argTypes:{label:{control:"text"},required:{control:"boolean"},disabled:{control:"boolean"},readOnly:{control:"boolean",name:"readonly"},helpText:{control:"text"},error:{control:"text",description:"External error text."},rows:{control:"number",description:"Initial visible rows.",table:{defaultValue:{summary:"2"}}},maxRows:{control:"number",description:"Maximum auto-grow rows.",table:{defaultValue:{summary:"6"}}}},args:{label:"Notes",required:!1,disabled:!1,readOnly:!1,helpText:"",error:"",rows:2,maxRows:6},render:e=>n`<wk-text-area
      name="notes"
      label=${e.label}
      rows=${e.rows}
      max-rows=${e.maxRows}
      ?required=${e.required}
      ?disabled=${e.disabled}
      ?readonly=${e.readOnly}
      help-text=${e.helpText}
      error=${e.error}
    ></wk-text-area>`},o={play:async({canvasElement:e})=>{await r(y(e).getByRole("textbox",{name:"Notes"})).toHaveValue("")}},s={render:()=>n`
    ${v.flatMap(e=>h.map(a=>n`<div
            data-wk-theme=${e}
            data-wk-mode=${a}
            style="padding:12px;background:var(--wk-surface, #fff)"
          >
            <wk-text-area name="focus-${e}-${a}" label="Notes"></wk-text-area>
          </div>`))}
  `,play:async({canvasElement:e})=>{const a=Array.from(e.querySelectorAll("wk-text-area"));for(const t of a){const x=t.querySelector('[slot="input"]');await b.tab(),await r(x).toHaveFocus(),await f(t,x)}}},l={render:()=>n`<wk-text-area name="notes" label="Notes" .value=${"Short note"}></wk-text-area>`},d={render:()=>n`<div style="max-width:20rem">
      <wk-text-area
        name="notes"
        label="Notes"
        .value=${`First line
Second line
${"unbrokenlongcontent".repeat(8)}`}
      ></wk-text-area>
    </div>`},i={args:{helpText:"Persistent guidance.",error:"This note was rejected."},play:async({canvasElement:e})=>{const a=y(e).getByRole("textbox",{name:"Notes"});await r(a).toHaveAttribute("aria-invalid","true")}},m={args:{required:!0},play:async({canvasElement:e})=>{const a=e.querySelector("wk-text-area");a.submitted=!0,await a.validate(),await r(a.querySelector("textarea").getAttribute("aria-invalid")).toBe("true")}},c={name:"Disabled and read-only",render:()=>n`<div style="display:grid;gap:16px;max-width:32rem">
      <wk-text-area name="d" label="Disabled" .value=${"Unavailable"} disabled></wk-text-area>
      <wk-text-area name="r" label="Read only" .value=${"Copyable"} readonly></wk-text-area>
    </div>`,play:async({canvasElement:e})=>{const a=[...e.querySelectorAll("wk-text-area")];await r(a[0]?.querySelector("textarea")?.disabled).toBe(!0),await r(a[1]?.querySelector("textarea")?.readOnly).toBe(!0)}},u={name:"Auto-grow and maximum rows",render:()=>n`<div style="display:grid;gap:16px;max-width:24rem">
      <wk-text-area name="a" label="Default (2 to 6 rows)" .value=${k(4)}></wk-text-area>
      <wk-text-area name="b" label="Beyond maximum (scrolls)" .value=${k(12)}></wk-text-area>
    </div>`},p={name:"Themes, light/dark and wireframe",render:()=>n`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:16px"
    >
      ${v.flatMap(e=>h.flatMap(a=>["false","true"].map(t=>n`<div
                data-wk-theme=${e}
                data-wk-mode=${a}
                data-wk-wireframe=${t}
                style="padding:12px;background:${a==="dark"?"#171717":"#fff"};color:${a==="dark"?"#fff":"#111"}"
              >
                <wk-text-area label="Notes" help-text="Synthetic value."></wk-text-area>
              </div>`)))}
    </div>`},w={render:()=>n`<div data-wk-theme="studio" data-wk-mode="light">
      <wk-text-area label="Outer" name="o"></wk-text-area>
      <div data-wk-theme="fieldwork" data-wk-mode="dark" style="padding:12px;background:#171717">
        <wk-text-area label="Inner" name="i"></wk-text-area>
      </div>
    </div>`},A=["Empty","Focus","Filled","MultilineLongContent","HelpAndExternalError","RequiredInvalid","DisabledAndReadOnly","AutoGrowAndMaxRows","ThemesModesAndWireframe","NestedScope"];o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByRole('textbox', {
      name: 'Notes'
    })).toHaveValue('');
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
      await userEvent.tab();
      await expect(control).toHaveFocus();
      await expectFocusGeometry(host, control);
    }
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-text-area name="notes" label="Notes" .value=\${'Short note'}></wk-text-area>\`
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="max-width:20rem">
      <wk-text-area
        name="notes"
        label="Notes"
        .value=\${\`First line\\nSecond line\\n\${'unbrokenlongcontent'.repeat(8)}\`}
      ></wk-text-area>
    </div>\`
}`,...d.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'Auto-grow and maximum rows',
  render: () => html\`<div style="display:grid;gap:16px;max-width:24rem">
      <wk-text-area name="a" label="Default (2 to 6 rows)" .value=\${lines(4)}></wk-text-area>
      <wk-text-area name="b" label="Beyond maximum (scrolls)" .value=\${lines(12)}></wk-text-area>
    </div>\`
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div data-wk-theme="studio" data-wk-mode="light">
      <wk-text-area label="Outer" name="o"></wk-text-area>
      <div data-wk-theme="fieldwork" data-wk-mode="dark" style="padding:12px;background:#171717">
        <wk-text-area label="Inner" name="i"></wk-text-area>
      </div>
    </div>\`
}`,...w.parameters?.docs?.source}}};export{u as AutoGrowAndMaxRows,c as DisabledAndReadOnly,o as Empty,l as Filled,s as Focus,i as HelpAndExternalError,d as MultilineLongContent,w as NestedScope,m as RequiredInvalid,p as ThemesModesAndWireframe,A as __namedExportsOrder,S as default};
