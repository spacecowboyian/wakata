import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import type { WkTextArea } from '@wakata/ds/text-area';
import type { WkButtonReset } from '@wakata/ds/button';

await import('@wakata/ds/define');

const cleanup: Element[] = [];
afterEach(() => {
  for (const element of cleanup.splice(0)) element.remove();
});

async function mount(markup: string, prepare?: (fields: WkTextArea[]) => void) {
  const host = document.createElement('div');
  host.innerHTML = markup;
  const fields = [...host.querySelectorAll<WkTextArea>('wk-text-area')];
  prepare?.(fields);
  document.body.append(host);
  cleanup.push(host);
  await Promise.all(fields.map((field) => field.updateComplete));
  return { host, fields };
}

const first = (fields: WkTextArea[]): WkTextArea => {
  const field = fields[0];
  if (!field) throw new Error('Expected TextArea');
  return field;
};
const control = (field: WkTextArea) =>
  field.querySelector<HTMLTextAreaElement>('textarea[slot="input"]')!;
const settle = async (field: WkTextArea) => {
  await field.updateComplete;
  await field.updateComplete;
};

test('native textarea with named FormData keeps line breaks and aligned values', async () => {
  const { host, fields } = await mount(
    `<form><wk-text-area name="notes" label="Notes"></wk-text-area></form>`,
  );
  const field = first(fields);
  field.value = 'one\ntwo';
  expect(control(field).tagName).toBe('TEXTAREA');
  expect(control(field).value).toBe('one\ntwo');
  expect(field.modelValue).toBe('one\ntwo');
  expect(field.serializedValue).toBe('one\ntwo');
  expect(
    String(new FormData(host.querySelector('form')!).get('notes')).replace(/\r\n/g, '\n'),
  ).toBe('one\ntwo');
});

test('user edits emit one wk-input and one wk-change; programmatic and reset are silent', async () => {
  const { host, fields } = await mount(
    `<wk-form><form>
      <wk-text-area name="notes" label="Notes"></wk-text-area>
      <wk-button-reset>Reset</wk-button-reset>
    </form></wk-form>`,
    (fields) => {
      first(fields).value = 'Initial';
    },
  );
  const field = first(fields);
  const events: string[] = [];
  field.addEventListener('wk-input', () => events.push('input'));
  field.addEventListener('wk-change', () => events.push('change'));
  field.value = 'Programmatic';
  await settle(field);
  expect(events).toEqual([]);
  await userEvent.click(control(field));
  await userEvent.type(control(field), '!');
  await userEvent.tab();
  expect(events).toEqual(['input', 'change']);
  field.error = 'Rejected';
  await settle(field);
  await userEvent.click(host.querySelector('wk-button-reset') as WkButtonReset);
  await settle(field);
  expect(field.value).toBe('Initial');
  expect(field.error).toBe('');
  expect(events).toEqual(['input', 'change']);
});

test('required validation and external error', async () => {
  const { fields } = await mount(
    `<wk-text-area name="n" label="Notes" help-text="Help" required></wk-text-area>`,
  );
  const field = first(fields);
  await field.validate();
  expect(control(field).required).toBe(true);
  expect(control(field).getAttribute('aria-required')).toBe('true');
  expect(field.hasFeedbackFor).toContain('error');
  field.value = 'ok';
  await field.validate();
  expect(field.hasFeedbackFor).not.toContain('error');
  field.error = 'Server says no';
  await settle(field);
  expect(control(field).getAttribute('aria-invalid')).toBe('true');
  const descriptions = (control(field).getAttribute('aria-describedby') ?? '')
    .split(' ')
    .map((id) => document.getElementById(id)?.textContent?.trim());
  expect(descriptions).toContain('Help');
  expect(descriptions).toContain('Server says no');
});

test('disabled is excluded from FormData; readonly is focusable and included', async () => {
  const { host, fields } = await mount(`<form>
    <wk-text-area name="d" label="D" disabled></wk-text-area>
    <wk-text-area name="r" label="R" readonly></wk-text-area></form>`);
  fields[0]!.value = 'x';
  fields[1]!.value = 'y';
  const data = new FormData(host.querySelector('form')!);
  expect(data.has('d')).toBe(false);
  expect(data.get('r')).toBe('y');
  expect(control(first(fields)).disabled).toBe(true);
  const readonly = fields[1]!;
  control(readonly).focus();
  expect(document.activeElement).toBe(control(readonly));
  expect(control(readonly).readOnly).toBe(true);
  await userEvent.type(control(readonly), 'z');
  expect(control(readonly).value).toBe('y');
});

test('keyboard editing can replace a selection after a line break', async () => {
  const { fields } = await mount(`<wk-text-area name="n" label="Notes"></wk-text-area>`);
  const field = first(fields);
  field.value = 'one\ntwo';
  await settle(field);
  const input = control(field);
  input.focus();
  input.setSelectionRange(4, 7);
  await userEvent.keyboard('new');
  expect(field.value).toBe('one\nnew');
  expect(input.selectionStart).toBe(7);
  expect(input.selectionEnd).toBe(7);
});

test('label names the control and focus is visible', async () => {
  const { fields } = await mount(`<wk-text-area name="n" label="Notes"></wk-text-area>`);
  const input = control(first(fields));
  await userEvent.tab();
  expect(document.activeElement).toBe(input);
  expect(getComputedStyle(input).outlineStyle).toBe('solid');
  expect(input.getAttribute('aria-labelledby')).toBeTruthy();
});

test('rows default to 2, max-rows to 6, grow then cap, no drag resize', async () => {
  const { fields } = await mount(`<wk-text-area name="n" label="Notes"></wk-text-area>`);
  const field = first(fields);
  const input = control(field);
  expect(field.rows).toBe(2);
  expect(field.maxRows).toBe(6);
  expect(getComputedStyle(input).resize).toBe('none');
  const empty = input.getBoundingClientRect().height;
  field.value = Array.from({ length: 4 }, (_, i) => `l${i}`).join('\n');
  await settle(field);
  await vi.waitFor(() => expect(input.getBoundingClientRect().height).toBeGreaterThan(empty));
  field.value = Array.from({ length: 20 }, (_, i) => `l${i}`).join('\n');
  await settle(field);
  await vi.waitFor(() => expect(input.scrollHeight).toBeGreaterThan(input.clientHeight));
  const capped = input.getBoundingClientRect().height;
  expect(capped).toBeLessThan(20 * 24);
  field.maxRows = 3;
  await settle(field);
  await vi.waitFor(() => expect(input.getBoundingClientRect().height).toBeLessThan(capped));
});

test('long unbroken content wraps in a narrow container', async () => {
  const { host, fields } = await mount(
    `<div style="width:240px"><wk-text-area name="n" label="Notes"></wk-text-area></div>`,
  );
  const field = first(fields);
  field.value = 'x'.repeat(200);
  await settle(field);
  const box = host.firstElementChild as HTMLElement;
  expect(box.scrollWidth).toBeLessThanOrEqual(box.clientWidth);
  expect(control(field).scrollWidth).toBeLessThanOrEqual(control(field).clientWidth);
});
