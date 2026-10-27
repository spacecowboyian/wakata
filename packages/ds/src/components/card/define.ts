import { WkCard } from './wk-card.js';

export function defineWkCard(): void {
  if (!customElements.get('wk-card')) customElements.define('wk-card', WkCard);
}

defineWkCard();

declare global {
  interface HTMLElementTagNameMap {
    'wk-card': WkCard;
  }
}
