import { Required } from '@lion/ui/form-core.js';
import { LionCheckboxGroup } from '@lion/ui/checkbox-group.js';
import { html, type PropertyValues } from 'lit';
import { wkCheckboxGroupStyles } from './wk-checkbox-group.styles.js';
import { WkBooleanErrorController } from '../checkbox/wk-boolean-error-controller.js';

class GroupRequired extends Required {
  static override async getMessage(): Promise<string> {
    return 'Please select at least one option.';
  }
}

/**
 * Multiple-choice group of `wk-checkbox` on LionCheckboxGroup, with a visible group label,
 * help and error text. `required` means at least one selected. Each checked child submits its
 * own `name`/`value`; give the group and children the same `name` for repeated FormData entries.
 *
 * @tag wk-checkbox-group
 */
export class WkCheckboxGroup extends LionCheckboxGroup {
  static override get properties() {
    return {
      ...super.properties,
      required: { type: Boolean, reflect: true },
      error: { type: String },
    };
  }

  static override get styles() {
    return [...LionCheckboxGroup.styles, wkCheckboxGroupStyles];
  }

  declare required: boolean;
  declare error: string;
  #requiredValidator = new GroupRequired();

  constructor() {
    super();
    this.required = false;
    this.error = '';
    new WkBooleanErrorController(this, () => this);
  }

  override resetGroup(): void {
    this.error = '';
    super.resetGroup();
  }

  override _groupTwoTemplate() {
    return html`${super._groupTwoTemplate()}
      <div class="form-field__after"><slot name="after"></slot></div>`;
  }

  override updated(changed: PropertyValues): void {
    super.updated(changed);
    const has = this.validators.includes(this.#requiredValidator);
    if (this.required && !has) this.validators = [...this.validators, this.#requiredValidator];
    if (!this.required && has) {
      this.validators = this.validators.filter((v) => v !== this.#requiredValidator);
    }
  }
}
