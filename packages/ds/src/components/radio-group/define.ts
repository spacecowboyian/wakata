import { WkRadioGroup } from './wk-radio-group.js';
import '../radio/define.js';

/** Registers RadioGroup once; safe to import repeatedly. */
export function defineWkRadioGroup(): void {
  if (!customElements.get('wk-radio-group')) {
    customElements.define('wk-radio-group', WkRadioGroup);
  }
}

defineWkRadioGroup();

declare global {
  interface HTMLElementTagNameMap {
    'wk-radio-group': WkRadioGroup;
  }
}
