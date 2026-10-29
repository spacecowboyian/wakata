import { WkCheckboxGroup } from './wk-checkbox-group.js';

/** Registers the CheckboxGroup element once; safe to import repeatedly. */
export function defineWkCheckboxGroup(): void {
  if (!customElements.get('wk-checkbox-group')) {
    customElements.define('wk-checkbox-group', WkCheckboxGroup);
  }
}

defineWkCheckboxGroup();

declare global {
  interface HTMLElementTagNameMap {
    'wk-checkbox-group': WkCheckboxGroup;
  }
}
