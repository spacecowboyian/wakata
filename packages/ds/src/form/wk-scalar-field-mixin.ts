import type { LionField } from '@lion/ui/form-core.js';
import { WkFieldController, type WkFieldHost } from './wk-field-controller.js';

/**
 * Shared scalar-string facade for Lion input/select subclasses. Does not register an
 * element or provide a component's appearance. Do not use with numeric/date parsers.
 * The inherited view getter is retained so Lion can parse a user's current native value.
 */
export function WkScalarFieldMixin<T extends typeof LionField>(
  Base: T,
): Omit<T, 'prototype'> & {
  new (): InstanceType<T> & { error: string };
} {
  const FieldBase: typeof LionField = Base;
  class WkScalarField extends FieldBase {
    static override get properties() {
      return { ...super.properties, error: { type: String } };
    }

    declare error: string;

    constructor() {
      super();
      this.error = '';
      new WkFieldController(this as unknown as WkFieldHost);
    }

    override get value(): string {
      return super.value;
    }

    override set value(value: string) {
      // A native select normalizes an unavailable option to the empty string. Keep
      // every representation aligned with that actual selection, not the request.
      const control = this.querySelector(':scope > select[slot="input"]');
      if (control instanceof HTMLSelectElement) {
        control.value = value;
        value = control.value;
      }
      super.value = value;
      this.modelValue = value;
      // Lion also calls this setter during formatting. If normalization happens
      // inside that calculation, its reentrancy guard suppresses a second model
      // calculation; keep serialization consistent using the public serializer.
      if (typeof this.serializer === 'function') {
        this.serializedValue = this.serializer(value);
      }
    }

    override connectedCallback(): void {
      super.connectedCallback();
      // Native controls may be created only during connection. Reconcile values
      // supplied earlier once the real control/options are available.
      const value = this.value;
      this.value = value;
    }

    override reset(): void {
      this.error = '';
      super.reset();
    }
  }
  return WkScalarField as unknown as Omit<T, 'prototype'> & {
    new (): InstanceType<T> & { error: string };
  };
}
