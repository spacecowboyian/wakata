import { IsEmail, Required } from '@lion/ui/form-core.js';
import { WkScalarFieldMixin } from '../../form/wk-scalar-field-mixin.js';
import { LionInput } from '@lion/ui/input.js';
import { wkTextFieldStyles } from './wk-text-field.styles.js';
import type { PropertyValues } from 'lit';

export type WkTextFieldType = 'text' | 'email' | 'password';

const WkScalarInput = WkScalarFieldMixin(LionInput);

/**
 * Scalar text input built on LionInput and Wakata's shared form foundation.
 * The native input remains in light DOM for native form semantics and FormData.
 *
 * @tag wk-text-field
 */
export class WkTextField extends WkScalarInput {
  static override get properties() {
    return {
      ...super.properties,
      required: { type: Boolean, reflect: true },
    };
  }

  static override get styles() {
    return [...LionInput.styles, wkTextFieldStyles];
  }

  declare type: WkTextFieldType;
  declare required: boolean;

  #requiredValidator = new Required();
  #emailValidator = new IsEmail();

  constructor() {
    super();
    this.required = false;
  }

  override updated(changed: PropertyValues): void {
    super.updated(changed);
    const input = this.querySelector(':scope > input[slot="input"]');
    if (input instanceof HTMLInputElement) input.required = this.required;

    const previous = this.validators;
    const next = previous.filter(
      (validator) => validator !== this.#requiredValidator && validator !== this.#emailValidator,
    );
    if (this.required && !this.readOnly) next.push(this.#requiredValidator);
    if (this.type === 'email' && !this.readOnly) next.push(this.#emailValidator);
    if (
      next.length !== previous.length ||
      next.some((validator, index) => validator !== previous[index])
    ) {
      this.validators = next;
    }
  }
}
