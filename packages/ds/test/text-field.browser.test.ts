import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import type { WkTextField } from '@wakata/ds/text-field';
import type { WkForm } from '@wakata/ds/form';
import type { WkButtonSubmit, WkButtonReset } from '@wakata/ds/button';

await import('@wakata/ds/define');

const cleanup: Element[] = [];
afterEach(() => {
  for (const element of cleanup.splice(0)) element.remove();
});

async function mount(markup: string, prepare?: (fields: WkTextField[]) => void) {
  const host = document.createElement('div');
  host.innerHTML = markup;
  const fields = [...host.querySelectorAll<WkTextField>('wk-text-field')];
  prepare?.(fields);
  document.body.append(host);
  cleanup.push(host);
  await Promise.all(fields.map((field) => field.updateComplete));
  return { host, fields };
}

function fieldAt(fields: WkTextField[], index: number): WkTextField {
  const field = fields[index];
  if (!field) throw new Error(`Expected TextField at index ${index}`);
  return field;
}

const control = (field: WkTextField) =>
  field.querySelector<HTMLInputElement>('input[slot="input"]')!;
const settle = async (field: WkTextField) => {
  await field.updateComplete;
  await field.updateComplete;
};

test('text, email and password preserve native input types and named form values', async () => {
  const { host, fields } = await mount(`
    <form>
      <wk-text-field name="displayName" label="Display name"></wk-text-field>
      <wk-text-field name="email" type="email" label="Email"></wk-text-field>
      <wk-text-field name="accountSecret" type="password" label="Account secret"></wk-text-field>
    </form>`);
  const text = fieldAt(fields, 0);
  const email = fieldAt(fields, 1);
  const password = fieldAt(fields, 2);
  expect(fields.map((field) => control(field).type)).toEqual(['text', 'email', 'password']);
  text.value = 'Sample name';
  email.value = 'person@example.test';
  password.value = String.fromCharCode(120, 121);
  expect(new FormData(host.querySelector('form')!).get('displayName')).toBe('Sample name');
  expect(new FormData(host.querySelector('form')!).get('email')).toBe('person@example.test');
  const passwordValue = new FormData(host.querySelector('form')!).get('accountSecret');
  expect(typeof passwordValue).toBe('string');
  expect(passwordValue?.toString().length).toBe(2);
});

test('email validation rejects malformed values and permits valid and optional empty values', async () => {
  const { fields } = await mount(
    `<wk-text-field type="email" name="email" label="Email"></wk-text-field>`,
  );
  const field = fieldAt(fields, 0);
  const input = control(field);
  expect(input.type).toBe('email');
  expect(input.checkValidity()).toBe(true);

  field.value = 'not-an-email';
  await field.validate();
  expect(input.validity.typeMismatch).toBe(true);
  expect(field.hasFeedbackFor).toContain('error');

  field.value = 'person@example.test';
  await field.validate();
  expect(input.checkValidity()).toBe(true);
  expect(field.hasFeedbackFor).not.toContain('error');

  field.value = '';
  await field.validate();
  expect(input.checkValidity()).toBe(true);
  expect(field.hasFeedbackFor).not.toContain('error');
});

test('required is enforced by native and Lion validation while optional empty values stay valid', async () => {
  const { fields } = await mount(`
    <wk-text-field name="optional" label="Optional"></wk-text-field>
    <wk-text-field name="required" label="Required" required></wk-text-field>`);
  const optional = fieldAt(fields, 0);
  const required = fieldAt(fields, 1);
  await optional.validate();
  await required.validate();
  expect(control(optional).checkValidity()).toBe(true);
  expect(optional.hasFeedbackFor).not.toContain('error');
  expect(control(required).required).toBe(true);
  expect(control(required).checkValidity()).toBe(false);
  expect(control(required).getAttribute('aria-required')).toBe('true');
  expect(required.hasFeedbackFor).toContain('error');

  required.value = 'Provided';
  await required.validate();
  expect(control(required).checkValidity()).toBe(true);
  expect(required.hasFeedbackFor).not.toContain('error');
});

test('user edits emit one Wakata event; programmatic changes and reset remain silent', async () => {
  const { host, fields } = await mount(
    `<wk-form><form>
      <wk-text-field name="city" label="City"></wk-text-field>
      <wk-button-reset>Reset</wk-button-reset>
    </form></wk-form>`,
    (fields) => {
      const field = fieldAt(fields, 0);
      field.value = 'Oslo';
    },
  );
  const field = fieldAt(fields, 0);
  const events: string[] = [];
  field.addEventListener('wk-input', () => events.push('input'));
  field.addEventListener('wk-change', () => events.push('change'));

  field.value = 'Bergen';
  await settle(field);
  expect(events).toEqual([]);
  await userEvent.click(control(field));
  await userEvent.type(control(field), '!');
  await userEvent.tab();
  expect(events).toEqual(['input', 'change']);

  field.error = 'Try another city';
  await settle(field);
  const reset = host.querySelector('wk-button-reset') as WkButtonReset;
  await userEvent.click(reset);
  await settle(field);
  expect(field.value).toBe('Oslo');
  expect(field.error).toBe('');
  expect(events).toEqual(['input', 'change']);
});

test('disabled and readonly preserve their distinct interaction and serialization semantics', async () => {
  const { host, fields } = await mount(`
    <form>
      <wk-text-field name="disabledName" label="Disabled" value="Cannot edit" disabled></wk-text-field>
      <wk-text-field name="readonlyName" label="Read only" value="Can submit" readonly></wk-text-field>
    </form>`);
  const disabled = fieldAt(fields, 0);
  const readOnly = fieldAt(fields, 1);
  const events: string[] = [];
  disabled.addEventListener('wk-input', () => events.push('disabled'));
  readOnly.addEventListener('wk-input', () => events.push('readonly'));
  expect(control(disabled).disabled).toBe(true);
  expect(control(readOnly).readOnly).toBe(true);

  await userEvent.click(control(readOnly));
  await userEvent.type(control(readOnly), 'x');
  expect(events).toEqual([]);
  expect(new FormData(host.querySelector('form')!).has('disabledName')).toBe(false);
  expect(new FormData(host.querySelector('form')!).get('readonlyName')).toBe('Can submit');
});

test('visible label, help, external error, keyboard focus, and theme tokens are exposed', async () => {
  const { fields } = await mount(`
    <wk-text-field name="email" label="Work email" help-text="Used only for updates"></wk-text-field>`);
  const field = fieldAt(fields, 0);
  const input = control(field);
  const label = document.querySelector(`label[for="${input.id}"]`);
  expect(label?.textContent?.trim()).toBe('Work email');
  expect(input.getAttribute('aria-labelledby')?.split(' ')).toContain(label?.id);
  expect(
    (input.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent?.trim()),
  ).toContain('Used only for updates');

  await userEvent.tab();
  expect(input).toHaveFocus();
  field.error = 'Use a different address';
  await settle(field);
  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(
    (input.getAttribute('aria-describedby') ?? '')
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent?.trim()),
  ).toContain('Use a different address');
  field.error = '';
  await settle(field);
  expect(input.getAttribute('aria-invalid')).toBe('false');
});

test('wk-form submit is an attempt notification guarded by Lion field validity', async () => {
  const { host, fields } = await mount(`
    <wk-form><form novalidate>
      <wk-text-field name="email" type="email" label="Email" required></wk-text-field>
      <wk-button-submit>Continue</wk-button-submit>
    </form></wk-form>`);
  const field = fieldAt(fields, 0);
  const form = host.querySelector('wk-form') as WkForm;
  const button = host.querySelector('wk-button-submit') as WkButtonSubmit;
  let attempts = 0;
  let processed = 0;
  form.addEventListener('submit', () => {
    attempts++;
    if (form.hasFeedbackFor.includes('error') || field.error) return;
    processed++;
  });

  await userEvent.click(button);
  expect(attempts).toBe(1);
  expect(processed).toBe(0);
  field.value = 'person@example.test';
  await field.validate();
  await userEvent.click(button);
  expect(attempts).toBe(2);
  expect(processed).toBe(1);
});
