import{b as t}from"./iframe-BA8XcQUt.js";import"./preload-helper-PPVm8Dsz.js";const{expect:r,within:x}=__STORYBOOK_MODULE_TEST__,k=["neutral","studio","fieldwork"],y=["light","dark"],w=e=>Array.from({length:e},(a,p)=>`Line ${p+1}`).join(`
`),h={title:"Components/Text Area",tags:["autodocs"],parameters:{docs:{description:{component:"\n`<wk-text-area>` is a Lion `LionTextarea` with Wakata's shared scalar form behavior.\nIt auto-grows from `rows` (default 2) up to `max-rows` (default 6), then scrolls. Drag resizing is disabled.\nLine breaks are preserved in the native value and FormData. User edits emit `wk-input`; the native\ncommit boundary emits `wk-change`. Programmatic value updates and reset are silent.\n\nAutomated package checks run in Chromium, Firefox and WebKit; the React controlled and Angular\nreactive-form example checks run in Chromium. Manual assistive-technology and physical-device\nchecks have not been run. The contract is provisional.\n"}}},argTypes:{label:{control:"text"},required:{control:"boolean"},disabled:{control:"boolean"},readOnly:{control:"boolean",name:"readonly"},helpText:{control:"text"},error:{control:"text",description:"External error text."},rows:{control:"number",description:"Initial visible rows.",table:{defaultValue:{summary:"2"}}},maxRows:{control:"number",description:"Maximum auto-grow rows.",table:{defaultValue:{summary:"6"}}}},args:{label:"Notes",required:!1,disabled:!1,readOnly:!1,helpText:"",error:"",rows:2,maxRows:6},render:e=>t`<wk-text-area
      name="notes"
      label=${e.label}
      rows=${e.rows}
      max-rows=${e.maxRows}
      ?required=${e.required}
      ?disabled=${e.disabled}
      ?readonly=${e.readOnly}
      help-text=${e.helpText}
      error=${e.error}
    ></wk-text-area>`},n={play:async({canvasElement:e})=>{await r(x(e).getByRole("textbox",{name:"Notes"})).toHaveValue("")}},o={render:()=>t`<wk-text-area name="notes" label="Notes" .value=${"Short note"}></wk-text-area>`},l={render:()=>t`<div style="max-width:20rem">
      <wk-text-area
        name="notes"
        label="Notes"
        .value=${`First line
Second line
${"unbrokenlongcontent".repeat(8)}`}
      ></wk-text-area>
    </div>`},s={args:{helpText:"Persistent guidance.",error:"This note was rejected."},play:async({canvasElement:e})=>{const a=x(e).getByRole("textbox",{name:"Notes"});await r(a).toHaveAttribute("aria-invalid","true")}},d={args:{required:!0},play:async({canvasElement:e})=>{const a=e.querySelector("wk-text-area");a.submitted=!0,await a.validate(),await r(a.querySelector("textarea").getAttribute("aria-invalid")).toBe("true")}},i={name:"Disabled and read-only",render:()=>t`<div style="display:grid;gap:16px;max-width:32rem">
      <wk-text-area name="d" label="Disabled" .value=${"Unavailable"} disabled></wk-text-area>
      <wk-text-area name="r" label="Read only" .value=${"Copyable"} readonly></wk-text-area>
    </div>`,play:async({canvasElement:e})=>{const a=[...e.querySelectorAll("wk-text-area")];await r(a[0]?.querySelector("textarea")?.disabled).toBe(!0),await r(a[1]?.querySelector("textarea")?.readOnly).toBe(!0)}},m={name:"Auto-grow and maximum rows",render:()=>t`<div style="display:grid;gap:16px;max-width:24rem">
      <wk-text-area name="a" label="Default (2 to 6 rows)" .value=${w(4)}></wk-text-area>
      <wk-text-area name="b" label="Beyond maximum (scrolls)" .value=${w(12)}></wk-text-area>
    </div>`},c={name:"Themes, light/dark and wireframe",render:()=>t`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:16px"
    >
      ${k.flatMap(e=>y.flatMap(a=>["false","true"].map(p=>t`<div
                data-wk-theme=${e}
                data-wk-mode=${a}
                data-wk-wireframe=${p}
                style="padding:12px;background:${a==="dark"?"#171717":"#fff"};color:${a==="dark"?"#fff":"#111"}"
              >
                <wk-text-area label="Notes" help-text="Synthetic value."></wk-text-area>
              </div>`)))}
    </div>`},u={render:()=>t`<div data-wk-theme="studio" data-wk-mode="light">
      <wk-text-area label="Outer" name="o"></wk-text-area>
      <div data-wk-theme="fieldwork" data-wk-mode="dark" style="padding:12px;background:#171717">
        <wk-text-area label="Inner" name="i"></wk-text-area>
      </div>
    </div>`},g=["Empty","Filled","MultilineLongContent","HelpAndExternalError","RequiredInvalid","DisabledAndReadOnly","AutoGrowAndMaxRows","ThemesModesAndWireframe","NestedScope"];n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByRole('textbox', {
      name: 'Notes'
    })).toHaveValue('');
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-text-area name="notes" label="Notes" .value=\${'Short note'}></wk-text-area>\`
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="max-width:20rem">
      <wk-text-area
        name="notes"
        label="Notes"
        .value=\${\`First line\\nSecond line\\n\${'unbrokenlongcontent'.repeat(8)}\`}
      ></wk-text-area>
    </div>\`
}`,...l.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...s.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Auto-grow and maximum rows',
  render: () => html\`<div style="display:grid;gap:16px;max-width:24rem">
      <wk-text-area name="a" label="Default (2 to 6 rows)" .value=\${lines(4)}></wk-text-area>
      <wk-text-area name="b" label="Beyond maximum (scrolls)" .value=\${lines(12)}></wk-text-area>
    </div>\`
}`,...m.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div data-wk-theme="studio" data-wk-mode="light">
      <wk-text-area label="Outer" name="o"></wk-text-area>
      <div data-wk-theme="fieldwork" data-wk-mode="dark" style="padding:12px;background:#171717">
        <wk-text-area label="Inner" name="i"></wk-text-area>
      </div>
    </div>\`
}`,...u.parameters?.docs?.source}}};export{m as AutoGrowAndMaxRows,i as DisabledAndReadOnly,n as Empty,o as Filled,s as HelpAndExternalError,l as MultilineLongContent,u as NestedScope,d as RequiredInvalid,c as ThemesModesAndWireframe,g as __namedExportsOrder,h as default};
