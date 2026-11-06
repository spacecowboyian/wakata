import { afterAll, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

interface Group extends HTMLElement {
  value: string;
  formElements: { name: string; checked: boolean; choiceValue: string }[];
  updateComplete: Promise<unknown>;
  hasFeedbackFor: string[];
  validate(): Promise<void>;
}

// Markup is parsed and connected before any element is registered.
const host = document.createElement('div');
host.innerHTML = `<wk-form><form><wk-radio-group name="contact" label="Contact" required>
  <wk-radio label="Email"></wk-radio><wk-radio label="Phone"></wk-radio></wk-radio-group></form></wk-form>`;
document.body.append(host);
afterAll(() => host.remove());
const radios = [...host.querySelectorAll('wk-radio')] as unknown as Group['formElements'];
radios[0]!.choiceValue = 'email';
radios[1]!.choiceValue = 'phone';

await import('@wakata/ds/define');

const group = host.querySelector('wk-radio-group') as unknown as Group;
const form = host.querySelector('form')!;
const settle = async () => {
  await group.updateComplete;
  await Promise.all(
    [...host.querySelectorAll('wk-radio')].map((r) => (r as unknown as Group).updateComplete),
  );
  await group.updateComplete;
};

test('upgraded static markup registers children and behaves like a mounted group', async () => {
  await settle();
  expect(group.formElements.length).toBe(2);
  expect(group.formElements.map((e) => e.name)).toEqual(['contact', 'contact']);
  expect(group.value).toBe('');
  expect(new FormData(form).has('contact')).toBe(false);
  await group.validate();
  expect(group.hasFeedbackFor).toContain('error');

  const events: string[] = [];
  group.addEventListener('wk-input', (event) =>
    events.push(`input:${(event as CustomEvent).detail.value}`),
  );
  group.addEventListener('wk-change', (event) =>
    events.push(`change:${(event as CustomEvent).detail.value}`),
  );
  await userEvent.click(host.querySelectorAll('wk-radio input')[1]!);
  expect(group.value).toBe('phone');
  expect(new FormData(form).get('contact')).toBe('phone');
  expect(events).toEqual(['input:phone', 'change:phone']);

  form.reset();
  await settle();
  expect(group.value).toBe('');

  events.length = 0;
  host.remove();
  document.body.append(host);
  await settle();
  expect(group.formElements.length).toBe(2);
  await userEvent.click(host.querySelectorAll('wk-radio input')[0]!);
  expect(group.value).toBe('email');
  expect(events).toEqual(['input:email', 'change:email']);
});
