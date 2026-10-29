import { WkStatus } from './wk-status.js';

export function defineWkStatus(): void {
  if (!customElements.get('wk-status')) customElements.define('wk-status', WkStatus);
}

defineWkStatus();

declare global {
  interface HTMLElementTagNameMap {
    'wk-status': WkStatus;
  }
}
