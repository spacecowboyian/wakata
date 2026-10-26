import { WkButton } from './wk-button.js';
import { WkButtonReset } from './wk-button-reset.js';
import { WkButtonSubmit } from './wk-button-submit.js';

/** Registers the Button family once; safe to import repeatedly. */
export function defineWkButton(): void {
  if (!customElements.get('wk-button')) customElements.define('wk-button', WkButton);
  if (!customElements.get('wk-button-submit'))
    customElements.define('wk-button-submit', WkButtonSubmit);
  if (!customElements.get('wk-button-reset'))
    customElements.define('wk-button-reset', WkButtonReset);
}

defineWkButton();

declare global {
  interface HTMLElementTagNameMap {
    'wk-button': WkButton;
    'wk-button-submit': WkButtonSubmit;
    'wk-button-reset': WkButtonReset;
  }
}
