import { WkTextField } from './wk-text-field.js';

/** Registers the TextField element once; safe to import repeatedly. */
export function defineWkTextField(): void {
  if (!customElements.get('wk-text-field')) customElements.define('wk-text-field', WkTextField);
}

defineWkTextField();

declare global {
  interface HTMLElementTagNameMap {
    'wk-text-field': WkTextField;
  }
}
