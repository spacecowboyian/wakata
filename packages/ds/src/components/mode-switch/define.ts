import { WkModeSwitch } from './wk-mode-switch.js';
import type { WkModeChangeDetail } from './wk-mode-switch.js';

export function defineWkModeSwitch(): void {
  if (!customElements.get('wk-mode-switch')) customElements.define('wk-mode-switch', WkModeSwitch);
}

defineWkModeSwitch();

declare global {
  interface HTMLElementTagNameMap {
    'wk-mode-switch': WkModeSwitch;
  }
  interface HTMLElementEventMap {
    'wk-mode-change': CustomEvent<WkModeChangeDetail>;
  }
  interface DocumentEventMap {
    'wk-mode-change': CustomEvent<WkModeChangeDetail>;
  }
}
