import { Required } from '@lion/ui/form-core.js';
import { LionSelect } from '@lion/ui/select.js';
import type { PropertyValues } from 'lit';
import { WkScalarFieldMixin } from '../../form/wk-scalar-field-mixin.js';
import { wkSelectStyles } from './wk-select.styles.js';

const WkScalarSelect = WkScalarFieldMixin(LionSelect);

class SelectRequired extends Required {
  static override async getMessage(): Promise<string> {
    return 'Please select an option.';
  }
}

/** Single scalar selection; supply a light-DOM select in slot="input". */
export class WkSelect extends WkScalarSelect {
  static override get properties() {
    return { ...super.properties, required: { type: Boolean, reflect: true } };
  }

  static override get styles() {
    return [...LionSelect.styles, wkSelectStyles];
  }

  declare required: boolean;
  #requiredValidator = new SelectRequired();

  constructor() {
    super();
    this.required = false;
  }

  override connectedCallback(): void {
    // LionSelect does not map a host value attribute. Apply it only before Lion
    // captures its initial model; an explicit value property takes precedence.
    if (this.modelValue === undefined && this.hasAttribute('value')) {
      this.value = this.getAttribute('value')!;
    }
    super.connectedCallback();
  }

  override updated(changed: PropertyValues): void {
    super.updated(changed);
    const select = this.querySelector(':scope > select[slot="input"]');
    if (select instanceof HTMLSelectElement) select.required = this.required;
    const previous = this.validators;
    const next = previous.filter((validator) => validator !== this.#requiredValidator);
    if (this.required) next.push(this.#requiredValidator);
    if (
      next.length !== previous.length ||
      next.some((validator, index) => validator !== previous[index])
    ) {
      this.validators = next;
    }
  }
}
