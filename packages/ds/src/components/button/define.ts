import { WkButton } from './wk-button.js';

/** Registers wk-button once; safe to import repeatedly. */
export function defineWkButton(): void {
  if (!customElements.get('wk-button')) customElements.define('wk-button', WkButton);
}

defineWkButton();

declare global {
  interface HTMLElementTagNameMap {
    'wk-button': WkButton;
  }
}
