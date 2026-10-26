import { WkFieldset, WkForm } from './wk-form.js';

/** Registers the form infrastructure elements once; safe to import repeatedly. */
export function defineWkForm(): void {
  if (!customElements.get('wk-form')) customElements.define('wk-form', WkForm);
  if (!customElements.get('wk-fieldset')) customElements.define('wk-fieldset', WkFieldset);
}

defineWkForm();

declare global {
  interface HTMLElementTagNameMap {
    'wk-form': WkForm;
    'wk-fieldset': WkFieldset;
  }
}
