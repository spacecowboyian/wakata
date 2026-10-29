import { Required } from '@lion/ui/form-core.js';
import { LionRadioGroup } from '@lion/ui/radio-group.js';
import { html, type PropertyValues } from 'lit';
import { wkRadioGroupStyles } from './wk-radio-group.styles.js';
import { WkBooleanErrorController } from '../checkbox/wk-boolean-error-controller.js';

class RadioRequired extends Required {
  static override async getMessage(): Promise<string> {
    return 'Please select an option.';
  }
}

/** Detail of `wk-input` and `wk-change` on RadioGroup. */
export interface WkRadioGroupEventDetail {
  value: string;
  name: string;
}

/**
 * One-of-many group of `wk-radio` on LionRadioGroup (role="radiogroup") with a visible label,
 * help and error text. `value` is the selected choice value, `''` when none. No option is
 * selected unless a `wk-radio` is `checked` or `value` is set. FormData submits one value under
 * `name`; disabled submits nothing. At least one `wk-radio` child is required.
 * Reset restores the initially `checked` option. Arrow keys and Tab follow native radio behavior.
 *
 * @tag wk-radio-group
 * @fires wk-input - user selection; detail `{ value, name }`
 * @fires wk-change - user selection; detail `{ value, name }`
 */
export class WkRadioGroup extends LionRadioGroup {
  static override get properties() {
    return {
      ...super.properties,
      required: { type: Boolean, reflect: true },
      error: { type: String },
    };
  }

  static override get styles() {
    return [...LionRadioGroup.styles, wkRadioGroupStyles];
  }

  declare required: boolean;
  declare error: string;
  declare name: string;
  #requiredValidator = new RadioRequired();
  // Not a #private: the value setter can run during the Lion constructor.
  declare _pendingValue?: string;

  constructor() {
    super();
    this.required = false;
    this.error = '';
    new WkBooleanErrorController(this, () => this);
  }

  get value(): string {
    const selected = this.formElements.find((el: { checked: boolean }) => el.checked);
    return selected ? String(selected.choiceValue) : '';
  }

  set value(next: string) {
    const wanted = next == null ? '' : String(next);
    // Options may not be registered yet; applied again in updated().
    this._pendingValue = this.formElements.length || wanted === '' ? undefined : wanted;
    for (const el of this.formElements) {
      el.checked = wanted !== '' && String(el.choiceValue) === wanted;
    }
  }

  override resetGroup(): void {
    this.error = '';
    super.resetGroup();
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

  override _groupTwoTemplate() {
    return html`${super._groupTwoTemplate()}
      <div class="form-field__after"><slot name="after"></slot></div>`;
  }

  override updated(changed: PropertyValues): void {
    super.updated(changed);
    // Native radio grouping and FormData need one shared name.
    for (const el of this.formElements) if (el.name !== this.name) el.name = this.name;
    if (this._pendingValue !== undefined && this.formElements.length) {
      const wanted = this._pendingValue;
      this._pendingValue = undefined;
      this.value = wanted;
    }
    const has = this.validators.includes(this.#requiredValidator);
    if (this.required && !has) this.validators = [...this.validators, this.#requiredValidator];
    if (!this.required && has) {
      this.validators = this.validators.filter((v: unknown) => v !== this.#requiredValidator);
    }
  }

  // Only native events from a radio's light-DOM input are user selections.
  #onNative = (event: Event): void => {
    const control = event.target;
    if (!(control instanceof HTMLInputElement) || control.type !== 'radio') return;
    if (control.parentElement?.localName !== 'wk-radio') return;
    // The group value can lag the native input event, so report the activated option.
    const option = control.parentElement as unknown as { choiceValue: unknown };
    this.dispatchEvent(
      new CustomEvent<WkRadioGroupEventDetail>(event.type === 'input' ? 'wk-input' : 'wk-change', {
        bubbles: true,
        composed: true,
        detail: {
          value: control.checked ? String(option.choiceValue) : this.value,
          name: this.name,
        },
      }),
    );
  };
}
