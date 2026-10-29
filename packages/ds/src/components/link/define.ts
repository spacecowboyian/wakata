import { WkLink } from './wk-link.js';

export function defineWkLink(): void {
  if (!customElements.get('wk-link')) customElements.define('wk-link', WkLink);
}

defineWkLink();

declare global {
  interface HTMLElementTagNameMap {
    'wk-link': WkLink;
  }
}
