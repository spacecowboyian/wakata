import { WkSelect } from './wk-select.js';

export function defineWkSelect(): void {
  if (!customElements.get('wk-select')) customElements.define('wk-select', WkSelect);
}

defineWkSelect();

declare global {
  interface HTMLElementTagNameMap {
    'wk-select': WkSelect;
  }
}
