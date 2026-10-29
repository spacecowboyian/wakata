import { Required } from '@lion/ui/form-core.js';
import { LionTextarea } from '@lion/ui/textarea.js';
import { WkScalarFieldMixin } from '../../form/wk-scalar-field-mixin.js';
import { wkTextAreaStyles } from './wk-text-area.styles.js';
import type { PropertyValues } from 'lit';

const WkScalarTextarea = WkScalarFieldMixin(LionTextarea);

class TextAreaRequired extends Required {
  static override async getMessage(): Promise<string> {
    return 'Please enter a value.';
  }
}

/**
 * Multiline text field built on LionTextarea (auto-grow, 2 rows by default, 6 maximum)
 * and Wakata's shared form foundation. The native textarea stays in light DOM.
 *
 * @tag wk-text-area
 */
export class WkTextArea extends WkScalarTextarea {
  static override get properties() {
    return {
      ...super.properties,
      required: { type: Boolean, reflect: true },
    };
  }

  static override get styles() {
    return [...LionTextarea.styles, wkTextAreaStyles];
  }

  declare required: boolean;

  #requiredValidator = new TextAreaRequired();

  constructor() {
    super();
    this.required = false;
  }

  override updated(changed: PropertyValues): void {
    super.updated(changed);
    const input = this.querySelector(':scope > textarea[slot="input"]');
    if (input instanceof HTMLTextAreaElement) input.required = this.required;

    const previous = this.validators;
    const next = previous.filter((validator) => validator !== this.#requiredValidator);
    if (this.required && !this.readOnly) next.push(this.#requiredValidator);
    if (
      next.length !== previous.length ||
      next.some((validator, index) => validator !== previous[index])
    ) {
      this.validators = next;
    }
  }
}
