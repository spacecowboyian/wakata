import { WkDialog } from './wk-dialog.js';

export function defineWkDialog(): void {
  if (!customElements.get('wk-dialog')) customElements.define('wk-dialog', WkDialog);
}

defineWkDialog();

declare global {
  interface HTMLElementTagNameMap {
    'wk-dialog': WkDialog;
  }
}
