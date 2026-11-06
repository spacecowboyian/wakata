import{b as a}from"./iframe-BTaqqi5X.js";import"./preload-helper-PPVm8Dsz.js";const{expect:o,userEvent:h,waitFor:v,within:g}=__STORYBOOK_MODULE_TEST__,i=()=>a`
  <option value="">Choose a destination</option>
  <option value="oslo">Oslo</option>
  <option value="bergen">Bergen</option>
`,x=["neutral","studio","fieldwork"],S=["light","dark"],B=async(t,e)=>{const n=getComputedStyle(e);await o(n.outlineStyle).toBe("solid"),await o(n.outlineWidth).toBe("2px"),await o(n.outlineOffset).toBe("2px"),await o(n.borderTopLeftRadius).toBe(getComputedStyle(t).getPropertyValue("--wk-radius").trim()||"0px")},E={title:"Components/Select",tags:["autodocs"],render:()=>a`
    <wk-select name="destination" label="Destination" help-text="Choose one synthetic destination.">
      <select slot="input">
        ${i()}
      </select>
    </wk-select>
  `,parameters:{docs:{description:{component:'Single native select using Lion and the shared scalar field facade. Supply a select in slot="input", direct option children with unique string values, and an empty first option for the prompt. The closed control has a decorative chevron; the picker remains native. Browsers supporting select:open turn it upward while open; other browsers retain the downward chevron. No readonly, search, multiselect or custom popup. Native menus vary by OS; long option text may truncate in the closed control. Use wk-input for value updates and wk-change only for commit notification.'}}}},r={play:async({canvasElement:t})=>{await o(g(t).getByRole("combobox",{name:"Destination"})).toHaveValue("")}},c={render:()=>a`
    ${x.flatMap(t=>S.map(e=>a`<div
            data-wk-theme=${t}
            data-wk-mode=${e}
            style="padding:12px;background:var(--wk-surface, #fff)"
          >
            <wk-select name="focus-${t}-${e}" label="Destination">
              <select slot="input">
                ${i()}
              </select>
            </wk-select>
          </div>`))}
  `,play:async({canvasElement:t})=>{const e=Array.from(t.querySelectorAll("wk-select"));for(const n of e){const s=n.querySelector('[slot="input"]');await h.tab(),await o(s).toHaveFocus(),await B(n,s)}}},d={render:()=>a`
    <wk-select name="destination" label="Destination" value="bergen">
      <select slot="input">
        ${i()}
      </select>
    </wk-select>
  `,play:async({canvasElement:t})=>{await o(g(t).getByRole("combobox",{name:"Destination"})).toHaveValue("bergen")}},p={render:()=>a`
    <wk-select name="destination" label="Destination" required>
      <select slot="input">
        ${i()}
      </select>
    </wk-select>
  `,play:async({canvasElement:t})=>{const e=t.querySelector("wk-select");e.submitted=!0,await e.validate(),await o(e.querySelector("select")).toHaveAttribute("aria-invalid","true"),await v(async()=>{const l=e.querySelector('[slot="feedback"]')?.shadowRoot?.textContent;await o(l).toContain("Please select an option."),await o(l).not.toContain("Please configure an error message")});const n=e.shadowRoot.querySelector(".input-group__container").getBoundingClientRect(),s=e.shadowRoot.querySelector(".form-field__feedback").getBoundingClientRect();await o(s.top-n.bottom).toBe(8)}},u={render:()=>a`
    <wk-select name="destination" label="Destination" disabled value="oslo">
      <select slot="input">
        ${i()}
      </select>
    </wk-select>
  `},m={render:()=>a`
    <wk-select
      name="destination"
      label="Destination"
      help-text="Choose one synthetic destination."
      error="This destination is temporarily unavailable."
    >
      <select slot="input">
        ${i()}
      </select>
    </wk-select>
  `,play:async({canvasElement:t})=>{const e=t.querySelector("wk-select"),n=e.shadowRoot,s=n.querySelector(".form-field__help-text").getBoundingClientRect(),l=n.querySelector(".input-group__container").getBoundingClientRect(),b=e.querySelector("[data-wk-external-error]").getBoundingClientRect(),k=l.top-s.bottom;await o(k).toBeGreaterThanOrEqual(8),await o(Math.abs(b.top-l.bottom-k)).toBeLessThanOrEqual(1)}},w={render:()=>a`
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
  `,play:async({canvasElement:t})=>{const e=t.querySelector("wk-select");await o(e.scrollWidth).toBeLessThanOrEqual(e.clientWidth),await o(e.querySelector("select").getBoundingClientRect().height).toBeGreaterThanOrEqual(44)}},y={render:()=>a`
    <wk-form>
      <form novalidate style="display:grid;gap:12px;max-width:24rem">
        <wk-select name="destination" label="Destination" required>
          <select slot="input">
            ${i()}
          </select>
        </wk-select>
        <div style="display:flex;gap:8px">
          <wk-button-submit variant="primary">Continue</wk-button-submit>
          <wk-button-reset>Reset</wk-button-reset>
        </div>
      </form>
    </wk-form>
  `,play:async({canvasElement:t})=>{const e=g(t),n=t.querySelector("wk-select");await h.click(e.getByText("Continue")),await o(n.hasFeedbackFor).toContain("error");const s=e.getByRole("combobox",{name:"Destination"});await h.selectOptions(s,"oslo"),await o(new FormData(t.querySelector("form")).get("destination")).toBe("oslo"),await h.click(e.getByText("Reset")),await o(s).toHaveValue(""),await o(n.submitted).toBe(!1)}},f={render:()=>a`
    <div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:16px"
    >
      ${["neutral","studio","fieldwork"].flatMap(t=>["light","dark"].flatMap(e=>["false","true"].map(n=>a`
              <div
                data-wk-theme=${t}
                data-wk-mode=${e}
                data-wk-wireframe=${n}
                style="padding:12px;background:var(--wk-surface);color:var(--wk-text)"
              >
                <wk-select label="${t} ${e}" help-text="Synthetic destination">
                  <select slot="input">
                    ${i()}
                  </select>
                </wk-select>
              </div>
            `)))}
    </div>
  `,play:async({canvasElement:t})=>{const e=[...t.querySelectorAll("wk-select")];await o(new Set(e.map(n=>getComputedStyle(n).fontFamily)).size).toBe(3),await o(new Set(e.map(n=>getComputedStyle(n.querySelector("select")).backgroundColor)).size).toBe(2)}},$=["Empty","Focus","Selected","RequiredInvalid","Disabled","HelpAndExternalError","LongContent","RealForm","ThemesModesAndWireframe"];r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    await expect(within(canvasElement).getByRole('combobox', {
      name: 'Destination'
    })).toHaveValue('');
  }
}`,...r.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    \${focusThemes.flatMap(theme => focusModes.map(mode => html\`<div
            data-wk-theme=\${theme}
            data-wk-mode=\${mode}
            style="padding:12px;background:var(--wk-surface, #fff)"
          >
            <wk-select name="focus-\${theme}-\${mode}" label="Destination">
              <select slot="input">
                \${options()}
              </select>
            </wk-select>
          </div>\`))}
  \`,
  play: async ({
    canvasElement
  }) => {
    const hosts = Array.from(canvasElement.querySelectorAll('wk-select'));
    for (const host of hosts) {
      const control = host.querySelector('[slot="input"]')!;
      await userEvent.tab();
      await expect(control).toHaveFocus();
      await expectFocusGeometry(host, control);
    }
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => html\`
    <wk-select name="destination" label="Destination" disabled value="oslo">
      <select slot="input">
        \${options()}
      </select>
    </wk-select>
  \`
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
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
}`,...w.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
}`,...y.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}};export{u as Disabled,r as Empty,c as Focus,m as HelpAndExternalError,w as LongContent,y as RealForm,p as RequiredInvalid,d as Selected,f as ThemesModesAndWireframe,$ as __namedExportsOrder,E as default};
