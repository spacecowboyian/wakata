import { Directive, ElementRef, forwardRef, inject } from '@angular/core';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

type WkBoolean = HTMLElement & { checked: boolean; disabled: boolean };

/**
 * Boolean ControlValueAccessor for `wk-checkbox` only. Reads `detail.checked` from `wk-input`;
 * `writeValue` sets `.checked`, which emits no event, so there is no echo.
 */
@Directive({
  selector: 'wk-checkbox[formControlName],wk-checkbox[formControl],wk-checkbox[ngModel]',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => WkBooleanAccessor), multi: true },
  ],
})
export class WkBooleanAccessor implements ControlValueAccessor {
  private readonly el = inject<ElementRef<WkBoolean>>(ElementRef).nativeElement;
  private onChange: (v: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.el.addEventListener('wk-input', (e) =>
      this.onChange((e as CustomEvent<{ checked: boolean }>).detail.checked),
    );
    this.el.addEventListener('focusout', () => this.onTouched());
  }

  writeValue(value: boolean | null): void {
    const next = !!value;
    // The element may not be upgraded/rendered yet when Angular first writes.
    queueMicrotask(() => {
      if (this.el.checked !== next) this.el.checked = next;
    });
  }
  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.el.disabled = isDisabled;
  }
}
