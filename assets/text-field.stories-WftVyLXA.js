import{b as s}from"./iframe-CIX4NnH9.js";import"./preload-helper-PPVm8Dsz.js";const{expect:a,userEvent:i,within:B}=__STORYBOOK_MODULE_TEST__,q=["neutral","studio","fieldwork"],$=["light","dark"],R={title:"Components/Text Field",tags:["autodocs"],parameters:{docs:{description:{component:"\n`<wk-text-field>` is a Lion `LionInput` with Wakata's shared scalar form behavior.\nThe supported native types are `text`, `email`, and `password`. Use a visible label,\nand use `help-text` for persistent guidance. Required and email checks use Lion validators\nas well as the native input semantics. External `error` text remains distinct from validation feedback.\n\nProgrammatic value updates and reset do not emit Wakata input events. User edits emit `wk-input`;\nthe native commit boundary emits `wk-change`. Do not use both events as duplicate state-update paths.\nThe password story intentionally contains no password value and no action logger.\n\nAutomated browser checks run in Chromium only. Manual assistive-technology, cross-browser and\nframework-wrapper checks have not been run.\n"}}},argTypes:{label:{control:"text",description:"Visible label."},type:{control:"select",options:["text","email","password"],description:"Native input type.",table:{defaultValue:{summary:"text"}}},required:{control:"boolean",description:"Native and Lion required validation."},disabled:{control:"boolean",description:"Native disabled behavior; excluded from FormData."},readOnly:{control:"boolean",name:"readonly",description:"Native read-only behavior."},placeholder:{control:"text",description:"Native input hint; not a label."},helpText:{control:"text",description:"Persistent help text."},error:{control:"text",description:"External error text."}},args:{label:"Display name",type:"text",required:!1,disabled:!1,readOnly:!1,placeholder:"",helpText:"",error:""},render:e=>s`<wk-text-field
      name="displayName"
      label=${e.label}
      type=${e.type}
      ?required=${e.required}
      ?disabled=${e.disabled}
      ?readonly=${e.readOnly}
      placeholder=${e.placeholder}
      help-text=${e.helpText}
      error=${e.error}
    ></wk-text-field>`},l={},d={args:{label:"Work email",type:"email",placeholder:"name@example.test",helpText:"We will use this address for account updates."},play:async({canvasElement:e})=>{const t=B(e).getByRole("textbox",{name:"Work email"});await a(t).toHaveValue(""),await a(t).toHaveAttribute("placeholder","name@example.test")}},c={play:async({canvasElement:e})=>{const t=B(e).getByRole("textbox",{name:"Display name"});await i.tab(),await a(t).toHaveFocus(),await a(getComputedStyle(t).outlineStyle).toBe("solid"),await a(Number.parseFloat(getComputedStyle(t).outlineWidth)).toBeGreaterThan(0)}},p={render:e=>s`<wk-text-field
      name="displayName"
      label=${e.label}
      value="Bergen"
      type=${e.type}
    ></wk-text-field>`},u={args:{required:!0},play:async({canvasElement:e})=>{const t=e.querySelector("wk-text-field"),n=t.querySelector("input");t.submitted=!0,await t.validate(),await a(n.required).toBe(!0),await a(n.getAttribute("aria-required")).toBe("true"),await a(n.getAttribute("aria-invalid")).toBe("true")}},m={args:{disabled:!0},play:async({canvasElement:e})=>{const t=e.querySelector("wk-text-field");await t.updateComplete,await a(t.querySelector("input").disabled).toBe(!0)}},y={args:{readOnly:!0},play:async({canvasElement:e})=>{const t=e.querySelector("wk-text-field");await t.updateComplete,await a(t.querySelector("input").readOnly).toBe(!0)}},w={name:"Disabled and read-only",render:()=>s`<div style="display:grid;gap:16px;max-width:32rem">
      <wk-text-field
        name="disabledValue"
        label="Disabled"
        value="Unavailable value"
        disabled
      ></wk-text-field>
      <wk-text-field
        name="readOnlyValue"
        label="Read only"
        value="Available to copy and submit"
        readonly
      ></wk-text-field>
    </div>`,play:async({canvasElement:e})=>{const t=[...e.querySelectorAll("wk-text-field")];await a(t[0]?.querySelector("input")?.disabled).toBe(!0),await a(t[1]?.querySelector("input")?.readOnly).toBe(!0)}},x={args:{helpText:"Use the address associated with your account.",error:"This address is already in use."},play:async({canvasElement:e})=>{const t=B(e).getByRole("textbox",{name:"Display name"});await a(t).toHaveAttribute("aria-invalid","true");const n=(t.getAttribute("aria-describedby")??"").split(" ").map(o=>document.getElementById(o)?.textContent?.trim());await a(n).toContain("Use the address associated with your account."),await a(n).toContain("This address is already in use.")}},h={},f={args:{label:"Email address",type:"email"}},g={args:{label:"Password",type:"password"},parameters:{docs:{description:{story:"Shows the native password control without a sample value."}}}},b={args:{label:"Name to display on the account, including any regional or departmental information that helps colleagues identify you",helpText:"This information is visible to colleagues in every workspace and may wrap across several lines on narrow screens."},decorators:[e=>s`<div style="max-width:320px">${e()}</div>`]},v={args:{label:"Work email",type:"email",helpText:"Used for account updates."},decorators:[e=>s`<div data-testid="narrow" style="width:280px">${e()}</div>`],play:async({canvasElement:e})=>{const t=e.querySelector('[data-testid="narrow"]');await a(t.scrollWidth).toBeLessThanOrEqual(t.clientWidth);const n=t.querySelector("input");await a(n.getBoundingClientRect().width).toBeGreaterThan(0),await a(n.getBoundingClientRect().width).toBeLessThanOrEqual(t.clientWidth)}},k={args:{type:"email",label:"Email address",required:!0},render:e=>s`<wk-form
      ><form novalidate style="display:grid;gap:12px;max-width:24rem">
        <wk-text-field
          name="email"
          type=${e.type}
          label=${e.label}
          ?required=${e.required}
          help-text="A synthetic address for this form example."
        ></wk-text-field>
        <div style="display:flex;gap:8px">
          <wk-button-submit variant="primary">Continue</wk-button-submit>
          <wk-button-reset>Reset</wk-button-reset>
        </div>
      </form></wk-form
    >`,play:async({canvasElement:e})=>{const t=B(e),n=e.querySelector("wk-form"),o=e.querySelector("wk-text-field"),r=t.getByRole("textbox",{name:"Email address"});let E=0;n.addEventListener("submit",()=>E++),await i.click(t.getByText("Continue")),await a(E).toBe(1),await a(o.hasFeedbackFor).toContain("error"),await i.type(r,"person@example.test"),await i.click(t.getByText("Continue")),await a(E).toBe(2),await i.click(t.getByText("Reset")),await a(r.value).toBe("")}},S={name:"Themes, light/dark and wireframe",parameters:{docs:{description:{story:"Each cell uses an explicit theme root so adjacent themes and modes stay isolated."}}},render:()=>s`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:16px"
    >
      ${q.flatMap(e=>$.flatMap(t=>["false","true"].map(n=>s`<div
                data-wk-theme=${e}
                data-wk-mode=${t}
                data-wk-wireframe=${n}
                data-cell=${`${e}-${t}-${n}`}
                style="padding:12px;background:${t==="dark"?"#171717":"#fff"};color:${t==="dark"?"#fff":"#111"}"
              >
                <wk-text-field
                  label="Contact"
                  help-text="A synthetic contact value."
                ></wk-text-field>
              </div>`)))}
    </div>`,play:async({canvasElement:e})=>{const t=r=>e.querySelector(`[data-cell="${r}"] wk-text-field`),n=r=>t(r).shadowRoot.querySelector(".input-group__container"),o=q.map(r=>getComputedStyle(t(`${r}-light-false`)).fontFamily);await a(new Set(o).size).toBe(3);for(const r of q)await a(getComputedStyle(n(`${r}-light-false`)).backgroundColor).not.toBe(getComputedStyle(n(`${r}-dark-false`)).backgroundColor),await a(getComputedStyle(n(`${r}-light-true`)).borderRadius).toBe("0px")}},A=["Playground","Empty","Focus","Filled","RequiredInvalid","Disabled","ReadOnly","DisabledAndReadOnly","HelpAndExternalError","Text","Email","Password","LongLabelAndHelp","NarrowReflow","RealForm","ThemesModesAndWireframe"];l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:"{}",...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Work email',
    type: 'email',
    placeholder: 'name@example.test',
    helpText: 'We will use this address for account updates.'
  },
  play: async ({
    canvasElement
  }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Work email'
    });
    await expect(input).toHaveValue('');
    await expect(input).toHaveAttribute('placeholder', 'name@example.test');
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Display name'
    });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await expect(getComputedStyle(input).outlineStyle).toBe('solid');
    await expect(Number.parseFloat(getComputedStyle(input).outlineWidth)).toBeGreaterThan(0);
  }
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: args => html\`<wk-text-field
      name="displayName"
      label=\${args.label}
      value="Bergen"
      type=\${args.type}
    ></wk-text-field>\`
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    required: true
  },
  play: async ({
    canvasElement
  }) => {
    const field = canvasElement.querySelector('wk-text-field') as WkTextField;
    const input = field.querySelector('input')!;
    field.submitted = true;
    await field.validate();
    await expect(input.required).toBe(true);
    await expect(input.getAttribute('aria-required')).toBe('true');
    await expect(input.getAttribute('aria-invalid')).toBe('true');
  }
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  },
  play: async ({
    canvasElement
  }) => {
    const field = canvasElement.querySelector('wk-text-field') as WkTextField;
    await field.updateComplete;
    await expect(field.querySelector('input')!.disabled).toBe(true);
  }
}`,...m.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    readOnly: true
  },
  play: async ({
    canvasElement
  }) => {
    const field = canvasElement.querySelector('wk-text-field') as WkTextField;
    await field.updateComplete;
    await expect(field.querySelector('input')!.readOnly).toBe(true);
  }
}`,...y.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'Disabled and read-only',
  render: () => html\`<div style="display:grid;gap:16px;max-width:32rem">
      <wk-text-field
        name="disabledValue"
        label="Disabled"
        value="Unavailable value"
        disabled
      ></wk-text-field>
      <wk-text-field
        name="readOnlyValue"
        label="Read only"
        value="Available to copy and submit"
        readonly
      ></wk-text-field>
    </div>\`,
  play: async ({
    canvasElement
  }) => {
    const fields = [...canvasElement.querySelectorAll('wk-text-field')] as WkTextField[];
    await expect(fields[0]?.querySelector('input')?.disabled).toBe(true);
    await expect(fields[1]?.querySelector('input')?.readOnly).toBe(true);
  }
}`,...w.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    helpText: 'Use the address associated with your account.',
    error: 'This address is already in use.'
  },
  play: async ({
    canvasElement
  }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Display name'
    });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    const descriptions = (input.getAttribute('aria-describedby') ?? '').split(' ').map(id => document.getElementById(id)?.textContent?.trim());
    await expect(descriptions).toContain('Use the address associated with your account.');
    await expect(descriptions).toContain('This address is already in use.');
  }
}`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:"{}",...h.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Email address',
    type: 'email'
  }
}`,...f.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Password',
    type: 'password'
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the native password control without a sample value.'
      }
    }
  }
}`,...g.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Name to display on the account, including any regional or departmental information that helps colleagues identify you',
    helpText: 'This information is visible to colleagues in every workspace and may wrap across several lines on narrow screens.'
  },
  decorators: [story => html\`<div style="max-width:320px">\${story()}</div>\`]
}`,...b.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Work email',
    type: 'email',
    helpText: 'Used for account updates.'
  },
  decorators: [story => html\`<div data-testid="narrow" style="width:280px">\${story()}</div>\`],
  play: async ({
    canvasElement
  }) => {
    const host = canvasElement.querySelector('[data-testid="narrow"]') as HTMLElement;
    await expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth);
    const input = host.querySelector('input')!;
    await expect(input.getBoundingClientRect().width).toBeGreaterThan(0);
    await expect(input.getBoundingClientRect().width).toBeLessThanOrEqual(host.clientWidth);
  }
}`,...v.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    type: 'email',
    label: 'Email address',
    required: true
  },
  render: args => html\`<wk-form
      ><form novalidate style="display:grid;gap:12px;max-width:24rem">
        <wk-text-field
          name="email"
          type=\${args.type}
          label=\${args.label}
          ?required=\${args.required}
          help-text="A synthetic address for this form example."
        ></wk-text-field>
        <div style="display:flex;gap:8px">
          <wk-button-submit variant="primary">Continue</wk-button-submit>
          <wk-button-reset>Reset</wk-button-reset>
        </div>
      </form></wk-form
    >\`,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const form = canvasElement.querySelector('wk-form')!;
    const field = canvasElement.querySelector('wk-text-field') as WkTextField;
    const input = canvas.getByRole('textbox', {
      name: 'Email address'
    });
    let attempts = 0;
    form.addEventListener('submit', () => attempts++);
    await userEvent.click(canvas.getByText('Continue'));
    await expect(attempts).toBe(1);
    await expect(field.hasFeedbackFor).toContain('error');
    await userEvent.type(input, 'person@example.test');
    await userEvent.click(canvas.getByText('Continue'));
    await expect(attempts).toBe(2);
    await userEvent.click(canvas.getByText('Reset'));
    await expect((input as HTMLInputElement).value).toBe('');
  }
}`,...k.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'Themes, light/dark and wireframe',
  parameters: {
    docs: {
      description: {
        story: 'Each cell uses an explicit theme root so adjacent themes and modes stay isolated.'
      }
    }
  },
  render: () => html\`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:16px"
    >
      \${themes.flatMap(theme => modes.flatMap(mode => ['false', 'true'].map(wireframe => html\`<div
                data-wk-theme=\${theme}
                data-wk-mode=\${mode}
                data-wk-wireframe=\${wireframe}
                data-cell=\${\`\${theme}-\${mode}-\${wireframe}\`}
                style="padding:12px;background:\${mode === 'dark' ? '#171717' : '#fff'};color:\${mode === 'dark' ? '#fff' : '#111'}"
              >
                <wk-text-field
                  label="Contact"
                  help-text="A synthetic contact value."
                ></wk-text-field>
              </div>\`)))}
    </div>\`,
  play: async ({
    canvasElement
  }) => {
    const field = (cell: string) => canvasElement.querySelector(\`[data-cell="\${cell}"] wk-text-field\`)!;
    const container = (cell: string) => field(cell).shadowRoot!.querySelector('.input-group__container')!;
    const fonts = themes.map(theme => getComputedStyle(field(\`\${theme}-light-false\`)).fontFamily);
    await expect(new Set(fonts).size).toBe(3);
    for (const theme of themes) {
      await expect(getComputedStyle(container(\`\${theme}-light-false\`)).backgroundColor).not.toBe(getComputedStyle(container(\`\${theme}-dark-false\`)).backgroundColor);
      await expect(getComputedStyle(container(\`\${theme}-light-true\`)).borderRadius).toBe('0px');
    }
  }
}`,...S.parameters?.docs?.source}}};export{m as Disabled,w as DisabledAndReadOnly,f as Email,d as Empty,p as Filled,c as Focus,x as HelpAndExternalError,b as LongLabelAndHelp,v as NarrowReflow,g as Password,l as Playground,y as ReadOnly,k as RealForm,u as RequiredInvalid,h as Text,S as ThemesModesAndWireframe,A as __namedExportsOrder,R as default};
