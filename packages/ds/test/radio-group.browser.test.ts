import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

interface Group extends HTMLElement {
  value: string;
  error: string;
  updateComplete: Promise<unknown>;
  hasFeedbackFor: string[];
  validate?: () => Promise<void>;
}
interface Radio extends HTMLElement {
  updateComplete: Promise<unknown>;
  choiceValue: string;
}

await import('@wakata/ds/define');

const cleanup: Element[] = [];
afterEach(() => {
  for (const element of cleanup.splice(0)) element.remove();
});

// choiceValue is property-only in Lion, so markup carries data-v and it is applied here.
function applyValues(root: ParentNode) {
  for (const r of root.querySelectorAll<Radio>('wk-radio[data-v]')) {
    r.choiceValue = r.dataset.v!;
  }
}

async function mount(markup: string) {
  const host = document.createElement('div');
  host.innerHTML = markup;
  applyValues(host);
  document.body.append(host);
  cleanup.push(host);
  const group = host.querySelector('wk-radio-group') as unknown as Group;
  await group.updateComplete;
  await Promise.all([...host.querySelectorAll('wk-radio')].map((r) => (r as Radio).updateComplete));
  await group.updateComplete;
  return { host, group, form: host.querySelector('form') };
}

const items = () => `
  <wk-radio label="Email" data-v="email"></wk-radio>
  <wk-radio label="Phone" data-v="phone"></wk-radio>
  <wk-radio label="Post" data-v="post"></wk-radio>`;

const wrap = (attrs: string, inner = items()) =>
  `<wk-form><form><wk-radio-group name="contact" label="Contact" ${attrs}>${inner}</wk-radio-group></form></wk-form>`;

test('registers elements and is empty by default', async () => {
  expect(customElements.get('wk-radio-group')).toBeDefined();
  expect(customElements.get('wk-radio')).toBeDefined();
  const { group, form } = await mount(wrap(''));
  expect(group.value).toBe('');
  expect(new FormData(form!).has('contact')).toBe(false);
  expect(group.getAttribute('role')).toBe('radiogroup');
});

test('initial value before child registration selects the matching option', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  cleanup.push(host);
  const group = document.createElement('wk-radio-group') as unknown as Group;
  group.setAttribute('name', 'contact');
  group.value = 'phone';
  host.append(group);
  group.innerHTML = items();
  applyValues(group);
  await group.updateComplete;
  await Promise.all(
    [...group.querySelectorAll('wk-radio')].map((r) => (r as Radio).updateComplete),
  );
  expect(group.value).toBe('phone');
});

test('checked default is submitted and restored by reset', async () => {
  const inner = `
    <wk-radio label="A" data-v="a"></wk-radio>
    <wk-radio label="B" data-v="b" checked></wk-radio>`;
  const { group, form } = await mount(wrap('', inner));
  expect(group.value).toBe('b');
  expect(new FormData(form!).getAll('contact')).toEqual(['b']);
  await userEvent.click(group.querySelectorAll('input')[0] as HTMLInputElement);
  expect(group.value).toBe('a');
  expect(new FormData(form!).getAll('contact')).toEqual(['a']);
  form!.reset();
  await group.updateComplete;
  expect(group.value).toBe('b');
});

test('user selection emits one wk-input and one wk-change, programmatic emits none', async () => {
  const { group } = await mount(wrap(''));
  const seen: string[] = [];
  group.addEventListener('wk-input', (e) => seen.push(`i:${(e as CustomEvent).detail.value}`));
  group.addEventListener('wk-change', (e) => seen.push(`c:${(e as CustomEvent).detail.value}`));
  group.value = 'post';
  await group.updateComplete;
  expect(seen).toEqual([]);
  await userEvent.click(group.querySelectorAll('input')[1] as HTMLInputElement);
  expect(seen).toEqual(['i:phone', 'c:phone']);
});

test('required is invalid until selected; external error is shown', async () => {
  const { group, form } = await mount(wrap('required help-text="Choose one"'));
  const groupLabel = group.querySelector(':scope > [slot="label"]');
  expect(groupLabel?.textContent).toBe('Contact');
  expect((group.getAttribute('aria-labelledby') ?? '').split(' ')).toContain(groupLabel?.id);
  await group.validate?.();
  expect(group.hasFeedbackFor.includes('error')).toBe(true);
  await userEvent.click(group.querySelectorAll('input')[0] as HTMLInputElement);
  await group.validate?.();
  expect(group.hasFeedbackFor.includes('error')).toBe(false);
  group.error = 'Server says no.';
  await group.updateComplete;
  await group.updateComplete;
  expect(group.textContent).toContain('Server says no.');
  const external = group.querySelector<HTMLElement>('[data-wk-external-error]')!;
  expect(external.assignedSlot).not.toBeNull();
  expect(group.getAttribute('aria-invalid')).toBe('true');
  expect((group.getAttribute('aria-describedby') ?? '').split(' ')).toContain(external.id);
  group.error = '';
  await group.updateComplete;
  expect(group.textContent).not.toContain('Server says no.');
  group.error = 'Try again';
  await group.updateComplete;
  form!.reset();
  await group.updateComplete;
  expect(group.error).toBe('');
  expect(group.querySelector('[data-wk-external-error]')).toBeNull();
});

test('arrow keys move selection, skip disabled options; Tab leaves the group', async () => {
  const inner = `
    <wk-radio label="A" data-v="a"></wk-radio>
    <wk-radio label="B" data-v="b" disabled></wk-radio>
    <wk-radio label="C" data-v="c"></wk-radio>`;
  const { group } = await mount(
    `<button id="before">before</button>${wrap('', inner)}<button id="after">after</button>`,
  );
  const inputs = group.querySelectorAll('input');
  (inputs[0] as HTMLInputElement).focus();
  await userEvent.keyboard('{ArrowDown}');
  expect(group.value).toBe('c');
  await userEvent.keyboard('{ArrowUp}');
  expect(group.value).toBe('a');
  await userEvent.tab();
  // WebKit on macOS may put Tab on body when full keyboard access is disabled;
  // all engines must leave the radio group.
  expect(group.contains(document.activeElement)).toBe(false);
});

test('disabled group submits nothing', async () => {
  const { group, form } = await mount(
    wrap('disabled', items().replace('data-v="phone"', 'data-v="phone" checked')),
  );
  await group.updateComplete;
  expect(new FormData(form!).has('contact')).toBe(false);
});
