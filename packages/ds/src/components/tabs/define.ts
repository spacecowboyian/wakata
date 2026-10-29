import { WkTabs } from './wk-tabs.js';
import { WkTab } from './wk-tab.js';
import { WkTabPanel } from './wk-tab-panel.js';

/** Registers wk-tabs, wk-tab and wk-tab-panel once; safe to import repeatedly. */
export function defineWkTabs(): void {
  if (!customElements.get('wk-tab')) customElements.define('wk-tab', WkTab);
  if (!customElements.get('wk-tab-panel')) customElements.define('wk-tab-panel', WkTabPanel);
  if (!customElements.get('wk-tabs')) customElements.define('wk-tabs', WkTabs);
}

defineWkTabs();

declare global {
  interface HTMLElementTagNameMap {
    'wk-tabs': WkTabs;
    'wk-tab': WkTab;
    'wk-tab-panel': WkTabPanel;
  }
}
