import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { LionInput } from '@lion/ui/input.js';
import { LionSelect } from '@lion/ui/select.js';
import { Required } from '@lion/ui/form-core.js';
import { WkScalarFieldMixin, type WkFieldEventDetail } from '@wakata/ds/form';

await import('@wakata/ds/define');

// Test-only field: #10 provides the real TextField. This proves the shared infrastructure.
class TestField extends WkScalarFieldMixin(LionInput) {}
customElements.define('wk-test-field', TestField);
class TestSelect extends WkScalarFieldMixin(LionSelect) {}
customElements.define('wk-test-select', TestSelect);

const cleanup: Element[] = [];
afterEach(() => {
  for (const el of cleanup.splice(0)) el.remove();
});

type Fields = [TestField, ...TestField[]];

async function mount(html: string, prepare?: (fields: Fields) => void) {
  const host = document.createElement('div');
  host.innerHTML = html;
  prepare?.([...host.querySelectorAll<TestField>('wk-test-field')] as Fields);
  document.body.append(host);
  cleanup.push(host);
  const fields = [...host.querySelectorAll<TestField>('wk-test-field')] as Fields;
  await Promise.all(fields.map((f) => f.updateComplete));
  return { host, fields };
}

// The controller reacts after the field's update, and Lion reflects aria-describedby in the next one.
const settle = async (f: TestField) => {
  await f.updateComplete;
  await f.updateComplete;
};

const control = (f: TestField) => f.querySelector('input')!;

test('wk-input per user edit and wk-change on commit; never for programmatic writes or reset', async () => {
  const { fields } = await mount(
    `<wk-test-field name="city" label="City"></wk-test-field><button>other</button>`,
  );
  const [field] = fields;
  const events: [string, WkFieldEventDetail][] = [];
  for (const type of ['wk-input', 'wk-change']) {
    field.addEventListener(type, (e) => events.push([type, (e as CustomEvent).detail]));
  }
  await userEvent.click(control(field));
  await userEvent.keyboard('ab');
  expect(events).toEqual([
    ['wk-input', { value: 'a', name: 'city' }],
    ['wk-input', { value: 'ab', name: 'city' }],
  ]);
  await userEvent.tab();
  expect(events.slice(2)).toEqual([['wk-change', { value: 'ab', name: 'city' }]]);

  events.length = 0;
  field.value = 'programmatic';
  field.modelValue = 'model';
  field.reset();
  await field.updateComplete;
  expect(events).toEqual([]);
  expect(field.value).toBe('');
});

test('label and help text are associated; ids are unique across fields', async () => {
  const { fields } = await mount(`
    <wk-test-field name="a" label="First" help-text="First help"></wk-test-field>
    <wk-test-field name="b" label="Second" help-text="Second help"></wk-test-field>`);
  const ids = new Set<string>();
  for (const [i, f] of fields.entries()) {
    const input = control(f);
    ids.add(input.id);
    const label = document.querySelector(`label[for="${input.id}"]`);
    expect(label?.textContent?.trim()).toBe(i === 0 ? 'First' : 'Second');
    const described = (input.getAttribute('aria-describedby') ?? '').split(' ');
    const text = described.map((id) => document.getElementById(id)?.textContent?.trim());
    expect(text).toContain(i === 0 ? 'First help' : 'Second help');
  }
  expect(ids.size).toBe(2);
});

test('external error is exposed for empty and nonempty values, keeps help, and clears', async () => {
  for (const initial of ['', 'ian']) {
    const { fields } = await mount(
      `<wk-test-field name="user" label="User" help-text="Pick a name"></wk-test-field>`,
      ([f]) => {
        f.modelValue = initial;
      },
    );
    const [field] = fields;
    const input = control(field);
    const describedText = () =>
      (input.getAttribute('aria-describedby') ?? '')
        .split(' ')
        .map((id) => document.getElementById(id)?.textContent?.trim());
    // Lion's own (empty) feedback node is part of the baseline description.
    const baseline = input.getAttribute('aria-describedby');
    expect(describedText()).toContain('Pick a name');
    expect(input.getAttribute('aria-invalid')).toBe('false');

    field.error = 'Name is taken';
    await settle(field);
    const errorId = field.querySelector('[data-wk-external-error]')?.id ?? '';
    expect(errorId).not.toBe('');
    expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(errorId);
    expect(describedText()).toEqual(expect.arrayContaining(['Pick a name', 'Name is taken']));
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(control(field)).toBe(input);

    field.error = 'Name is reserved';
    await settle(field);
    expect(describedText()).toContain('Name is reserved');
    expect(describedText()).not.toContain('Name is taken');

    field.error = '';
    await settle(field);
    expect(input.getAttribute('aria-describedby')).toBe(baseline);
    expect(input.getAttribute('aria-describedby')?.split(' ')).not.toContain(errorId);
    expect(document.getElementById(errorId)).toBeNull();
    expect(field.querySelector('[data-wk-external-error]')).toBeNull();
    expect(describedText()).toContain('Pick a name');
    expect(input.getAttribute('aria-invalid')).toBe('false');
  }
});

test('external error alongside a Lion Required error keeps Lion IDs and invalid state', async () => {
  const { fields } = await mount(
    `<wk-test-field name="user" label="User" help-text="Pick a name"></wk-test-field>`,
    ([f]) => {
      f.validators = [new Required()];
    },
  );
  const [field] = fields;
  const input = control(field);
  field.submitted = true;
  await settle(field);
  expect(field.showsFeedbackFor).toEqual(['error']);
  expect(input.getAttribute('aria-invalid')).toBe('true');
  const lionIds = input.getAttribute('aria-describedby');
  expect(lionIds?.split(' ').some((id) => id.startsWith('help-text-'))).toBe(true);
  expect(lionIds?.split(' ').some((id) => id.startsWith('feedback-'))).toBe(true);

  field.error = 'Name is taken';
  await settle(field);
  expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual(
    expect.arrayContaining(lionIds!.split(' ')),
  );
  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(field.showsFeedbackFor).toEqual(['error']);

  field.error = '';
  await settle(field);
  expect(input.getAttribute('aria-describedby')).toBe(lionIds);
  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(field.showsFeedbackFor).toEqual(['error']);
  expect(field.querySelector('[data-wk-external-error]')).toBeNull();
});

test('wk-form: reset button restores the default value and clears interaction state', async () => {
  const { host, fields } = await mount(
    `<wk-form><form>
      <wk-test-field name="city" label="City"></wk-test-field>
      <wk-button-reset>Reset</wk-button-reset>
    </form></wk-form>`,
    ([f]) => {
      f.modelValue = 'Oslo';
    },
  );
  const [field] = fields;
  expect(field.value).toBe('Oslo');
  await userEvent.click(control(field));
  await userEvent.keyboard('X');
  await userEvent.tab();
  expect(field.value).toBe('OsloX');
  expect(field.dirty).toBe(true);
  expect(field.touched).toBe(true);
  await userEvent.click(host.querySelector('wk-button-reset')!);
  await field.updateComplete;
  expect(field.value).toBe('Oslo');
  expect(field.dirty).toBe(false);
  expect(field.touched).toBe(false);
});

test('wk-form serializes named fields and native FormData sees the control', async () => {
  const { host, fields } = await mount(`
    <wk-form><form>
      <wk-test-field name="city" label="City"></wk-test-field>
    </form></wk-form>`);
  const [field] = fields;
  await userEvent.click(control(field));
  await userEvent.keyboard('Oslo');
  const wkForm = host.querySelector('wk-form')!;
  expect(wkForm.serializedValue).toEqual({ city: 'Oslo' });
  expect(new FormData(host.querySelector('form')!).get('city')).toBe('Oslo');
});

test('wk-form reports an invalid submit attempt and exposes errors for consumers to guard', async () => {
  const { host, fields } = await mount(`
    <wk-form><form>
      <wk-test-field name="city" label="City"></wk-test-field>
      <wk-button-submit>Send</wk-button-submit>
    </form></wk-form>`);
  const [field] = fields;
  field.validators = [new Required()];
  await field.updateComplete;
  expect(field.hasFeedbackFor).toEqual(['error']);
  expect(field.showsFeedbackFor).toEqual([]);
  let submitted = 0;
  let processed = 0;
  const form = host.querySelector('wk-form')!;
  form.addEventListener('submit', () => {
    submitted++;
    if (form.hasFeedbackFor.includes('error') || field.error) return;
    processed++;
  });
  await userEvent.click(host.querySelector('wk-button-submit')!);
  await field.updateComplete;
  expect(field.showsFeedbackFor).toEqual(['error']);
  expect(submitted).toBe(1);
  expect(processed).toBe(0);
  field.value = 'Oslo';
  await settle(field);
  await userEvent.click(host.querySelector('wk-button-submit')!);
  expect(submitted).toBe(2);
  expect(processed).toBe(1);
});

test('wk-fieldset names its group', async () => {
  const { host } = await mount(`
    <wk-fieldset label="Contact"><wk-test-field name="a" label="A"></wk-test-field></wk-fieldset>`);
  const set = host.querySelector('wk-fieldset')!;
  await set.updateComplete;
  expect(set.getAttribute('role')).toBe('group');
  const labelledBy = set.getAttribute('aria-labelledby') ?? '';
  expect(document.getElementById(labelledBy.split(' ')[0] ?? '')?.textContent?.trim()).toBe(
    'Contact',
  );
});

test('scalar value writes before connection and while focused keep model, validation and serialization aligned', async () => {
  const { host, fields } = await mount(
    `<wk-form><form><wk-test-field name="city" label="City"></wk-test-field></form></wk-form>`,
    ([field]) => {
      field.validators = [new Required()];
      field.value = 'Oslo';
    },
  );
  const [field] = fields;
  const events: string[] = [];
  for (const type of ['wk-input', 'wk-change']) {
    field.addEventListener(type, () => events.push(type));
  }
  const assertValue = (value: string) => {
    expect(field.value).toBe(value);
    expect(control(field).value).toBe(value);
    expect(field.modelValue).toBe(value);
    expect(field.serializedValue).toBe(value);
    expect(host.querySelector('wk-form')!.serializedValue).toEqual({ city: value });
    expect(new FormData(host.querySelector('form')!).get('city')).toBe(value);
  };
  assertValue('Oslo');
  await userEvent.click(control(field));
  field.value = '';
  await settle(field);
  assertValue('');
  expect(field.hasFeedbackFor).toContain('error');
  field.value = 'Paris';
  await settle(field);
  assertValue('Paris');
  expect(field.hasFeedbackFor).not.toContain('error');
  // Same model value still repairs an independently modified native view.
  control(field).value = 'stale';
  field.value = 'Paris';
  await settle(field);
  assertValue('Paris');
  field.reset();
  await settle(field);
  assertValue('Oslo');
  expect(events).toEqual([]);
});

test('scalar facade also synchronizes a Lion select without user-event echoes', async () => {
  const host = document.createElement('div');
  host.innerHTML = `<wk-form><form><wk-test-select name="city" label="City">
    <select slot="input"><option value="Oslo">Oslo</option><option value="Paris">Paris</option></select>
  </wk-test-select></form></wk-form>`;
  const field = host.querySelector<TestSelect>('wk-test-select')!;
  field.value = 'Oslo';
  document.body.append(host);
  cleanup.push(host);
  await field.updateComplete;
  const events: string[] = [];
  for (const type of ['wk-input', 'wk-change']) {
    field.addEventListener(type, () => events.push(type));
  }
  field.value = 'Paris';
  await field.updateComplete;
  expect(field.modelValue).toBe('Paris');
  expect(field.serializedValue).toBe('Paris');
  expect(field.querySelector('select')!.value).toBe('Paris');
  expect(new FormData(host.querySelector('form')!).get('city')).toBe('Paris');
  field.value = 'not-an-option';
  await field.updateComplete;
  expect(field.value).toBe('');
  expect(field.modelValue).toBe('');
  expect(field.serializedValue).toBe('');
  expect(field.querySelector('select')!.selectedIndex).toBe(-1);
  expect(new FormData(host.querySelector('form')!).get('city')).toBeNull();
  field.reset();
  await field.updateComplete;
  expect(field.value).toBe('Oslo');
  expect(events).toEqual([]);
});

test('unchanged external error stays invalid after Lion Required validation clears', async () => {
  const { fields } = await mount(
    `<wk-test-field name="user" label="User" help-text="Pick a name"></wk-test-field>`,
    ([field]) => {
      field.validators = [new Required()];
    },
  );
  const [field] = fields;
  field.submitted = true;
  field.error = 'Name is taken';
  await settle(field);
  expect(field.showsFeedbackFor).toContain('error');
  const input = control(field);
  const errorId = field.querySelector('[data-wk-external-error]')!.id;
  field.value = 'valid';
  await settle(field);
  expect(field.showsFeedbackFor).not.toContain('error');
  expect(input.getAttribute('aria-invalid')).toBe('true');
  expect(input.getAttribute('aria-describedby')?.split(' ')).toContain(errorId);
  expect(field.error).toBe('Name is taken');
  field.error = '';
  await settle(field);
  expect(input.getAttribute('aria-invalid')).toBe('false');
  expect(document.getElementById(errorId)).toBeNull();
});

test('direct field reset and native form reset clear external errors without dropping help', async () => {
  const { host, fields } = await mount(
    `<wk-form><form>
      <wk-test-field name="city" label="City" help-text="Your city"></wk-test-field>
      <wk-button-reset>Reset</wk-button-reset>
    </form></wk-form>`,
    ([field]) => {
      field.value = 'Oslo';
    },
  );
  const [field] = fields;
  const input = control(field);
  const baseline = input.getAttribute('aria-describedby');
  for (const reset of [() => field.reset(), () => host.querySelector('form')!.reset()]) {
    field.value = 'Paris';
    field.error = 'Try another city';
    await settle(field);
    const errorId = field.querySelector('[data-wk-external-error]')!.id;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    reset();
    await settle(field);
    expect(field.value).toBe('Oslo');
    expect(field.error).toBe('');
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.getAttribute('aria-describedby')).toBe(baseline);
    expect(document.getElementById(errorId)).toBeNull();
    expect(field.querySelector('[data-wk-external-error]')).toBeNull();
  }
});

test('reconnecting a field restores its unchanged external error and association', async () => {
  const { host, fields } = await mount(
    `<wk-test-field name="city" label="City" help-text="Your city"></wk-test-field>`,
  );
  const [field] = fields;
  field.error = 'Try another city';
  await settle(field);
  field.remove();
  host.append(field);
  await settle(field);
  const node = field.querySelector('[data-wk-external-error]')!;
  expect(node.textContent).toBe('Try another city');
  expect(control(field).getAttribute('aria-invalid')).toBe('true');
  expect(control(field).getAttribute('aria-describedby')?.split(' ')).toContain(node.id);
  expect(field.querySelectorAll('[data-wk-external-error]')).toHaveLength(1);
});
