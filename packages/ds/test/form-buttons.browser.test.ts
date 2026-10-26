import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

// Native-form participation of the Lion-backed submit/reset buttons, against the built package.
await import('@wakata/ds/define');

const cleanup: Element[] = [];
afterEach(() => {
  for (const el of cleanup.splice(0)) el.remove();
});

async function fixture() {
  const form = document.createElement('form');
  form.innerHTML = `
    <input name="city" value="Oslo" required />
    <wk-button-submit>Send</wk-button-submit>
    <wk-button-reset>Reset</wk-button-reset>`;
  document.body.append(form);
  cleanup.push(form);
  const submits: string[] = [];
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submits.push(new FormData(form).get('city') as string);
  });
  const submit = form.querySelector('wk-button-submit')!;
  const reset = form.querySelector('wk-button-reset')!;
  const input = form.querySelector('input')!;
  await Promise.all([submit.updateComplete, reset.updateComplete]);
  return { form, submit, reset, input, submits };
}

test('registers real Lion submit and reset classes with documented defaults', async () => {
  const { LionButtonSubmit, LionButtonReset } = await import('@lion/ui/button.js');
  const { submit, reset } = await fixture();
  expect(submit).toBeInstanceOf(LionButtonSubmit);
  expect(reset).toBeInstanceOf(LionButtonReset);
  expect([submit.type, reset.type]).toEqual(['submit', 'reset']);
  expect([submit.variant, submit.intent, submit.size]).toEqual(['secondary', 'normal', 'medium']);
});

test('mouse click submits the native form once with its value', async () => {
  const { submit, submits } = await fixture();
  await userEvent.click(submit);
  expect(submits).toEqual(['Oslo']);
});

test('keyboard activation (Enter and Space) submits once each', async () => {
  const { submit, submits } = await fixture();
  submit.focus();
  await userEvent.keyboard('{Enter}');
  await userEvent.keyboard(' ');
  expect(submits).toEqual(['Oslo', 'Oslo']);
});

test('implicit submission: Enter in a field submits once', async () => {
  const { input, submits } = await fixture();
  input.focus();
  await userEvent.keyboard('{Enter}');
  expect(submits).toEqual(['Oslo']);
});

test('invalid form is blocked by native validation and does not fire submit', async () => {
  const { submit, input, submits } = await fixture();
  input.value = '';
  let invalid = 0;
  input.addEventListener('invalid', () => invalid++);
  await userEvent.click(submit);
  expect(submits).toEqual([]);
  expect(invalid).toBe(1);
  input.value = 'Bergen';
  await userEvent.click(submit);
  expect(submits).toEqual(['Bergen']);
});

test('reset button restores native defaults and fires reset once', async () => {
  const { form, reset, input, submits } = await fixture();
  let resets = 0;
  form.addEventListener('reset', () => resets++);
  input.value = 'Changed';
  await userEvent.click(reset);
  expect(input.value).toBe('Oslo');
  expect(resets).toBe(1);
  expect(submits).toEqual([]);
});

test('disabled submit does not submit by mouse, keyboard or click()', async () => {
  const { submit, submits } = await fixture();
  submit.disabled = true;
  await submit.updateComplete;
  await userEvent.click(submit, { force: true }).catch(() => undefined);
  submit.focus();
  await userEvent.keyboard('{Enter}');
  submit.click();
  expect(submits).toEqual([]);
});

test('outside a form the buttons are inert and do not throw', async () => {
  const el = document.createElement('wk-button-submit');
  el.textContent = 'Alone';
  document.body.append(el);
  cleanup.push(el);
  await el.updateComplete;
  expect(() => el.click()).not.toThrow();
});
