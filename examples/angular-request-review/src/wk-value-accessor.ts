import { Directive, ElementRef, forwardRef, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

type WkField = HTMLElement & { value: string; disabled: boolean };

/**
 * ControlValueAccessor for `wk-text-field` / `wk-text-area` / `wk-select`.
 * - Bridges the `wk-input` custom event once (Angular does not know it).
 * - `writeValue` sets `.value` programmatically; the elements emit no wk-input for that,
 *   so there is no feedback loop or duplicate update.
 * - `focusout` marks touched; `setDisabledState` drives the element's `disabled`.
 * Required, readonly and external errors stay on the element (attribute/property/`error`).
 */
@Directive({
  selector:
    'wk-text-area[formControlName],wk-text-area[formControl],wk-text-area[ngModel],wk-text-field[formControlName],wk-text-field[formControl],wk-text-field[ngModel],wk-select[formControlName],wk-select[formControl],wk-select[ngModel],wk-radio-group[formControlName],wk-radio-group[formControl],wk-radio-group[ngModel]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WkValueAccessor), multi: true },
  ],
})
export class WkValueAccessor implements ControlValueAccessor {
  private readonly el = inject<ElementRef<WkField>>(ElementRef).nativeElement;
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};
  private pendingValue = '';
  private writeScheduled = false;

  constructor() {
    this.el.addEventListener('wk-input', (e) =>
      this.onChange((e as CustomEvent<{ value: string }>).detail.value),
    );
    this.el.addEventListener('focusout', () => this.onTouched());
  }

  writeValue(value: string | null): void {
    this.pendingValue = value ?? '';
    if (this.writeScheduled) return;
    this.writeScheduled = true;
    // Angular calls writeValue while the <select slot="input"> is still being
    // constructed. Flush after its template pass so Lion can format the value.
    queueMicrotask(() => {
      this.writeScheduled = false;
      if (this.el.value !== this.pendingValue) this.el.value = this.pendingValue;
    });
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.el.disabled = isDisabled;
  }
}
