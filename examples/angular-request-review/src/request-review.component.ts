import '@angular/compiler';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  ElementRef,
  Input,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import '@wakata/ds/themes.css';
import '@wakata/ds/define';
import '@wakata/ds/mode-switch/define';
import '@wakata/ds/text-area/define';
import { WkValueAccessor } from './wk-value-accessor';
import { WkBooleanAccessor } from './wk-boolean-accessor';

type Wk = HTMLElement & {
  updateComplete: Promise<unknown>;
  error?: string;
  isPending?: boolean;
  opened?: boolean;
  open?: () => Promise<void>;
  close?: () => Promise<void>;
};

@Component({
  selector: 'app-request-review',
  standalone: true,
  imports: [ReactiveFormsModule, WkValueAccessor, WkBooleanAccessor],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <main>
      <wk-mode-switch></wk-mode-switch>
      <wk-card>
        <h1 slot="heading">Synthetic travel request</h1>
        <wk-form #wrapper (submit)="onSubmit()">
          <form [formGroup]="form" novalidate (reset)="onReset($event)" #nativeForm>
            <wk-text-field
              id="rr-name"
              #name
              formControlName="traveller"
              name="traveller"
              label="Traveller name"
              help-text="Synthetic name only."
              required
            ></wk-text-field>
            <wk-select
              id="rr-destination"
              #destination
              formControlName="destination"
              name="destination"
              label="Destination"
              required
            >
              <select slot="input">
                <option value="">Choose a destination</option>
                <option value="oslo">Oslo</option>
                <option value="bergen">Bergen</option>
              </select>
            </wk-select>
            <wk-text-area
              id="rr-notes"
              formControlName="notes"
              name="notes"
              label="Notes (optional)"
              help-text="Synthetic notes only."
            ></wk-text-area>
            <wk-checkbox-group id="rr-channels" name="channels[]" label="Contact channels" required>
              <wk-checkbox
                id="rr-channel-email"
                formControlName="email"
                name="channels[]"
                label="Email"
                [choiceValue]="'email'"
              ></wk-checkbox>
              <wk-checkbox
                id="rr-channel-sms"
                formControlName="sms"
                name="channels[]"
                label="Text message"
                [choiceValue]="'sms'"
              ></wk-checkbox>
            </wk-checkbox-group>
            <wk-radio-group
              id="rr-priority"
              formControlName="priority"
              name="priority"
              label="Inspection priority (optional)"
              help-text="Choose the first area to inspect."
            >
              <wk-radio label="Bodywork" [choiceValue]="'body'"></wk-radio>
              <wk-radio label="Engine" [choiceValue]="'engine'"></wk-radio>
            </wk-radio-group>
            <div class="actions">
              <wk-button-submit
                id="rr-submit"
                variant="primary"
                [attr.disabled]="processing() ? '' : null"
                >Review request</wk-button-submit
              >
              <wk-button-reset>Reset</wk-button-reset>
            </div>
            <output id="rr-status" aria-live="polite">{{ status() }}</output>
          </form>
        </wk-form>
        <wk-switch
          id="rr-compact"
          name="compact"
          label="Compact summary"
          [checked]="compact()"
          (wk-input)="compact.set($any($event).detail.checked)"
        ></wk-switch>
        <div slot="actions">
          <div id="rr-scope" data-wk-theme="studio">
            <wk-dialog #dialog>
              <wk-button id="rr-reopen" slot="invoker" [attr.disabled]="reviewReady() ? null : ''"
                >Reopen review</wk-button
              >
              <section slot="content" aria-labelledby="rr-title" aria-describedby="rr-desc">
                <h2 id="rr-title">Review request</h2>
                <p id="rr-desc">
                  Mock only: <span id="rr-summary">{{ summary() }}</span
                  >. Nothing is sent.
                </p>
                @if (notesSummary()) {
                  <p id="rr-notes-summary" style="white-space: pre-wrap">{{ notesSummary() }}</p>
                }
                <div class="actions">
                  <wk-button
                    id="rr-cancel"
                    [attr.disabled]="processing() ? '' : null"
                    (click)="cancel()"
                    >Cancel</wk-button
                  >
                  <wk-button
                    id="rr-confirm"
                    variant="primary"
                    [attr.loading]="processing() ? '' : null"
                    (click)="confirm()"
                    >Confirm</wk-button
                  >
                </div>
              </section>
            </wk-dialog>
          </div>
        </div>
      </wk-card>
    </main>
  `,
})
export class RequestReviewComponent {
  @Input() completionMs = 600;
  @Input() onComplete?: (d: { traveller: string; destination: string; notes: string }) => void;

  readonly form = new FormGroup({
    traveller: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    destination: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    notes: new FormControl('', { nonNullable: true }),
    email: new FormControl(false, { nonNullable: true }),
    sms: new FormControl(false, { nonNullable: true }),
    priority: new FormControl('', { nonNullable: true }),
  });
  readonly compact = signal(false);
  readonly status = signal('');
  readonly processing = signal(false);
  readonly reviewReady = signal(false);
  readonly summary = signal(' → ');
  readonly notesSummary = signal('');

  constructor() {
    this.form.valueChanges.subscribe(() => {
      if (this.status().startsWith('Please correct')) this.status.set('');
    });
  }

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private busy = false;
  private validating = false;

  private find<T extends Element>(selector: string): T {
    const element = this.host.querySelector<T>(selector);
    if (!element) throw new Error(`Missing request-review element: ${selector}`);
    return element;
  }

  setExternalError(message: string): void {
    this.find<Wk>('wk-text-field').error = message;
  }
  setReadonly(on: boolean): void {
    const el = this.find<Wk>('wk-text-field') as unknown as {
      readOnly: boolean;
      readonly: boolean;
    };
    el.readOnly = on;
    el.readonly = on;
  }

  private updateSummary(): void {
    const v = this.form.getRawValue();
    this.summary.set(
      `${v.traveller} → ${v.destination}${v.priority ? ` · ${v.priority} inspection first` : ''}`,
    );
    this.notesSummary.set(v.notes);
  }

  async onSubmit(): Promise<void> {
    const dialog = this.find<Wk>('wk-dialog');
    if (this.busy || this.validating || dialog.opened) {
      this.status.set('Request already in progress.');
      return;
    }
    this.validating = true;
    const fields = [
      this.find<Wk>('wk-text-field'),
      this.find<Wk>('wk-select'),
      this.find<Wk>('wk-text-area'),
      this.find<Wk>('wk-checkbox-group'),
    ];
    try {
      await Promise.all(fields.map((f) => f.updateComplete));
    } finally {
      this.validating = false;
    }
    const bad = [...this.find<HTMLFormElement>('form').elements].find(
      (el) => !(el as HTMLInputElement).checkValidity?.(),
    );
    const { email, sms } = this.form.getRawValue();
    if (
      bad ||
      !(email || sms) ||
      this.find<Wk>('wk-checkbox-group').error ||
      this.form.invalid ||
      this.find<Wk & { hasFeedbackFor: string[] }>('wk-form').hasFeedbackFor.includes('error') ||
      fields.some((f) => f.error || f.isPending)
    ) {
      this.form.markAllAsTouched();
      this.status.set('Please correct the highlighted fields before review.');
      return;
    }
    this.reviewReady.set(true);
    this.updateSummary();
    this.status.set('Ready for review.');
    await dialog.open?.();
  }

  async cancel(): Promise<void> {
    if (this.busy) return;
    this.status.set('Review cancelled. Nothing was submitted.');
    await this.find<Wk>('wk-dialog').close?.();
  }

  async confirm(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    this.processing.set(true);
    this.status.set('Completing mock request…');
    await new Promise((r) => setTimeout(r, this.completionMs));
    this.busy = false;
    this.processing.set(false);
    const { traveller, destination, notes } = this.form.getRawValue();
    this.onComplete?.({ traveller, destination, notes });
    this.status.set('Mock request complete. No real action was taken.');
    await this.find<Wk>('wk-dialog').close?.();
  }

  onReset(e: Event): void {
    if (this.busy) {
      e.preventDefault();
      return;
    }
    this.form.reset({
      traveller: '',
      destination: '',
      notes: '',
      email: false,
      sms: false,
      priority: '',
    });
    this.reviewReady.set(false);
    this.status.set('');
  }
}
