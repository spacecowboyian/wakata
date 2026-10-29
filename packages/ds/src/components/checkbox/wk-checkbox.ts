import { Required } from '@lion/ui/form-core.js';
import { LionCheckbox } from '@lion/ui/checkbox-group.js';
import { html, type PropertyValues } from 'lit';
import { wkCheckboxStyles } from './wk-checkbox.styles.js';
import type { WkBooleanEventDetail } from './wk-boolean-events.js';
import { WkBooleanErrorController } from './wk-boolean-error-controller.js';

class CheckboxRequired extends Required {
  static override async getMessage(): Promise<string> {
    return 'Please check this box to continue.';
  }
}

/**
 * Consent/choice checkbox on LionCheckbox with a native light-DOM checkbox. Checked submits
 * `choiceValue` (default "on") under `name`; unchecked and disabled are omitted from FormData.
 * `required` means checked. No readonly or indeterminate API.
 *
 * @tag wk-checkbox
 * @fires wk-input - user activation; detail `{ checked, name, value }`
 * @fires wk-change - user activation; detail `{ checked, name, value }`
 */
export class WkCheckbox extends LionCheckbox {
  static override get properties() {
    return {
      ...super.properties,
      required: { type: Boolean, reflect: true },
      error: { type: String },
    };
  }

  static override get styles() {
    return [...LionCheckbox.styles, wkCheckboxStyles];
  }

  declare required: boolean;
  declare name: string;
  declare error: string;
  #requiredValidator = new CheckboxRequired();

  constructor() {
    super();
    this.required = false;
    this.error = '';
    this.choiceValue = 'on';
    new WkBooleanErrorController(this, () => this.querySelector(':scope > input[slot="input"]'));
  }

  override reset(): void {
    this.error = '';
    super.reset();
  }

  /** Lion's choice template leaves this slot empty; render external feedback visibly. */
  override _afterTemplate() {
    return html`<div class="choice-field__after"><slot name="after"></slot></div>`;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('input', this.#onNative);
    this.addEventListener('change', this.#onNative);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('input', this.#onNative);
    this.removeEventListener('change', this.#onNative);
  }

  override updated(changed: PropertyValues): void {
    super.updated(changed);
    const input = this.querySelector(':scope > input[slot="input"]');
    if (input instanceof HTMLInputElement) input.required = this.required;
    const has = this.validators.includes(this.#requiredValidator);
    if (this.required && !has) this.validators = [...this.validators, this.#requiredValidator];
    if (!this.required && has) {
      this.validators = this.validators.filter((v) => v !== this.#requiredValidator);
    }
  }

  // Only native events from the light-DOM input are user activations.
  #onNative = (event: Event): void => {
    const control = event.target;
    if (!(control instanceof HTMLInputElement) || control.parentElement !== this) return;
    this.dispatchEvent(
      new CustomEvent<WkBooleanEventDetail>(event.type === 'input' ? 'wk-input' : 'wk-change', {
        bubbles: true,
        composed: true,
        detail: { checked: control.checked, name: this.name, value: String(this.choiceValue) },
      }),
    );
  };
}
