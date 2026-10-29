import { WkSwitch } from './wk-switch.js';

/** Registers the Switch element once; safe to import repeatedly. */
export function defineWkSwitch(): void {
  if (!customElements.get('wk-switch')) customElements.define('wk-switch', WkSwitch);
}

defineWkSwitch();

declare global {
  interface HTMLElementTagNameMap {
    'wk-switch': WkSwitch;
  }
}
