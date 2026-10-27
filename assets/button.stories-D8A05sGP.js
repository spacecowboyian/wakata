import{b as o}from"./iframe-rLVFa9xC.js";import"./preload-helper-PPVm8Dsz.js";const{expect:n,fn:L,userEvent:r,within:f}=__STORYBOOK_MODULE_TEST__,S=["primary","secondary","tertiary"],B=["normal","danger"],H=["small","medium","large"],i="display:flex;flex-wrap:wrap;gap:16px;align-items:center",z={title:"Components/Button",tags:["autodocs"],parameters:{docs:{description:{component:"\n`<wk-button>` is an **action-only** button: a Wakata subclass of Lion's `LionButton` that keeps Lion's\nrole, keyboard activation and disabled behaviour. Form submit/reset are out of scope for this component.\n\n**Real behaviour** (covered by browser tests): Enter and Space each activate once via the normal `click`\nevent; `disabled` suppresses activation and leaves the tab order; `loading` blocks mouse, keyboard and\nprogrammatic activation while keeping the label, size and tab stop, and exposes `aria-busy` and\n`aria-disabled`.\n\n**Usage guidance:** use a verb-led visible label (the label is the accessible name); use one primary\naction per region; reserve `intent=\"danger\"` for destructive actions and pair it with clear wording;\nprefer `loading` over swapping the label so the name stays stable.\n\n**Illustrative only:** theme, mode and wireframe toolbar choices, and the Studio/Fieldwork themes, are\nexample appearances. Automated axe checks cover representative light and dark themes and are not a full\nWCAG or assistive-technology evaluation.\n"}}},argTypes:{label:{control:"text",description:"Slot content / accessible name (story-only arg)."},variant:{control:"inline-radio",options:S,description:"Visual emphasis.",table:{defaultValue:{summary:"secondary"}}},intent:{control:"inline-radio",options:B,description:"Semantic intent.",table:{defaultValue:{summary:"normal"}}},size:{control:"inline-radio",options:H,description:"Control size.",table:{defaultValue:{summary:"medium"}}},disabled:{control:"boolean",description:"Lion disabled behaviour; skipped in tab order."},loading:{control:"boolean",description:"Busy: keeps label and tab stop, blocks activation."},onClick:{action:"click",description:"Native click event."}},args:{label:"Save changes",variant:"secondary",intent:"normal",size:"medium",disabled:!1,loading:!1,onClick:L()},render:e=>o`<wk-button
      variant=${e.variant}
      intent=${e.intent}
      size=${e.size}
      ?disabled=${e.disabled}
      ?loading=${e.loading}
      @click=${e.onClick}
      >${e.label}</wk-button
    >`},d={},u={render:e=>o`<div style=${i}>
      ${S.map(t=>o`<wk-button variant=${t} @click=${e.onClick}>${t} action</wk-button>`)}
    </div>`},p={render:e=>o`<div style=${i}>
      ${B.map(t=>o`<wk-button intent=${t} @click=${e.onClick}>${t} intent</wk-button>`)}
      ${B.map(t=>o`<wk-button variant="primary" intent=${t} @click=${e.onClick}
            >${t} primary</wk-button
          >`)}
    </div>`},m={render:e=>o`<div style=${i}>
      ${H.map(t=>o`<wk-button size=${t} @click=${e.onClick}>${t}</wk-button>`)}
    </div>`},b={args:{disabled:!0,label:"Unavailable"},play:async({canvasElement:e,args:t})=>{const a=e.querySelector("wk-button");await a.updateComplete,a.click(),a.dispatchEvent(new MouseEvent("click",{bubbles:!0})),await n(t.onClick).not.toHaveBeenCalled(),await n(a.tabIndex).toBe(-1)}},w={name:"Disabled is skipped by Tab",render:e=>o`<div style=${i}>
      <wk-button @click=${e.onClick}>First</wk-button>
      <wk-button disabled @click=${e.onClick}>Unavailable</wk-button>
      <wk-button @click=${e.onClick}>Last</wk-button>
    </div>`,play:async({canvasElement:e})=>{const t=f(e);await r.tab(),await n(t.getByText("First")).toHaveFocus(),await r.tab(),await n(t.getByText("Last")).toHaveFocus()}},k={args:{loading:!0,label:"Saving"},play:async({canvasElement:e,args:t})=>{const a=e.querySelector("wk-button");await a.updateComplete,await n(a).toHaveAttribute("aria-busy","true"),await n(a).toHaveAttribute("aria-disabled","true"),await n(a.tabIndex).toBe(0),await n(a.textContent?.trim()).toBe("Saving"),a.click(),a.dispatchEvent(new MouseEvent("click",{bubbles:!0})),await r.click(a),a.focus(),await r.keyboard("{Enter}"),await r.keyboard(" "),await n(t.onClick).not.toHaveBeenCalled()}},v={name:"Loading preserves geometry and restores",args:{label:"Run preview"},play:async({canvasElement:e,args:t})=>{const a=e.querySelector("wk-button");await a.updateComplete;const E=a.getBoundingClientRect();a.loading=!0,await a.updateComplete;const T=a.getBoundingClientRect();await n([T.width,T.height]).toEqual([E.width,E.height]),await n(a.textContent?.trim()).toBe("Run preview"),await n(a.tabIndex).toBe(0),a.loading=!1,await a.updateComplete,await n(a).not.toHaveAttribute("aria-busy"),await n(a).not.toHaveAttribute("aria-disabled"),await r.click(a),await n(t.onClick).toHaveBeenCalledTimes(1)}},y={name:"Enter and Space activate once each",play:async({canvasElement:e,args:t})=>{const a=f(e).getByRole("button");await r.tab(),await n(a).toHaveFocus(),await r.keyboard("{Enter}"),await n(t.onClick).toHaveBeenCalledTimes(1),await r.keyboard(" "),await n(t.onClick).toHaveBeenCalledTimes(2)}},g={name:"Click activates once",play:async({canvasElement:e,args:t})=>{await r.click(f(e).getByRole("button")),await n(t.onClick).toHaveBeenCalledTimes(1)}},h={args:{label:"Approve the quarterly supplier agreement and notify every regional finance contact"},decorators:[e=>o`<div style="max-width:320px">${e()}</div>`]},s={parameters:{docs:{description:{story:"Illustrative: the same markup under each theme."}}},render:e=>o`<div style="display:grid;gap:16px">
      ${["neutral","studio","fieldwork"].map(t=>o`<div data-wk-theme=${t} style=${i}>
            <span style="min-width:90px">${t}</span>
            ${S.map(a=>o`<wk-button variant=${a} @click=${e.onClick}>${a}</wk-button>`)}
            <wk-button intent="danger" @click=${e.onClick}>Delete</wk-button>
          </div>`)}
    </div>`},c={name:"Independently scoped themes",parameters:{docs:{description:{story:"Each scope sets `data-wk-theme` on its own root, so themes stay independent of the toolbar theme."}}},render:e=>o`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,10rem),1fr));gap:16px"
    >
      ${["neutral","studio","fieldwork"].map(t=>o`<div
            data-wk-theme=${t}
            data-testid=${t}
            style="padding:16px;border:1px solid #999"
          >
            <wk-button variant="primary" @click=${e.onClick}>Same component</wk-button>
          </div>`)}
    </div>`,play:async({canvasElement:e})=>{const t=["neutral","studio","fieldwork"].map(a=>getComputedStyle(e.querySelector(`[data-testid=${a}] wk-button`)));await n(new Set(t.map(a=>a.fontFamily)).size).toBe(3),await n(new Set(t.map(a=>a.borderRadius)).size).toBe(3),await n(new Set(t.map(a=>a.backgroundColor)).size).toBe(3)}},$={...c,name:"Scoped themes at narrow width",decorators:[e=>o`<div data-testid="narrow" style="width:320px">${e()}</div>`],play:async({canvasElement:e})=>{const t=e.querySelector("[data-testid=narrow]");await n(t.scrollWidth).toBeLessThanOrEqual(t.clientWidth);for(const a of t.querySelectorAll("[data-wk-theme]"))await n(a.getBoundingClientRect().right).toBeLessThanOrEqual(t.getBoundingClientRect().right)}},l={globals:{mode:"dark"},render:e=>o`<div style=${i}>
      ${S.map(t=>o`<wk-button variant=${t} @click=${e.onClick}>${t}</wk-button>`)}
      <wk-button intent="danger" @click=${e.onClick}>Delete</wk-button>
      <wk-button disabled @click=${e.onClick}>Unavailable</wk-button>
    </div>`},C={...l,globals:{mode:"dark",theme:"studio"}},x={...s,globals:{wireframe:"on",theme:"studio"},parameters:{docs:{description:{story:"Company wireframe keeps typography and dimensions, squares corners and grays the accent."}}}},A=["Playground","Variants","Intents","Sizes","Disabled","DisabledSkippedByTab","Loading","LoadingPreservesGeometryAndRestores","KeyboardActivation","MouseActivation","LongLabel","ThemeComparison","ScopedThemes","ScopedThemesNarrow","DarkTheme","DarkStudio","Wireframe"];d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:"{}",...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:"{\n  render: args => html`<div style=${row}>\n      ${variants.map(variant => html`<wk-button variant=${variant} @click=${args.onClick}>${variant} action</wk-button>`)}\n    </div>`\n}",...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:'{\n  render: args => html`<div style=${row}>\n      ${intents.map(intent => html`<wk-button intent=${intent} @click=${args.onClick}>${intent} intent</wk-button>`)}\n      ${intents.map(intent => html`<wk-button variant="primary" intent=${intent} @click=${args.onClick}\n            >${intent} primary</wk-button\n          >`)}\n    </div>`\n}',...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:"{\n  render: args => html`<div style=${row}>\n      ${sizes.map(size => html`<wk-button size=${size} @click=${args.onClick}>${size}</wk-button>`)}\n    </div>`\n}",...m.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true,
    label: 'Unavailable'
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const button = canvasElement.querySelector('wk-button') as WkButton;
    await button.updateComplete;
    button.click();
    button.dispatchEvent(new MouseEvent('click', {
      bubbles: true
    }));
    await expect(args.onClick).not.toHaveBeenCalled();
    await expect(button.tabIndex).toBe(-1);
  }
}`,...b.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'Disabled is skipped by Tab',
  render: args => html\`<div style=\${row}>
      <wk-button @click=\${args.onClick}>First</wk-button>
      <wk-button disabled @click=\${args.onClick}>Unavailable</wk-button>
      <wk-button @click=\${args.onClick}>Last</wk-button>
    </div>\`,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByText('First')).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByText('Last')).toHaveFocus();
  }
}`,...w.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true,
    label: 'Saving'
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const button = canvasElement.querySelector('wk-button') as WkButton;
    await button.updateComplete;
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toHaveAttribute('aria-disabled', 'true');
    await expect(button.tabIndex).toBe(0);
    await expect(button.textContent?.trim()).toBe('Saving');
    button.click();
    button.dispatchEvent(new MouseEvent('click', {
      bubbles: true
    }));
    await userEvent.click(button);
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).not.toHaveBeenCalled();
  }
}`,...k.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'Loading preserves geometry and restores',
  args: {
    label: 'Run preview'
  },
  play: async ({
    canvasElement,
    args
  }) => {
    const button = canvasElement.querySelector('wk-button') as WkButton;
    await button.updateComplete;
    const before = button.getBoundingClientRect();
    button.loading = true;
    await button.updateComplete;
    const after = button.getBoundingClientRect();
    await expect([after.width, after.height]).toEqual([before.width, before.height]);
    await expect(button.textContent?.trim()).toBe('Run preview');
    await expect(button.tabIndex).toBe(0);
    button.loading = false;
    await button.updateComplete;
    await expect(button).not.toHaveAttribute('aria-busy');
    await expect(button).not.toHaveAttribute('aria-disabled');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  }
}`,...v.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'Enter and Space activate once each',
  play: async ({
    canvasElement,
    args
  }) => {
    const button = within(canvasElement).getByRole('button');
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(2);
  }
}`,...y.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Click activates once',
  play: async ({
    canvasElement,
    args
  }) => {
    await userEvent.click(within(canvasElement).getByRole('button'));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  }
}`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    label: 'Approve the quarterly supplier agreement and notify every regional finance contact'
  },
  decorators: [story => html\`<div style="max-width:320px">\${story()}</div>\`]
}`,...h.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'Illustrative: the same markup under each theme.'
      }
    }
  },
  render: args => html\`<div style="display:grid;gap:16px">
      \${(['neutral', 'studio', 'fieldwork'] as const).map(theme => html\`<div data-wk-theme=\${theme} style=\${row}>
            <span style="min-width:90px">\${theme}</span>
            \${variants.map(variant => html\`<wk-button variant=\${variant} @click=\${args.onClick}>\${variant}</wk-button>\`)}
            <wk-button intent="danger" @click=\${args.onClick}>Delete</wk-button>
          </div>\`)}
    </div>\`
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Independently scoped themes',
  parameters: {
    docs: {
      description: {
        story: 'Each scope sets \`data-wk-theme\` on its own root, so themes stay independent of the toolbar theme.'
      }
    }
  },
  render: args => html\`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,10rem),1fr));gap:16px"
    >
      \${(['neutral', 'studio', 'fieldwork'] as const).map(theme => html\`<div
            data-wk-theme=\${theme}
            data-testid=\${theme}
            style="padding:16px;border:1px solid #999"
          >
            <wk-button variant="primary" @click=\${args.onClick}>Same component</wk-button>
          </div>\`)}
    </div>\`,
  play: async ({
    canvasElement
  }) => {
    const styles = ['neutral', 'studio', 'fieldwork'].map(theme => getComputedStyle(canvasElement.querySelector(\`[data-testid=\${theme}] wk-button\`) as WkButton));
    await expect(new Set(styles.map(s => s.fontFamily)).size).toBe(3);
    await expect(new Set(styles.map(s => s.borderRadius)).size).toBe(3);
    await expect(new Set(styles.map(s => s.backgroundColor)).size).toBe(3);
  }
}`,...c.parameters?.docs?.source}}};$.parameters={...$.parameters,docs:{...$.parameters?.docs,source:{originalSource:`{
  ...ScopedThemes,
  name: 'Scoped themes at narrow width',
  decorators: [story => html\`<div data-testid="narrow" style="width:320px">\${story()}</div>\`],
  play: async ({
    canvasElement
  }) => {
    const host = canvasElement.querySelector('[data-testid=narrow]') as HTMLElement;
    await expect(host.scrollWidth).toBeLessThanOrEqual(host.clientWidth);
    for (const cell of host.querySelectorAll('[data-wk-theme]')) {
      await expect(cell.getBoundingClientRect().right).toBeLessThanOrEqual(host.getBoundingClientRect().right);
    }
  }
}`,...$.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:"{\n  globals: {\n    mode: 'dark'\n  },\n  render: args => html`<div style=${row}>\n      ${variants.map(variant => html`<wk-button variant=${variant} @click=${args.onClick}>${variant}</wk-button>`)}\n      <wk-button intent=\"danger\" @click=${args.onClick}>Delete</wk-button>\n      <wk-button disabled @click=${args.onClick}>Unavailable</wk-button>\n    </div>`\n}",...l.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  ...DarkTheme,
  globals: {
    mode: 'dark',
    theme: 'studio'
  }
}`,...C.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  ...ThemeComparison,
  globals: {
    wireframe: 'on',
    theme: 'studio'
  },
  parameters: {
    docs: {
      description: {
        story: 'Company wireframe keeps typography and dimensions, squares corners and grays the accent.'
      }
    }
  }
}`,...x.parameters?.docs?.source}}};export{C as DarkStudio,l as DarkTheme,b as Disabled,w as DisabledSkippedByTab,p as Intents,y as KeyboardActivation,k as Loading,v as LoadingPreservesGeometryAndRestores,h as LongLabel,g as MouseActivation,d as Playground,c as ScopedThemes,$ as ScopedThemesNarrow,m as Sizes,s as ThemeComparison,u as Variants,x as Wireframe,A as __namedExportsOrder,z as default};
