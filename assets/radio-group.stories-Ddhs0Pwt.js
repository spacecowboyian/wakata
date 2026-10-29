import{b as e}from"./iframe-CIX4NnH9.js";import"./preload-helper-PPVm8Dsz.js";const w={title:"Components/Radio Group",tags:["autodocs"],parameters:{docs:{description:{component:"\nRadio Group is a one-of-many choice. No option is selected unless a `wk-radio` is `checked` or\n`value` is set. It submits one value under `name`; reset restores the initially checked option.\nUser selection emits one `wk-input` and one `wk-change` with `{ value, name }`.\nArrow keys move selection and skip disabled options; Tab leaves the group.\nManual assistive technology and physical device checks remain deferred.\n"}}},render:()=>e`<wk-radio-group name="contact" label="Contact method">
      <wk-radio label="Email" .choiceValue=${"email"}></wk-radio>
      <wk-radio label="Phone" .choiceValue=${"phone"}></wk-radio>
      <wk-radio label="Post" .choiceValue=${"post"}></wk-radio>
    </wk-radio-group>`},o={},r={render:()=>e`<wk-radio-group name="contact" label="Contact method">
      <wk-radio label="Email" .choiceValue=${"email"}></wk-radio>
      <wk-radio label="Phone" .choiceValue=${"phone"} checked></wk-radio>
      <wk-radio label="Post" .choiceValue=${"post"}></wk-radio>
    </wk-radio-group>`},i={render:()=>e`<wk-radio-group name="contact" label="Contact method">
      <wk-radio label="Email" .choiceValue=${"email"}></wk-radio>
      <wk-radio label="Phone (unavailable)" .choiceValue=${"phone"} disabled></wk-radio>
      <wk-radio label="Post" .choiceValue=${"post"}></wk-radio>
    </wk-radio-group>`},d={render:()=>e`<wk-radio-group name="contact" label="Contact method" disabled>
      <wk-radio label="Email" .choiceValue=${"email"} checked></wk-radio>
      <wk-radio label="Phone" .choiceValue=${"phone"}></wk-radio>
    </wk-radio-group>`},n={render:()=>e`<wk-radio-group
      name="contact"
      label="Contact method"
      help-text="Choose one to continue."
      required
      error="Please choose a contact method."
    >
      <wk-radio label="Email" .choiceValue=${"email"}></wk-radio>
      <wk-radio label="Phone" .choiceValue=${"phone"}></wk-radio>
    </wk-radio-group>`},t={render:()=>e`<div style="max-width: 320px">
      <wk-radio-group
        name="inspection"
        label="Which inspection should happen first?"
        help-text="Choose the work that needs the earliest appointment."
      >
        <wk-radio
          label="Inspect the full underbody and suspension for corrosion or previous repairs"
          .choiceValue=${"underbody"}
        ></wk-radio>
        <wk-radio
          label="Review the service records and any available ownership documents"
          .choiceValue=${"records"}
        ></wk-radio>
      </wk-radio-group>
    </div>`},l={render:()=>e`<div style="display:grid;gap:12px;max-width:320px">
      <wk-radio-group id="controlled-radio" name="priority" label="Inspection priority">
        <wk-radio label="Body" .choiceValue=${"body"}></wk-radio>
        <wk-radio label="Engine" .choiceValue=${"engine"}></wk-radio>
      </wk-radio-group>
      <button
        type="button"
        @click=${()=>{const a=document.querySelector("wk-radio-group#controlled-radio");a&&(a.value="engine")}}
      >
        Choose engine programmatically
      </button>
    </div>`},c={render:()=>e`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:16px"
    >
      ${["neutral","studio","fieldwork"].flatMap(a=>["light","dark"].map(p=>e`<div
              data-wk-theme=${a}
              data-wk-mode=${p}
              style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
            >
              <wk-radio-group
                name=${`priority-${a}-${p}`}
                label=${`${a} ${p}`}
                help-text="Choose one option"
              >
                <wk-radio label="Body" .choiceValue=${"body"} checked></wk-radio>
                <wk-radio label="Engine" .choiceValue=${"engine"}></wk-radio>
              </wk-radio-group>
            </div>`))}
      <div
        data-wk-theme="neutral"
        data-wk-wireframe="true"
        style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        <wk-radio-group name="priority-wireframe" label="Wireframe"
          ><wk-radio label="Body" .choiceValue=${"body"} checked></wk-radio
          ><wk-radio label="Engine" .choiceValue=${"engine"}></wk-radio
        ></wk-radio-group>
      </div>
    </div>`},s={render:()=>e`<div
      data-wk-theme="neutral"
      data-wk-mode="light"
      style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
    >
      <wk-radio-group name="outer" label="Outer neutral"
        ><wk-radio label="Body" .choiceValue=${"body"} checked></wk-radio
        ><wk-radio label="Engine" .choiceValue=${"engine"}></wk-radio
      ></wk-radio-group>
      <div
        data-wk-theme="fieldwork"
        data-wk-mode="dark"
        style="margin-top:16px;padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        <wk-radio-group name="inner" label="Inner fieldwork"
          ><wk-radio label="Body" .choiceValue=${"body"}></wk-radio
          ><wk-radio label="Engine" .choiceValue=${"engine"} checked></wk-radio
        ></wk-radio-group>
      </div>
    </div>`},m=["Default","Selected","DisabledOption","DisabledGroup","RequiredAndError","LongContent","ControlledUpdate","ThemesModesWireframe","NestedScope"];o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:"{}",...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-radio-group name="contact" label="Contact method">
      <wk-radio label="Email" .choiceValue=\${'email'}></wk-radio>
      <wk-radio label="Phone" .choiceValue=\${'phone'} checked></wk-radio>
      <wk-radio label="Post" .choiceValue=\${'post'}></wk-radio>
    </wk-radio-group>\`
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-radio-group name="contact" label="Contact method">
      <wk-radio label="Email" .choiceValue=\${'email'}></wk-radio>
      <wk-radio label="Phone (unavailable)" .choiceValue=\${'phone'} disabled></wk-radio>
      <wk-radio label="Post" .choiceValue=\${'post'}></wk-radio>
    </wk-radio-group>\`
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-radio-group name="contact" label="Contact method" disabled>
      <wk-radio label="Email" .choiceValue=\${'email'} checked></wk-radio>
      <wk-radio label="Phone" .choiceValue=\${'phone'}></wk-radio>
    </wk-radio-group>\`
}`,...d.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => html\`<wk-radio-group
      name="contact"
      label="Contact method"
      help-text="Choose one to continue."
      required
      error="Please choose a contact method."
    >
      <wk-radio label="Email" .choiceValue=\${'email'}></wk-radio>
      <wk-radio label="Phone" .choiceValue=\${'phone'}></wk-radio>
    </wk-radio-group>\`
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="max-width: 320px">
      <wk-radio-group
        name="inspection"
        label="Which inspection should happen first?"
        help-text="Choose the work that needs the earliest appointment."
      >
        <wk-radio
          label="Inspect the full underbody and suspension for corrosion or previous repairs"
          .choiceValue=\${'underbody'}
        ></wk-radio>
        <wk-radio
          label="Review the service records and any available ownership documents"
          .choiceValue=\${'records'}
        ></wk-radio>
      </wk-radio-group>
    </div>\`
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div style="display:grid;gap:12px;max-width:320px">
      <wk-radio-group id="controlled-radio" name="priority" label="Inspection priority">
        <wk-radio label="Body" .choiceValue=\${'body'}></wk-radio>
        <wk-radio label="Engine" .choiceValue=\${'engine'}></wk-radio>
      </wk-radio-group>
      <button
        type="button"
        @click=\${() => {
    const group = document.querySelector('wk-radio-group#controlled-radio') as HTMLElement & {
      value: string;
    };
    if (group) group.value = 'engine';
  }}
      >
        Choose engine programmatically
      </button>
    </div>\`
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:16px"
    >
      \${(['neutral', 'studio', 'fieldwork'] as const).flatMap(theme => (['light', 'dark'] as const).map(mode => html\`<div
              data-wk-theme=\${theme}
              data-wk-mode=\${mode}
              style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
            >
              <wk-radio-group
                name=\${\`priority-\${theme}-\${mode}\`}
                label=\${\`\${theme} \${mode}\`}
                help-text="Choose one option"
              >
                <wk-radio label="Body" .choiceValue=\${'body'} checked></wk-radio>
                <wk-radio label="Engine" .choiceValue=\${'engine'}></wk-radio>
              </wk-radio-group>
            </div>\`))}
      <div
        data-wk-theme="neutral"
        data-wk-wireframe="true"
        style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        <wk-radio-group name="priority-wireframe" label="Wireframe"
          ><wk-radio label="Body" .choiceValue=\${'body'} checked></wk-radio
          ><wk-radio label="Engine" .choiceValue=\${'engine'}></wk-radio
        ></wk-radio-group>
      </div>
    </div>\`
}`,...c.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => html\`<div
      data-wk-theme="neutral"
      data-wk-mode="light"
      style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
    >
      <wk-radio-group name="outer" label="Outer neutral"
        ><wk-radio label="Body" .choiceValue=\${'body'} checked></wk-radio
        ><wk-radio label="Engine" .choiceValue=\${'engine'}></wk-radio
      ></wk-radio-group>
      <div
        data-wk-theme="fieldwork"
        data-wk-mode="dark"
        style="margin-top:16px;padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        <wk-radio-group name="inner" label="Inner fieldwork"
          ><wk-radio label="Body" .choiceValue=\${'body'}></wk-radio
          ><wk-radio label="Engine" .choiceValue=\${'engine'} checked></wk-radio
        ></wk-radio-group>
      </div>
    </div>\`
}`,...s.parameters?.docs?.source}}};export{l as ControlledUpdate,o as Default,d as DisabledGroup,i as DisabledOption,t as LongContent,s as NestedScope,n as RequiredAndError,r as Selected,c as ThemesModesWireframe,m as __namedExportsOrder,w as default};
