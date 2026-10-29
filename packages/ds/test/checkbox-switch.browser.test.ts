import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import type { WkCheckbox } from '@wakata/ds/checkbox';
import type { WkCheckboxGroup } from '@wakata/ds/checkbox-group';
import type { WkSwitch } from '@wakata/ds/switch';

await import('@wakata/ds/define');

const must = <T>(value: T | null | undefined): T => {
  if (value == null) throw new Error('Expected element');
  return value;
};

const cleanup: Element[] = [];
afterEach(() => {
  for (const element of cleanup.splice(0)) element.remove();
});

async function mount(markup: string) {
  const host = document.createElement('div');
  host.innerHTML = markup;
  document.body.append(host);
  cleanup.push(host);
  const els = [
    ...host.querySelectorAll<WkCheckbox | WkCheckboxGroup | WkSwitch>(
      'wk-checkbox, wk-checkbox-group, wk-switch',
    ),
  ];
  await Promise.all(els.map((el) => el.updateComplete));
  return host;
}

test('checkbox serializes only when checked, with explicit value, and resets', async () => {
  const host = await mount(
    `<wk-form><form><wk-checkbox name="terms" label="Accept"></wk-checkbox></form></wk-form>`,
  );
  const form = host.querySelector('form')!;
  const box = must(host.querySelector<WkCheckbox>('wk-checkbox'));
  box.choiceValue = 'yes';
  expect(new FormData(form).has('terms')).toBe(false);
  box.checked = true;
  await box.updateComplete;
  expect(new FormData(form).get('terms')).toBe('yes');
  box.disabled = true;
  await box.updateComplete;
  expect(new FormData(form).has('terms')).toBe(false);
  box.disabled = false;
  form.reset();
  await box.updateComplete;
  expect(box.checked).toBe(false);
});

test('checkbox emits one wk-input and one wk-change per user activation, none programmatically', async () => {
  const host = await mount(`<wk-checkbox name="a" label="A"></wk-checkbox>`);
  const box = must(host.querySelector<WkCheckbox>('wk-checkbox'));
  const seen: string[] = [];
  box.addEventListener('wk-input', (e: Event) =>
    seen.push(`i${(e as CustomEvent<{ checked: boolean }>).detail.checked}`),
  );
  box.addEventListener('wk-change', (e: Event) =>
    seen.push(`c${(e as CustomEvent<{ checked: boolean }>).detail.checked}`),
  );
  box.checked = true;
  await box.updateComplete;
  expect(seen).toEqual([]);
  await userEvent.click(box.querySelector('input')!);
  expect(seen).toEqual(['ifalse', 'cfalse']);
});

test('required checkbox is invalid until checked; role and name are native', async () => {
  const host = await mount(`<wk-checkbox label="Agree" required></wk-checkbox>`);
  const box = must(host.querySelector<WkCheckbox>('wk-checkbox'));
  const input = box.querySelector('input')! as HTMLInputElement;
  expect(input.type).toBe('checkbox');
  expect(input.required).toBe(true);
  await box.validate?.();
  expect(box.hasFeedbackFor.includes('error')).toBe(true);
  box.checked = true;
  await box.updateComplete;
  await box.validate?.();
  expect(box.hasFeedbackFor.includes('error')).toBe(false);
});

test('checkbox external error is associated and cleared on reset', async () => {
  const host = await mount(
    `<wk-form><form><wk-checkbox name="agree" label="Agree" help-text="Review the terms"></wk-checkbox></form></wk-form>`,
  );
  const box = must(host.querySelector<WkCheckbox>('wk-checkbox'));
  const input = box.querySelector('input')! as HTMLInputElement;
  box.error = 'Consent unavailable';
  await box.updateComplete;
  await box.updateComplete;
  expect(box.querySelector('[data-wk-external-error]')).not.toBeNull();
  expect(
    (box.querySelector('[data-wk-external-error]') as HTMLElement).assignedSlot,
  ).not.toBeNull();
  expect(input.getAttribute('aria-invalid')).toBe('true');
  const ids = (input.getAttribute('aria-describedby') ?? '').split(' ');
  expect(ids.some((id) => document.getElementById(id)?.textContent === 'Consent unavailable')).toBe(
    true,
  );
  host.querySelector('form')!.reset();
  await box.updateComplete;
  expect(box.error).toBe('');
  expect(box.querySelector('[data-wk-external-error]')).toBeNull();
});

test('checkbox group required needs one selection and submits checked children', async () => {
  const host = await mount(`<form><wk-checkbox-group name="c[]" label="Colours" required>
    <wk-checkbox label="Red"></wk-checkbox>
    <wk-checkbox label="Blue"></wk-checkbox></wk-checkbox-group></form>`);
  const group = must(host.querySelector<WkCheckboxGroup>('wk-checkbox-group'));
  const [r0, b0] = host.querySelectorAll<WkCheckbox>('wk-checkbox');
  must(r0);
  must(b0);
  must(r0).choiceValue = 'red';
  must(b0).choiceValue = 'blue';
  await group.validate?.();
  expect(group.hasFeedbackFor.includes('error')).toBe(true);
  const [red] = host.querySelectorAll<WkCheckbox>('wk-checkbox');
  must(red).checked = true;
  await must(red).updateComplete;
  await group.validate?.();
  expect(group.hasFeedbackFor.includes('error')).toBe(false);
  expect(group.modelValue).toEqual(['red']);
  expect(new FormData(host.querySelector('form')!).getAll('c[]')).toEqual(['red']);
});

test('group external error is associated with the group and clears on form reset', async () => {
  const host = await mount(
    `<wk-form><form><wk-checkbox-group name="c[]" label="Colours" help-text="Pick one"><wk-checkbox label="Red"></wk-checkbox></wk-checkbox-group></form></wk-form>`,
  );
  const group = must(host.querySelector<WkCheckboxGroup>('wk-checkbox-group'));
  expect(group.getAttribute('role')).toBe('group');
  group.error = 'Unavailable';
  await group.updateComplete;
  await group.updateComplete;
  expect(group.querySelector('[data-wk-external-error]')).not.toBeNull();
  expect(
    (group.querySelector('[data-wk-external-error]') as HTMLElement).assignedSlot,
  ).not.toBeNull();
  expect(group.getAttribute('aria-invalid')).toBe('true');
  const ids: string[] = (group.getAttribute('aria-describedby') ?? '').split(' ');
  expect(ids.some((id) => document.getElementById(id)?.textContent === 'Unavailable')).toBe(true);
  host.querySelector('form')!.reset();
  await group.updateComplete;
  expect(group.error).toBe('');
});

test('checkbox label click and keyboard activation each change once; disabled blocks both', async () => {
  const host = await mount(`<wk-checkbox name="agree" label="Agree to terms"></wk-checkbox>`);
  const box = must(host.querySelector<WkCheckbox>('wk-checkbox'));
  const input = box.querySelector('input')! as HTMLInputElement;
  const label = box.querySelector('[slot="label"]') as HTMLElement;
  const seen: boolean[] = [];
  box.addEventListener('wk-change', (e: Event) =>
    seen.push((e as CustomEvent<{ checked: boolean }>).detail.checked),
  );
  await userEvent.click(label);
  expect(box.checked).toBe(true);
  expect(seen).toEqual([true]);
  input.focus();
  await userEvent.keyboard(' ');
  expect(box.checked).toBe(false);
  expect(seen).toEqual([true, false]);
  box.disabled = true;
  await box.updateComplete;
  label.click();
  expect(box.checked).toBe(false);
  expect(seen).toEqual([true, false]);
});

test('switch toggles by click, exposes role=switch, emits once, is silent programmatically', async () => {
  const host = await mount(`<wk-switch label="Alerts"></wk-switch>`);
  const sw = must(host.querySelector<WkSwitch>('wk-switch'));
  const button = sw.querySelector('[role="switch"]')! as HTMLElement;
  const seen: boolean[] = [];
  sw.addEventListener('wk-change', (e: Event) =>
    seen.push((e as CustomEvent<{ checked: boolean }>).detail.checked),
  );
  sw.checked = true;
  await sw.updateComplete;
  expect(seen).toEqual([]);
  await userEvent.click(button);
  await sw.updateComplete;
  expect(seen).toEqual([false]);
  expect(button.getAttribute('aria-checked')).toBe('false');
});

test('switch keyboard activation has one change, stays outside FormData, and disabled blocks input', async () => {
  const host = await mount(`<form><wk-switch name="alerts" label="Alerts"></wk-switch></form>`);
  const sw = must(host.querySelector<WkSwitch>('wk-switch'));
  const button = sw.querySelector('[role="switch"]')! as HTMLElement;
  const seen: boolean[] = [];
  sw.addEventListener('wk-change', (e: Event) =>
    seen.push((e as CustomEvent<{ checked: boolean }>).detail.checked),
  );
  button.focus();
  await userEvent.keyboard(' ');
  expect(sw.checked).toBe(true);
  expect(seen).toEqual([true]);
  expect(new FormData(host.querySelector('form')!).has('alerts')).toBe(false);
  sw.disabled = true;
  await sw.updateComplete;
  button.click();
  expect(sw.checked).toBe(true);
  expect(seen).toEqual([true]);
});

test('switch label click and Enter each toggle once with a stable label', async () => {
  const host = await mount(`<wk-switch label="Alerts"></wk-switch>`);
  const sw = must(host.querySelector<WkSwitch>('wk-switch'));
  const button = sw.querySelector('[role="switch"]')! as HTMLElement;
  const label = sw.querySelector('[slot="label"]') as HTMLElement;
  const seen: boolean[] = [];
  sw.addEventListener('wk-change', (e: Event) =>
    seen.push((e as CustomEvent<{ checked: boolean }>).detail.checked),
  );
  await userEvent.click(label);
  expect(sw.checked).toBe(true);
  button.focus();
  await userEvent.keyboard('{Enter}');
  expect(sw.checked).toBe(false);
  expect(seen).toEqual([true, false]);
  expect(label.textContent).toBe('Alerts');
});
