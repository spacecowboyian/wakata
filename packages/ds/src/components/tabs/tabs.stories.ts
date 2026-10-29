import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';

const set = (value = 'overview') =>
  html`<wk-tabs label="Vehicle details" value=${value}>
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
  </wk-tabs>`;

const meta = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Tabs display one panel at a time. Give each \`wk-tab\` and its matching \`wk-tab-panel\` the same nonempty \`value\`.
Give \`wk-tabs\` a visible-context \`label\` for its accessible tablist name. The first enabled complete pair is selected by default.
Left/Right arrows, Home and End **move focus only**. Enter, Space or click activates the focused tab and emits one \`wk-change\` with \`{ value }\`.
Programmatic \`value\` updates are silent; an invalid value normalizes to the first enabled complete pair.
Only horizontal tabs are supported. Narrow layouts wrap the tabs. This provisional component is not shared production promotion.
Manual assistive-technology and physical-device checks remain deferred.
`,
      },
    },
  },
  render: () => set(),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AlternateSelection: Story = { render: () => set('inspection') };

export const ManualActivation: Story = {
  render: () =>
    html`<div style="display:grid;gap:12px;max-width:34rem">
      <p>Focus a tab, press Right Arrow, then press Enter to open its panel.</p>
      ${set()}
    </div>`,
};

export const DisabledTab: Story = {
  render: () =>
    html`<wk-tabs label="Vehicle details" value="overview">
      <wk-tab slot="tab" value="overview">Overview</wk-tab>
      <wk-tab slot="tab" value="inspection" disabled>Inspection unavailable</wk-tab>
      <wk-tab slot="tab" value="history">History</wk-tab>
      <wk-tab-panel slot="panel" value="overview">Vehicle summary.</wk-tab-panel>
      <wk-tab-panel slot="panel" value="inspection">Unavailable inspection details.</wk-tab-panel>
      <wk-tab-panel slot="panel" value="history">Service history.</wk-tab-panel>
    </wk-tabs>`,
};

export const LongContentNarrow: Story = {
  render: () =>
    html`<div style="width:320px;max-width:100%">
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
    </div>`,
};

export const ControlledUpdate: Story = {
  render: () =>
    html`<div style="display:grid;gap:12px;max-width:34rem">
      ${set()}
      <button
        type="button"
        @click=${(event: Event) => {
          const tabs = (event.currentTarget as HTMLElement).parentElement?.querySelector(
            'wk-tabs',
          ) as (HTMLElement & { value: string }) | null;
          if (tabs) tabs.value = 'history';
        }}
      >
        Choose History programmatically
      </button>
    </div>`,
};

export const ThemesModesWireframe: Story = {
  render: () =>
    html`<div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:16px"
    >
      ${(['neutral', 'studio', 'fieldwork'] as const).flatMap((theme) =>
        (['light', 'dark'] as const).map(
          (mode) =>
            html`<div
              data-wk-theme=${theme}
              data-wk-mode=${mode}
              style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
            >
              ${set()}
            </div>`,
        ),
      )}
      <div
        data-wk-theme="neutral"
        data-wk-wireframe="true"
        style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        ${set()}
      </div>
    </div>`,
};

export const NestedScope: Story = {
  render: () =>
    html`<div
      data-wk-theme="neutral"
      data-wk-mode="light"
      style="padding:16px;background:var(--wk-surface);color:var(--wk-text)"
    >
      ${set()}
      <div
        data-wk-theme="fieldwork"
        data-wk-mode="dark"
        style="margin-top:16px;padding:16px;background:var(--wk-surface);color:var(--wk-text)"
      >
        ${set('inspection')}
      </div>
    </div>`,
};
