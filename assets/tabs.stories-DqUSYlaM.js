import{b as e}from"./iframe-IhVsOgoj.js";import"./preload-helper-PPVm8Dsz.js";const a=(t="overview")=>e`<wk-tabs label="Vehicle details" value=${t}>
    <wk-tab slot="tab" value="overview">Overview</wk-tab>
    <wk-tab slot="tab" value="inspection">Inspection</wk-tab>
    <wk-tab slot="tab" value="history">History</wk-tab>
    <wk-tab-panel slot="panel" value="overview">
      <h3>Overview</h3>
      <p>Review the vehicle summary before the inspection.</p>
    </wk-tab-panel>
    <wk-tab-panel slot="panel" value="inspection">
      <h3>Inspection</h3>
      <p>Check the body, engine and interior in person.</p>
    </wk-tab-panel>
    <wk-tab-panel slot="panel" value="history">
      <h3>History</h3>
      <p>Compare service records with the seller's description.</p>
    </wk-tab-panel>
  </wk-tabs>`,v={title:"Components/Tabs",tags:["autodocs"],parameters:{docs:{description:{component:"\nTabs display one panel at a time. Give each `wk-tab` and its matching `wk-tab-panel` the same nonempty `value`.\nGive `wk-tabs` a visible-context `label` for its accessible tablist name. The first enabled complete pair is selected by default.\nLeft/Right arrows, Home and End **move focus only**. Enter, Space or click activates the focused tab and emits one `wk-change` with `{ value }`.\nProgrammatic `value` updates are silent; an invalid value normalizes to the first enabled complete pair.\nOnly horizontal tabs are supported. Narrow layouts wrap the tabs. This provisional component is not shared production promotion.\nManual assistive-technology and physical-device checks remain deferred.\n"}}},render:()=>a()},n={},s={render:()=>a("inspection")},o={render:()=>e`<div style="display:grid;gap:12px;max-width:34rem">
      <p>Focus a tab, press Right Arrow, then press Enter to open its panel.</p>
      ${a()}
    </div>`},i={render:()=>e`<wk-tabs label="Vehicle details" value="overview">
      <wk-tab slot="tab" value="overview">Overview</wk-tab>
      <wk-tab slot="tab" value="inspection" disabled>Inspection unavailable</wk-tab>
      <wk-tab slot="tab" value="history">History</wk-tab>
      <wk-tab-panel slot="panel" value="overview">Vehicle summary.</wk-tab-panel>
      <wk-tab-panel slot="panel" value="inspection">Unavailable inspection details.</wk-tab-panel>
      <wk-tab-panel slot="panel" value="history">Service history.</wk-tab-panel>
    </wk-tabs>`},l={render:()=>e`<div style="width:320px;max-width:100%">
      <wk-tabs label="Vehicle buying checklist" value="body">
        <wk-tab slot="tab" value="body">Body and structural corrosion</wk-tab>
        <wk-tab slot="tab" value="engine">Engine and drivetrain condition</wk-tab>
        <wk-tab slot="tab" value="records">Service history and ownership records</wk-tab>
        <wk-tab-panel slot="panel" value="body">
          <h3>Body and structural corrosion</h3>
          <p>Inspect the underbody, sills, wheel arches and repair seams before making an offer.</p>
        </wk-tab-panel>
        <wk-tab-panel slot="panel" value="engine">
          <h3>Engine and drivetrain</h3>
          <p>Check for leaks, startup noise and smooth gear changes.</p>
        </wk-tab-panel>
        <wk-tab-panel slot="panel" value="records">
          <h3>Records</h3>
          <p>Compare documents, ownership history and reported mileage.</p>
        </wk-tab-panel>
      </wk-tabs>
    </div>`},d={render:()=>e`<div style="display:grid;gap:12px;max-width:34rem">
      ${a()}
      <button
        type="button"
        @click=${t=>{const r=t.currentTarget.parentElement?.querySelector("wk-tabs");r&&(r.value="history")}}
      >
        Choose History programmatically
      </button>
    </div>`},p={render:()=>e`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:16px"
    >
      ${["neutral","studio","fieldwork"].flatMap(t=>["light","dark"].map(r=>e`<div
              data-wk-theme=${t}
              data-wk-mode=${r}
              style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
            >
              ${a()}
            </div>`))}
      <div
        data-wk-theme="neutral"
        data-wk-wireframe="true"
        style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        ${a()}
      </div>
    </div>`},c={render:()=>e`<div
      data-wk-theme="neutral"
      data-wk-mode="light"
      style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
    >
      ${a()}
      <div
        data-wk-theme="fieldwork"
        data-wk-mode="dark"
        style="margin-top:16px;padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        ${a("inspection")}
      </div>
    </div>`},u=["Default","AlternateSelection","ManualActivation","DisabledTab","LongContentNarrow","ControlledUpdate","ThemesModesWireframe","NestedScope"];n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:"{}",...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => set('inspection')
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="display:grid;gap:12px;max-width:34rem">
      <p>Focus a tab, press Right Arrow, then press Enter to open its panel.</p>
      \${set()}
    </div>\`
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-tabs label="Vehicle details" value="overview">
      <wk-tab slot="tab" value="overview">Overview</wk-tab>
      <wk-tab slot="tab" value="inspection" disabled>Inspection unavailable</wk-tab>
      <wk-tab slot="tab" value="history">History</wk-tab>
      <wk-tab-panel slot="panel" value="overview">Vehicle summary.</wk-tab-panel>
      <wk-tab-panel slot="panel" value="inspection">Unavailable inspection details.</wk-tab-panel>
      <wk-tab-panel slot="panel" value="history">Service history.</wk-tab-panel>
    </wk-tabs>\`
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="width:320px;max-width:100%">
      <wk-tabs label="Vehicle buying checklist" value="body">
        <wk-tab slot="tab" value="body">Body and structural corrosion</wk-tab>
        <wk-tab slot="tab" value="engine">Engine and drivetrain condition</wk-tab>
        <wk-tab slot="tab" value="records">Service history and ownership records</wk-tab>
        <wk-tab-panel slot="panel" value="body">
          <h3>Body and structural corrosion</h3>
          <p>Inspect the underbody, sills, wheel arches and repair seams before making an offer.</p>
        </wk-tab-panel>
        <wk-tab-panel slot="panel" value="engine">
          <h3>Engine and drivetrain</h3>
          <p>Check for leaks, startup noise and smooth gear changes.</p>
        </wk-tab-panel>
        <wk-tab-panel slot="panel" value="records">
          <h3>Records</h3>
          <p>Compare documents, ownership history and reported mileage.</p>
        </wk-tab-panel>
      </wk-tabs>
    </div>\`
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="display:grid;gap:12px;max-width:34rem">
      \${set()}
      <button
        type="button"
        @click=\${(event: Event) => {
    const tabs = (event.currentTarget as HTMLElement).parentElement?.querySelector('wk-tabs') as (HTMLElement & {
      value: string;
    }) | null;
    if (tabs) tabs.value = 'history';
  }}
      >
        Choose History programmatically
      </button>
    </div>\`
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:16px"
    >
      \${(['neutral', 'studio', 'fieldwork'] as const).flatMap(theme => (['light', 'dark'] as const).map(mode => html\`<div
              data-wk-theme=\${theme}
              data-wk-mode=\${mode}
              style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
            >
              \${set()}
            </div>\`))}
      <div
        data-wk-theme="neutral"
        data-wk-wireframe="true"
        style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        \${set()}
      </div>
    </div>\`
}`,...p.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div
      data-wk-theme="neutral"
      data-wk-mode="light"
      style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
    >
      \${set()}
      <div
        data-wk-theme="fieldwork"
        data-wk-mode="dark"
        style="margin-top:16px;padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        \${set('inspection')}
      </div>
    </div>\`
}`,...c.parameters?.docs?.source}}};export{s as AlternateSelection,d as ControlledUpdate,n as Default,i as DisabledTab,l as LongContentNarrow,o as ManualActivation,c as NestedScope,p as ThemesModesWireframe,u as __namedExportsOrder,v as default};
