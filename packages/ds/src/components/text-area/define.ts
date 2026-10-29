import { WkTextArea } from './wk-text-area.js';

/** Registers the TextArea element once; safe to import repeatedly. */
export function defineWkTextArea(): void {
  if (!customElements.get('wk-text-area')) customElements.define('wk-text-area', WkTextArea);
}

defineWkTextArea();

declare global {
  interface HTMLElementTagNameMap {
    'wk-text-area': WkTextArea;
  }
}
