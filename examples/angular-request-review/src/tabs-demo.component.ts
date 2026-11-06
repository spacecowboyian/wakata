import '@angular/compiler';
import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core';
import '@wakata/ds/themes.css';
import '@wakata/ds/tabs/define';

/** Synthetic selected-value and event integration; Tabs are outside forms. */
@Component({
  selector: 'app-tabs-demo',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <main data-wk-theme="neutral" data-wk-mode="light">
      <h1>Vintage car checklist</h1>
      <p>Arrow keys move focus; Enter or Space opens a panel.</p>
      <wk-tabs label="Checklist sections" [value]="selected()" (wk-change)="onTabChange($event)">
        <wk-tab slot="tab" value="body">Body</wk-tab>
        <wk-tab slot="tab" value="mechanical">Mechanical</wk-tab>
        <wk-tab slot="tab" value="records">Records</wk-tab>
        <wk-tab-panel slot="panel" value="body">Inspect corrosion and paint repairs.</wk-tab-panel>
        <wk-tab-panel slot="panel" value="mechanical"
          >Check leaks, braking and steering.</wk-tab-panel
        >
        <wk-tab-panel slot="panel" value="records"
          >Compare service and ownership records.</wk-tab-panel
        >
      </wk-tabs>
      <button type="button" (click)="selected.set('records')">
        Choose Records programmatically
      </button>
      <output aria-live="polite">Selected: {{ selected() }}</output>
    </main>
  `,
})
export class TabsDemoComponent {
  selected = signal('body');

  onTabChange(event: Event) {
    this.selected.set((event as CustomEvent<{ value: string }>).detail.value);
  }
}
