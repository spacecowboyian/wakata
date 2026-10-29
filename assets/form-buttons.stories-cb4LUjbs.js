import{b as o}from"./iframe-DeFYSg41.js";import"./preload-helper-PPVm8Dsz.js";const{expect:n,fn:g,userEvent:r,within:w}=__STORYBOOK_MODULE_TEST__,b=["neutral","studio","fieldwork"],v=["light","dark"],S={title:"Components/Form buttons",tags:["autodocs"],parameters:{docs:{description:{component:'\n`<wk-button-submit>` and `<wk-button-reset>` are Wakata subclasses of Lion\'s `LionButtonSubmit` and\n`LionButtonReset`. They act on the closest native `<form>` ancestor **in the same DOM tree**: click, Enter,\nSpace and implicit submission from fields all behave natively, and an invalid form does not submit.\nThey share the `variant`, `intent` and `size` appearance of `<wk-button>`: affirmative actions use\n`variant="primary"`; `intent="danger"` is red and for destructive actions; green is never a Button action.\n\n**Known gap:** there is no `loading` state for form buttons. Lion handles click delegation in its own\nconstructor, so blocking it needs a private API or a global listener; neither is used. Disable the form or\nfields while submitting instead.\n'}}},args:{onSubmit:g()}},y=a=>e=>{e.preventDefault(),a.onSubmit(new FormData(e.target).get("city"))},f=a=>o`<form @submit=${y(a)} style="display:grid;gap:12px;max-width:20rem">
    <label style="display:grid;gap:4px">City <input name="city" value="Oslo" required /> </label>
    <div style="display:flex;gap:12px">
      <wk-button-submit variant="primary">Send</wk-button-submit>
      <wk-button-reset>Reset</wk-button-reset>
    </div>
  </form>`,l={render:f,play:async({canvasElement:a,args:e})=>{const t=w(a),s=t.getByLabelText("City");await r.click(t.getByText("Send")),await n(e.onSubmit).toHaveBeenCalledTimes(1),await n(e.onSubmit).toHaveBeenLastCalledWith("Oslo"),await r.clear(s),await r.click(t.getByText("Send")),await n(e.onSubmit).toHaveBeenCalledTimes(1),await r.type(s,"Bergen"),await r.click(t.getByText("Reset")),await n(s.value).toBe("Oslo")}},m={name:"Keyboard and implicit submit",render:f,play:async({canvasElement:a,args:e})=>{const t=w(a);t.getByText("Send").focus(),await r.keyboard("{Enter}"),await n(e.onSubmit).toHaveBeenCalledTimes(1),await r.keyboard(" "),await n(e.onSubmit).toHaveBeenCalledTimes(2),await r.click(t.getByLabelText("City")),await r.keyboard("{Enter}"),await n(e.onSubmit).toHaveBeenCalledTimes(3)}},d={render:a=>o`<form @submit=${y(a)} style="display:flex;gap:12px">
      <input name="city" value="Oslo" aria-label="City" />
      <wk-button-submit variant="primary" disabled>Send</wk-button-submit>
    </form>`,play:async({canvasElement:a,args:e})=>{const t=a.querySelector("wk-button-submit");await t.updateComplete,t.click(),await n(e.onSubmit).not.toHaveBeenCalled(),await n(t.tabIndex).toBe(-1)}},c={render:()=>o`<form style="display:flex;gap:12px">
      <wk-button-submit variant="primary">Save</wk-button-submit>
      <wk-button-reset intent="danger">Discard changes</wk-button-reset>
    </form>`},i={name:"Themes, light/dark and wireframe",parameters:{docs:{description:{story:"Illustrative: each cell sets its own `data-wk-theme`, `data-wk-mode` and `data-wk-wireframe` root."}}},render:()=>o`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:12px"
    >
      ${b.flatMap(a=>v.flatMap(e=>["false","true"].map(t=>o`<form
                data-wk-theme=${a}
                data-wk-mode=${e}
                data-wk-wireframe=${t}
                data-cell=${`${a}-${e}-${t}`}
                style="padding:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:${e==="dark"?"#171717":"#fff"};color:${e==="dark"?"#fff":"#111"}"
              >
                <span>${a} ${e}${t==="true"?" wireframe":""}</span>
                <wk-button-submit variant="primary">Send</wk-button-submit>
                <wk-button-reset intent="danger">Discard</wk-button-reset>
              </form>`)))}
    </div>`,play:async({canvasElement:a})=>{const e=(t,s)=>getComputedStyle(a.querySelector(`[data-cell=${t}] ${s}`));for(const t of b){const s=e(`${t}-light-false`,"wk-button-submit"),k=e(`${t}-dark-false`,"wk-button-submit");await n(s.backgroundColor).not.toBe(k.backgroundColor);const p=e(`${t}-light-false`,"wk-button-reset"),u=e(`${t}-light-true`,"wk-button-reset");await n(u.borderRadius).toBe("0px"),await n(u.color).toBe(p.color),await n(u.borderColor).toBe(p.borderColor)}}},B=["SubmitAndReset","KeyboardSubmit","Disabled","DestructiveReset","ThemeModeWireframeMatrix"];l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: form,
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('City') as HTMLInputElement;
    await userEvent.click(canvas.getByText('Send'));
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    await expect(args.onSubmit).toHaveBeenLastCalledWith('Oslo');
    await userEvent.clear(input);
    await userEvent.click(canvas.getByText('Send'));
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    await userEvent.type(input, 'Bergen');
    await userEvent.click(canvas.getByText('Reset'));
    await expect(input.value).toBe('Oslo');
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Keyboard and implicit submit',
  render: form,
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    (canvas.getByText('Send') as WkButtonSubmit).focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    await expect(args.onSubmit).toHaveBeenCalledTimes(2);
    await userEvent.click(canvas.getByLabelText('City'));
    await userEvent.keyboard('{Enter}');
    await expect(args.onSubmit).toHaveBeenCalledTimes(3);
  }
}`,...m.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => html\`<form @submit=\${submitHandler(args)} style="display:flex;gap:12px">
      <input name="city" value="Oslo" aria-label="City" />
      <wk-button-submit variant="primary" disabled>Send</wk-button-submit>
    </form>\`,
  play: async ({
    canvasElement,
    args
  }) => {
    const button = canvasElement.querySelector('wk-button-submit') as WkButtonSubmit;
    await button.updateComplete;
    button.click();
    await expect(args.onSubmit).not.toHaveBeenCalled();
    await expect(button.tabIndex).toBe(-1);
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => html\`<form style="display:flex;gap:12px">
      <wk-button-submit variant="primary">Save</wk-button-submit>
      <wk-button-reset intent="danger">Discard changes</wk-button-reset>
    </form>\`
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: 'Themes, light/dark and wireframe',
  parameters: {
    docs: {
      description: {
        story: 'Illustrative: each cell sets its own \`data-wk-theme\`, \`data-wk-mode\` and \`data-wk-wireframe\` root.'
      }
    }
  },
  render: () => html\`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr));gap:12px"
    >
      \${themes.flatMap(theme => modes.flatMap(mode => ['false', 'true'].map(wireframe => html\`<form
                data-wk-theme=\${theme}
                data-wk-mode=\${mode}
                data-wk-wireframe=\${wireframe}
                data-cell=\${\`\${theme}-\${mode}-\${wireframe}\`}
                style="padding:12px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:\${mode === 'dark' ? '#171717' : '#fff'};color:\${mode === 'dark' ? '#fff' : '#111'}"
              >
                <span>\${theme} \${mode}\${wireframe === 'true' ? ' wireframe' : ''}</span>
                <wk-button-submit variant="primary">Send</wk-button-submit>
                <wk-button-reset intent="danger">Discard</wk-button-reset>
              </form>\`)))}
    </div>\`,
  play: async ({
    canvasElement
  }) => {
    const style = (cell: string, selector: string) => getComputedStyle(canvasElement.querySelector(\`[data-cell=\${cell}] \${selector}\`)!);
    for (const theme of themes) {
      const light = style(\`\${theme}-light-false\`, 'wk-button-submit');
      const dark = style(\`\${theme}-dark-false\`, 'wk-button-submit');
      await expect(light.backgroundColor).not.toBe(dark.backgroundColor);
      const plain = style(\`\${theme}-light-false\`, 'wk-button-reset');
      const wire = style(\`\${theme}-light-true\`, 'wk-button-reset');
      await expect(wire.borderRadius).toBe('0px');
      // Wireframe keeps the semantic red of destructive actions and never turns it green.
      await expect(wire.color).toBe(plain.color);
      await expect(wire.borderColor).toBe(plain.borderColor);
    }
  }
}`,...i.parameters?.docs?.source},description:{story:"Every theme in light and dark, plus the company wireframe, each as its own scoped root.",...i.parameters?.docs?.description}}};export{c as DestructiveReset,d as Disabled,m as KeyboardSubmit,l as SubmitAndReset,i as ThemeModeWireframeMatrix,B as __namedExportsOrder,S as default};
