import { WkCheckbox } from './wk-checkbox.js';

/** Registers the Checkbox element once; safe to import repeatedly. */
export function defineWkCheckbox(): void {
  if (!customElements.get('wk-checkbox')) customElements.define('wk-checkbox', WkCheckbox);
}

defineWkCheckbox();

declare global {
  interface HTMLElementTagNameMap {
    'wk-checkbox': WkCheckbox;
  }
}
