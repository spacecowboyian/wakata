import{b as o}from"./iframe-DoOAqjgx.js";import"./preload-helper-PPVm8Dsz.js";const{expect:n,userEvent:g,waitFor:b,within:h}=__STORYBOOK_MODULE_TEST__,s=()=>o`
  <option value="">Choose a destination</option>
  <option value="oslo">Oslo</option>
  <option value="bergen">Bergen</option>
`,S={title:"Components/Select",tags:["autodocs"],render:()=>o`
    <wk-select name="destination" label="Destination" help-text="Choose one synthetic destination.">
      <select slot="input">
        ${s()}
      </select>
    </wk-select>
  `,parameters:{docs:{description:{component:'Single native select using Lion and the shared scalar field facade. Supply a select in slot="input", direct option children with unique string values, and an empty first option for the prompt. The closed control has a decorative chevron; the picker remains native. Browsers supporting select:open turn it upward while open; other browsers retain the downward chevron. No readonly, search, multiselect or custom popup. Native menus vary by OS; long option text may truncate in the closed control. Use wk-input for value updates and wk-change only for commit notification.'}}}},r={play:async({canvasElement:t})=>{await n(h(t).getByRole("combobox",{name:"Destination"})).toHaveValue("")}},c={render:()=>o`
    <wk-select name="destination" label="Destination" value="bergen">
      <select slot="input">
        ${s()}
      </select>
    </wk-select>
  `,play:async({canvasElement:t})=>{await n(h(t).getByRole("combobox",{name:"Destination"})).toHaveValue("bergen")}},d={render:()=>o`
    <wk-select name="destination" label="Destination" required>
      <select slot="input">
        ${s()}
      </select>
    </wk-select>
  `,play:async({canvasElement:t})=>{const e=t.querySelector("wk-select");e.submitted=!0,await e.validate(),await n(e.querySelector("select")).toHaveAttribute("aria-invalid","true"),await b(async()=>{const l=e.querySelector('[slot="feedback"]')?.shadowRoot?.textContent;await n(l).toContain("Please select an option."),await n(l).not.toContain("Please configure an error message")});const a=e.shadowRoot.querySelector(".input-group__container").getBoundingClientRect(),i=e.shadowRoot.querySelector(".form-field__feedback").getBoundingClientRect();await n(i.top-a.bottom).toBe(8)}},p={render:()=>o`
    <wk-select name="destination" label="Destination" disabled value="oslo">
      <select slot="input">
        ${s()}
      </select>
    </wk-select>
  `},u={render:()=>o`
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
  `,play:async({canvasElement:t})=>{const e=t.querySelector("wk-select"),a=e.shadowRoot,i=a.querySelector(".form-field__help-text").getBoundingClientRect(),l=a.querySelector(".input-group__container").getBoundingClientRect(),k=e.querySelector("[data-wk-external-error]").getBoundingClientRect(),f=l.top-i.bottom;await n(f).toBeGreaterThanOrEqual(8),await n(Math.abs(k.top-l.bottom-f)).toBeLessThanOrEqual(1)}},m={render:()=>o`
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
  `,play:async({canvasElement:t})=>{const e=t.querySelector("wk-select");await n(e.scrollWidth).toBeLessThanOrEqual(e.clientWidth),await n(e.querySelector("select").getBoundingClientRect().height).toBeGreaterThanOrEqual(44)}},w={render:()=>o`
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
  `,play:async({canvasElement:t})=>{const e=h(t),a=t.querySelector("wk-select");await g.click(e.getByText("Continue")),await n(a.hasFeedbackFor).toContain("error");const i=e.getByRole("combobox",{name:"Destination"});await g.selectOptions(i,"oslo"),await n(new FormData(t.querySelector("form")).get("destination")).toBe("oslo"),await g.click(e.getByText("Reset")),await n(i).toHaveValue(""),await n(a.submitted).toBe(!1)}},y={render:()=>o`
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
  `,play:async({canvasElement:t})=>{const e=[...t.querySelectorAll("wk-select")];await n(new Set(e.map(a=>getComputedStyle(a).fontFamily)).size).toBe(3),await n(new Set(e.map(a=>getComputedStyle(a.querySelector("select")).backgroundColor)).size).toBe(2)}},B=["Empty","Selected","RequiredInvalid","Disabled","HelpAndExternalError","LongContent","RealForm","ThemesModesAndWireframe"];r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByRole('combobox', {
      name: 'Destination'
    })).toHaveValue('');
  }
}`,...r.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
    const box = field.shadowRoot!.querySelector('.input-group__container')!.getBoundingClientRect();
    const feedbackBox = field.shadowRoot!.querySelector('.form-field__feedback')!.getBoundingClientRect();
    await expect(feedbackBox.top - box.bottom).toBe(8);
  }
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <wk-select name="destination" label="Destination" disabled value="oslo">
      <select slot="input">
        \${options()}
      </select>
    </wk-select>
  \`
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
  \`,
  play: async ({
    canvasElement
  }) => {
    const field = canvasElement.querySelector('wk-select')!;
    const root = field.shadowRoot!;
    const help = root.querySelector('.form-field__help-text')!.getBoundingClientRect();
    const box = root.querySelector('.input-group__container')!.getBoundingClientRect();
    const feedback = field.querySelector('[data-wk-external-error]')!.getBoundingClientRect();
    const above = box.top - help.bottom;
    await expect(above).toBeGreaterThanOrEqual(8);
    await expect(Math.abs(feedback.top - box.bottom - above)).toBeLessThanOrEqual(1);
  }
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}};export{p as Disabled,r as Empty,u as HelpAndExternalError,m as LongContent,w as RealForm,d as RequiredInvalid,c as Selected,y as ThemesModesAndWireframe,B as __namedExportsOrder,S as default};
