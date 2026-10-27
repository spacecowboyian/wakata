import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { LionSelect } from '@lion/ui/select.js';
import type { WkSelect } from '@wakata/ds/select';
import type { WkForm } from '@wakata/ds/form';

await import('@wakata/ds/define');
const cleanup: Element[] = [];
afterEach(() => cleanup.splice(0).forEach((node) => node.remove()));

async function mount(initial?: string, valueAttribute = '') {
  const host = document.createElement('div');
  host.innerHTML = `<wk-form><form novalidate>
    <wk-select name="destination" label="Destination" help-text="Choose one destination." ${valueAttribute}>
      <select slot="input"><option value="">Choose a destination</option>
        <option value="oslo">Oslo</option><option value="bergen">Bergen</option></select>
    </wk-select>
    <wk-button-submit>Continue</wk-button-submit><wk-button-reset>Reset</wk-button-reset>
  </form></wk-form>`;
  const field = host.querySelector<WkSelect>('wk-select')!;
  if (initial !== undefined) field.value = initial;
  document.body.append(host);
  cleanup.push(host);
  await settle(field);
  return {
    host,
    field,
    select: field.querySelector('select')!,
    form: host.querySelector('form')!,
    wrapper: host.querySelector<WkForm>('wk-form')!,
  };
}
async function settle(field: WkSelect) {
  await field.updateComplete;
  await field.updateComplete;
}

test('real LionSelect has an empty optional prompt, name, help and native form value', async () => {
  const { field, select, form } = await mount();
  expect(field).toBeInstanceOf(LionSelect);
  expect([field.value, field.modelValue, field.serializedValue, select.value]).toEqual([
    '',
    '',
    '',
    '',
  ]);
  expect(select.multiple).toBe(false);
  expect(select.checkValidity()).toBe(true);
  expect(
    select
      .getAttribute('aria-labelledby')
      ?.split(' ')
      .some((id) => document.getElementById(id)?.textContent === 'Destination'),
  ).toBe(true);
  expect(
    select
      .getAttribute('aria-describedby')
      ?.split(' ')
      .some((id) => document.getElementById(id)?.textContent === 'Choose one destination.'),
  ).toBe(true);
  expect(new FormData(form).get('destination')).toBe('');
});

test('default, programmatic, unavailable values and reset agree without user events', async () => {
  const { host, field, select, form } = await mount('oslo');
  const events: Event[] = [];
  field.addEventListener('wk-input', (event) => events.push(event));
  field.addEventListener('wk-change', (event) => events.push(event));
  expect(field.value).toBe('oslo');
  field.value = 'bergen';
  await settle(field);
  expect([
    field.modelValue,
    field.serializedValue,
    select.value,
    new FormData(form).get('destination'),
  ]).toEqual(['bergen', 'bergen', 'bergen', 'bergen']);
  field.value = 'unavailable';
  await settle(field);
  expect([field.value, field.modelValue, field.serializedValue]).toEqual(['', '', '']);
  field.error = 'Synthetic error';
  await userEvent.click(host.querySelector('wk-button-reset')!);
  await settle(field);
  expect([field.value, field.modelValue, select.value]).toEqual(['oslo', 'oslo', 'oslo']);
  expect(field.error).toBe('');
  expect(events).toEqual([]);
});

test('host value attribute initializes the scalar model and reset default without user events', async () => {
  const { host, field, select, form } = await mount(undefined, 'value="bergen"');
  const events: Event[] = [];
  field.addEventListener('wk-input', (event) => events.push(event));
  field.addEventListener('wk-change', (event) => events.push(event));
  expect([field.value, field.modelValue, field.serializedValue, select.value]).toEqual([
    'bergen',
    'bergen',
    'bergen',
    'bergen',
  ]);
  expect(new FormData(form).get('destination')).toBe('bergen');
  field.value = 'oslo';
  await settle(field);
  host.remove();
  document.body.append(host);
  await settle(field);
  expect(field.value).toBe('oslo');
  await userEvent.click(host.querySelector('wk-button-reset')!);
  await settle(field);
  expect([field.value, field.modelValue, field.serializedValue, select.value]).toEqual([
    'bergen',
    'bergen',
    'bergen',
    'bergen',
  ]);
  expect(new FormData(form).get('destination')).toBe('bergen');
  expect(events).toEqual([]);
});

test('explicit initial scalar property wins over the host attribute and unknown defaults normalize', async () => {
  const explicit = await mount('oslo', 'value="bergen"');
  expect(explicit.field.value).toBe('oslo');
  explicit.field.value = 'bergen';
  explicit.field.reset();
  await settle(explicit.field);
  expect(explicit.select.value).toBe('oslo');
  const unavailable = await mount(undefined, 'value="unavailable"');
  expect([
    unavailable.field.value,
    unavailable.field.modelValue,
    unavailable.field.serializedValue,
  ]).toEqual(['', '', '']);
  unavailable.field.value = 'bergen';
  unavailable.field.reset();
  await settle(unavailable.field);
  expect(unavailable.select.value).toBe('');
});

test('native user selection emits exactly one input and commit with scalar detail', async () => {
  const { host, field, select } = await mount();
  const events: { type: string; detail: unknown; composed: boolean }[] = [];
  for (const type of ['wk-input', 'wk-change']) {
    host.addEventListener(type, (event) =>
      events.push({ type, detail: (event as CustomEvent).detail, composed: event.composed }),
    );
  }
  await userEvent.selectOptions(select, 'bergen');
  expect(events).toEqual([
    { type: 'wk-input', detail: { value: 'bergen', name: 'destination' }, composed: true },
    { type: 'wk-change', detail: { value: 'bergen', name: 'destination' }, composed: true },
  ]);
  expect(field.modelValue).toBe('bergen');
});

test('required and external error retain separate validation and description state in a real form', async () => {
  const { host, field, select, wrapper } = await mount();
  field.required = true;
  await settle(field);
  let attempts = 0;
  wrapper.addEventListener('submit', () => attempts++);
  await userEvent.click(host.querySelector('wk-button-submit')!);
  expect(attempts).toBe(1);
  expect(select.required).toBe(true);
  expect(select.validity.valueMissing).toBe(true);
  expect(field.hasFeedbackFor).toContain('error');
  expect(select.getAttribute('aria-invalid')).toBe('true');
  await expect
    .poll(() => field.querySelector('[slot="feedback"]')?.shadowRoot?.textContent)
    .toContain('Please select an option.');
  expect(field.querySelector('[slot="feedback"]')?.shadowRoot?.textContent).not.toContain(
    'Please configure an error message',
  );
  field.focus();
  expect(document.activeElement).toBe(select);
  const baseline = select.getAttribute('aria-describedby');
  field.error = 'Destination is unavailable.';
  await settle(field);
  expect(select.getAttribute('aria-describedby')).not.toBe(baseline);
  expect(field.querySelector('[data-wk-external-error]')?.textContent).toBe(field.error);
  field.value = 'oslo';
  await field.validate();
  expect(select.getAttribute('aria-invalid')).toBe('true');
  field.error = '';
  await settle(field);
  expect(select.getAttribute('aria-describedby')).toBe(baseline);
  expect(select.checkValidity()).toBe(true);
  await userEvent.click(host.querySelector('wk-button-reset')!);
  await settle(field);
  expect(field.submitted).toBe(false);
  expect(field.value).toBe('');
});

test('disabled skips focus and serialization; native keyboard type-ahead selects a scalar value', async () => {
  const { field, select, form } = await mount();
  field.disabled = true;
  await settle(field);
  expect(select.disabled).toBe(true);
  expect(new FormData(form).has('destination')).toBe(false);
  field.focus();
  expect(document.activeElement).not.toBe(select);
  field.disabled = false;
  await settle(field);
  field.focus();
  expect(document.activeElement).toBe(select);
  const events: string[] = [];
  field.addEventListener('wk-input', () => events.push('input'));
  field.addEventListener('wk-change', () => events.push('change'));
  // Headless Chromium on macOS cannot drive its OS popup with ArrowDown/Enter.
  // Native type-ahead works without opening the popup; no synthetic change is dispatched.
  await userEvent.keyboard('o');
  await userEvent.tab();
  expect(select.value).toBe('oslo');
  expect(field.modelValue).toBe('oslo');
  expect(new FormData(form).get('destination')).toBe('oslo');
  expect(events).toEqual(['input', 'change']);
});
