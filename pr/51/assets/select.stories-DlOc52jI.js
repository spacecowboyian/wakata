import{b as o}from"./iframe-rLVFa9xC.js";import"./preload-helper-PPVm8Dsz.js";const{expect:n,userEvent:w,waitFor:k,within:y}=__STORYBOOK_MODULE_TEST__,s=()=>o`
  <option value="">Choose a destination</option>
  <option value="oslo">Oslo</option>
  <option value="bergen">Bergen</option>
`,f={title:"Components/Select",tags:["autodocs"],render:()=>o`
    <wk-select name="destination" label="Destination" help-text="Choose one synthetic destination.">
      <select slot="input">
        ${s()}
      </select>
    </wk-select>
  `,parameters:{docs:{description:{component:'Single native select using Lion and the shared scalar field facade. Supply a select in slot="input", direct option children with unique string values, and an empty first option for the prompt. The closed control has a decorative chevron; the picker remains native. Browsers supporting select:open turn it upward while open; other browsers retain the downward chevron. No readonly, search, multiselect or custom popup. Native menus vary by OS; long option text may truncate in the closed control. Use wk-input for value updates and wk-change only for commit notification.'}}}},i={play:async({canvasElement:t})=>{await n(y(t).getByRole("combobox",{name:"Destination"})).toHaveValue("")}},l={render:()=>o`
    <wk-select name="destination" label="Destination" value="bergen">
      <select slot="input">
        ${s()}
      </select>
    </wk-select>
  `,play:async({canvasElement:t})=>{await n(y(t).getByRole("combobox",{name:"Destination"})).toHaveValue("bergen")}},r={render:()=>o`
    <wk-select name="destination" label="Destination" required>
      <select slot="input">
        ${s()}
      </select>
    </wk-select>
  `,play:async({canvasElement:t})=>{const e=t.querySelector("wk-select");e.submitted=!0,await e.validate(),await n(e.querySelector("select")).toHaveAttribute("aria-invalid","true"),await k(async()=>{const a=e.querySelector('[slot="feedback"]')?.shadowRoot?.textContent;await n(a).toContain("Please select an option."),await n(a).not.toContain("Please configure an error message")})}},c={render:()=>o`
    <wk-select name="destination" label="Destination" disabled value="oslo">
      <select slot="input">
        ${s()}
      </select>
    </wk-select>
  `},d={render:()=>o`
    <wk-select
      name="destination"
      label="Destination"
      help-text="Choose one synthetic destination."
      error="This destination is temporarily unavailable."
    >
      <select slot="input">
        ${s()}
      </select>
    </wk-select>
  `},p={render:()=>o`
    <div style="max-width:280px">
      <wk-select
        label="Destination for the next synthetic regional planning workshop and team gathering"
        help-text="Native menus control their own wrapping and may truncate long option names."
      >
        <select slot="input">
          <option value="">Choose a destination</option>
          <option value="long">
            A very long synthetic destination name for a regional workshop
          </option>
        </select>
      </wk-select>
    </div>
  `,play:async({canvasElement:t})=>{const e=t.querySelector("wk-select");await n(e.scrollWidth).toBeLessThanOrEqual(e.clientWidth),await n(e.querySelector("select").getBoundingClientRect().height).toBeGreaterThanOrEqual(44)}},m={render:()=>o`
    <wk-form>
      <form novalidate style="display:grid;gap:12px;max-width:24rem">
        <wk-select name="destination" label="Destination" required>
          <select slot="input">
            ${s()}
          </select>
        </wk-select>
        <div style="display:flex;gap:8px">
          <wk-button-submit variant="primary">Continue</wk-button-submit>
          <wk-button-reset>Reset</wk-button-reset>
        </div>
      </form>
    </wk-form>
  `,play:async({canvasElement:t})=>{const e=y(t),a=t.querySelector("wk-select");await w.click(e.getByText("Continue")),await n(a.hasFeedbackFor).toContain("error");const h=e.getByRole("combobox",{name:"Destination"});await w.selectOptions(h,"oslo"),await n(new FormData(t.querySelector("form")).get("destination")).toBe("oslo"),await w.click(e.getByText("Reset")),await n(h).toHaveValue(""),await n(a.submitted).toBe(!1)}},u={render:()=>o`
    <div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:16px"
    >
      ${["neutral","studio","fieldwork"].flatMap(t=>["light","dark"].flatMap(e=>["false","true"].map(a=>o`
              <div
                data-wk-theme=${t}
                data-wk-mode=${e}
                data-wk-wireframe=${a}
                style="padding:12px;background:var(--wk-surface);color:var(--wk-text)"
              >
                <wk-select label="${t} ${e}" help-text="Synthetic destination">
                  <select slot="input">
                    ${s()}
                  </select>
                </wk-select>
              </div>
            `)))}
    </div>
  `,play:async({canvasElement:t})=>{const e=[...t.querySelectorAll("wk-select")];await n(new Set(e.map(a=>getComputedStyle(a).fontFamily)).size).toBe(3),await n(new Set(e.map(a=>getComputedStyle(a.querySelector("select")).backgroundColor)).size).toBe(2)}},b=["Empty","Selected","RequiredInvalid","Disabled","HelpAndExternalError","LongContent","RealForm","ThemesModesAndWireframe"];i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByRole('combobox', {
      name: 'Destination'
    })).toHaveValue('');
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <wk-select name="destination" label="Destination" value="bergen">
      <select slot="input">
        \${options()}
      </select>
    </wk-select>
  \`,
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByRole('combobox', {
      name: 'Destination'
    })).toHaveValue('bergen');
  }
}`,...l.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <wk-select name="destination" label="Destination" required>
      <select slot="input">
        \${options()}
      </select>
    </wk-select>
  \`,
  play: async ({
    canvasElement
  }) => {
    const field = canvasElement.querySelector('wk-select') as WkSelect;
    field.submitted = true;
    await field.validate();
    await expect(field.querySelector('select')).toHaveAttribute('aria-invalid', 'true');
    await waitFor(async () => {
      const feedback = field.querySelector('[slot="feedback"]')?.shadowRoot?.textContent;
      await expect(feedback).toContain('Please select an option.');
      await expect(feedback).not.toContain('Please configure an error message');
    });
  }
}`,...r.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <wk-select name="destination" label="Destination" disabled value="oslo">
      <select slot="input">
        \${options()}
      </select>
    </wk-select>
  \`
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <wk-select
      name="destination"
      label="Destination"
      help-text="Choose one synthetic destination."
      error="This destination is temporarily unavailable."
    >
      <select slot="input">
        \${options()}
      </select>
    </wk-select>
  \`
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div style="max-width:280px">
      <wk-select
        label="Destination for the next synthetic regional planning workshop and team gathering"
        help-text="Native menus control their own wrapping and may truncate long option names."
      >
        <select slot="input">
          <option value="">Choose a destination</option>
          <option value="long">
            A very long synthetic destination name for a regional workshop
          </option>
        </select>
      </wk-select>
    </div>
  \`,
  play: async ({
    canvasElement
  }) => {
    const field = canvasElement.querySelector('wk-select')!;
    await expect(field.scrollWidth).toBeLessThanOrEqual(field.clientWidth);
    await expect(field.querySelector('select')!.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  }
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <wk-form>
      <form novalidate style="display:grid;gap:12px;max-width:24rem">
        <wk-select name="destination" label="Destination" required>
          <select slot="input">
            \${options()}
          </select>
        </wk-select>
        <div style="display:flex;gap:8px">
          <wk-button-submit variant="primary">Continue</wk-button-submit>
          <wk-button-reset>Reset</wk-button-reset>
        </div>
      </form>
    </wk-form>
  \`,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const field = canvasElement.querySelector('wk-select') as WkSelect;
    await userEvent.click(canvas.getByText('Continue'));
    await expect(field.hasFeedbackFor).toContain('error');
    const select = canvas.getByRole('combobox', {
      name: 'Destination'
    });
    await userEvent.selectOptions(select, 'oslo');
    await expect(new FormData(canvasElement.querySelector('form')!).get('destination')).toBe('oslo');
    await userEvent.click(canvas.getByText('Reset'));
    await expect(select).toHaveValue('');
    await expect(field.submitted).toBe(false);
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:16px"
    >
      \${['neutral', 'studio', 'fieldwork'].flatMap(theme => ['light', 'dark'].flatMap(mode => ['false', 'true'].map(wireframe => html\`
              <div
                data-wk-theme=\${theme}
                data-wk-mode=\${mode}
                data-wk-wireframe=\${wireframe}
                style="padding:12px;background:var(--wk-surface);color:var(--wk-text)"
              >
                <wk-select label="\${theme} \${mode}" help-text="Synthetic destination">
                  <select slot="input">
                    \${options()}
                  </select>
                </wk-select>
              </div>
            \`)))}
    </div>
  \`,
  play: async ({
    canvasElement
  }) => {
    const fields = [...canvasElement.querySelectorAll('wk-select')];
    await expect(new Set(fields.map(field => getComputedStyle(field).fontFamily)).size).toBe(3);
    await expect(new Set(fields.map(field => getComputedStyle(field.querySelector('select')!).backgroundColor)).size).toBe(2);
  }
}`,...u.parameters?.docs?.source}}};export{c as Disabled,i as Empty,d as HelpAndExternalError,p as LongContent,m as RealForm,r as RequiredInvalid,l as Selected,u as ThemesModesAndWireframe,b as __namedExportsOrder,f as default};
