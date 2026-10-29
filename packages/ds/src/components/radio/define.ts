import { WkRadio } from './wk-radio.js';

/** Registers the Radio element once; safe to import repeatedly. */
export function defineWkRadio(): void {
  if (!customElements.get('wk-radio')) customElements.define('wk-radio', WkRadio);
}

defineWkRadio();

declare global {
  interface HTMLElementTagNameMap {
    'wk-radio': WkRadio;
  }
}
