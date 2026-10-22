import type { Decorator, Preview } from '@storybook/web-components-vite';
import { html } from 'lit';
import '../src/themes/themes.css';
import '../src/define.js';

const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

/** Wraps stories in a DS theme root driven by the toolbar globals. */
const withWakataTheme: Decorator = (story, context) => {
  const { theme, mode, wireframe } = context.globals as Record<string, string>;
  const resolvedMode = mode === 'system' ? (prefersDark() ? 'dark' : 'light') : mode;
  const background = resolvedMode === 'dark' ? '#171717' : '#fff';
  const color = resolvedMode === 'dark' ? '#efefec' : '#222';
  return html`<div
    data-wk-theme=${theme}
    data-wk-mode=${resolvedMode}
    data-wk-wireframe=${wireframe === 'on' ? 'true' : 'false'}
    style="padding:24px;background:${background};color:${color};font-family:var(--wk-font)"
  >
    ${story()}
  </div>`;
};

const preview: Preview = {
  decorators: [withWakataTheme],
  initialGlobals: { theme: 'neutral', mode: 'light', wireframe: 'off' },
  globalTypes: {
    theme: {
      description: 'DS theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'neutral', title: 'Wakata / Neutral' },
          { value: 'studio', title: 'Example / Studio' },
          { value: 'fieldwork', title: 'Example / Fieldwork' },
        ],
      },
    },
    mode: {
      description: 'Colour mode',
      toolbar: {
        title: 'Mode',
        icon: 'circlehollow',
        dynamicTitle: true,
        items: [
          { value: 'system', title: 'System' },
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
      },
    },
    wireframe: {
      description: 'Company wireframe: keeps typography and dimensions, squares corners',
      toolbar: {
        title: 'Wireframe',
        icon: 'grid',
        dynamicTitle: true,
        items: [
          { value: 'off', title: 'Wireframe off' },
          { value: 'on', title: 'Wireframe on' },
        ],
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    controls: { expanded: true },
  },
};

export default preview;
