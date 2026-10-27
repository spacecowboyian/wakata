import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { WkButton } from '@wakata/ds/button';
import { WkTextField } from '@wakata/ds/text-field';
import { WkSelect } from '@wakata/ds/select';
import { WkCard } from '@wakata/ds/card';
import { WkDialog } from '@wakata/ds/dialog';
import { RequestReview, type RequestReviewProps } from '../src/RequestReview';

// Real browser events (userEvent, custom-element callbacks) update React outside act, so the act
// environment is enabled only inside the explicit act() boundaries below, never globally.
const actEnv = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
actEnv.IS_REACT_ACT_ENVIRONMENT = false;
async function inAct(fn: () => void | Promise<void>) {
  actEnv.IS_REACT_ACT_ENVIRONMENT = true;
  try {
    await act(async () => {
      await fn();
    });
  } finally {
    actEnv.IS_REACT_ACT_ENVIRONMENT = false;
  }
}

type El = HTMLElement & { updateComplete: Promise<unknown>; [k: string]: unknown };
const tick = (ms = 60) => new Promise<void>((r) => setTimeout(r, ms));
const roots: { root: Root; host: HTMLElement }[] = [];

afterEach(async () => {
  document.querySelectorAll('wk-dialog').forEach((d) => (d as unknown as WkDialog).close());
  for (const { root, host } of roots.splice(0)) {
    await inAct(() => root.unmount());
    host.remove();
  }
});

async function mount(props: RequestReviewProps = {}) {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  roots.push({ root, host });
  const render = async (p: RequestReviewProps) => {
    await inAct(() => root.render(<RequestReview completionMs={150} {...p} />));
    await tick();
  };
  await render(props);
  const q = <T extends El>(id: string) => host.querySelector<T>(`#${id}`)!;
  return { host, q, render, dialog: host.querySelector<El & { opened: boolean }>('wk-dialog')! };
}
const submit = async (q: <T extends El>(id: string) => T) => {
  await userEvent.click(q('rr-submit'));
  await tick();
};
const fill = async (q: <T extends El>(id: string) => T) => {
  await userEvent.type(q('rr-name').querySelector('input')!, 'Ada Example');
  await userEvent.selectOptions(q('rr-destination').querySelector('select')!, 'oslo');
  await tick();
};

test('uses the real registered @wakata/ds elements', async () => {
  const { host, q } = await mount();
  const is = (sel: string, ctor: unknown) =>
    expect(host.querySelector(sel)).toBeInstanceOf(ctor as never);
  is('wk-card', WkCard);
  is('wk-text-field', WkTextField);
  is('wk-select', WkSelect);
  is('wk-dialog', WkDialog);
  is('#rr-cancel', WkButton);
  expect(customElements.get('wk-mode-switch')).toBeDefined();
  expect(q('rr-submit').tagName).toBe('WK-BUTTON-SUBMIT');
});

test('user edits flow through wk-input once; programmatic writes emit nothing', async () => {
  const { q } = await mount();
  const name = q<El>('rr-name');
  let events = 0;
  name.addEventListener('wk-input', () => events++);
  await userEvent.type(name.querySelector('input')!, 'Ada');
  expect(events).toBe(3);
  expect(name.value).toBe('Ada');
  events = 0;
  name.value = 'Programmatic';
  await tick();
  expect(events).toBe(0);
  expect(q('rr-summary').textContent).toBe('Ada → ');
});

test('parent-driven props update element, native input, FormData and summary without events', async () => {
  const { host, q, render } = await mount();
  let events = 0;
  for (const id of ['rr-name', 'rr-destination']) {
    q(id).addEventListener('wk-input', () => events++);
    q(id).addEventListener('wk-change', () => events++);
  }
  await render({ traveller: 'Grace Parent', destinationValue: 'bergen' });
  expect(q<El>('rr-name').value).toBe('Grace Parent');
  expect(q('rr-name').querySelector('input')!.value).toBe('Grace Parent');
  expect(q<El>('rr-destination').value).toBe('bergen');
  expect(q('rr-destination').querySelector('select')!.value).toBe('bergen');
  const data = new FormData(host.querySelector('form')!);
  expect(data.get('traveller')).toBe('Grace Parent');
  expect(data.get('destination')).toBe('bergen');
  expect(q('rr-summary').textContent).toBe('Grace Parent → bergen');
  expect(events).toBe(0);
  await render({ traveller: 'Second Value', destinationValue: 'oslo' });
  expect(q('rr-name').querySelector('input')!.value).toBe('Second Value');
  expect(q('rr-summary').textContent).toBe('Second Value → oslo');
  expect(events).toBe(0);
});

test('simultaneous submits run one review; external errors block review', async () => {
  const { host, q, dialog, render } = await mount({ traveller: 'Ada', destinationValue: 'oslo' });
  const wrapper = host.querySelector('wk-form')!;
  wrapper.dispatchEvent(new Event('submit'));
  wrapper.dispatchEvent(new Event('submit'));
  wrapper.dispatchEvent(new Event('submit'));
  await tick(200);
  expect(dialog.opened).toBe(true);
  expect(q('rr-status').textContent).toMatch(/Ready|already/);
  q('rr-cancel').click();
  await tick();
  expect(dialog.opened).toBe(false);
  await render({ externalError: 'Synthetic server error' });
  wrapper.dispatchEvent(new Event('submit'));
  await tick(200);
  expect(dialog.opened).toBe(false);
  expect(q('rr-status').textContent).toContain('correct');
});

test('required, disabled, readonly and external error states', async () => {
  const { q, render } = await mount({ nameDisabled: true });
  expect(q<El>('rr-name').disabled).toBe(true);
  await render({ nameDisabled: false, nameReadonly: true });
  expect(q('rr-name').querySelector('input')!.readOnly).toBe(true);
  await render({ externalError: 'Synthetic server error' });
  expect(q('rr-name').querySelector('[data-wk-external-error]')?.textContent).toBe(
    'Synthetic server error',
  );
  expect(q('rr-name').querySelector('input')!.getAttribute('aria-invalid')).toBe('true');
  await submit(q);
  expect(q('rr-status').textContent).toContain('correct');
  await render({ externalError: '' });
  expect(q('rr-name').querySelector('[data-wk-external-error]')).toBeNull();
  expect(q<El>('rr-name').hasAttribute('required')).toBe(true);
});

test('FormData serialisation and native reset', async () => {
  const { host, q } = await mount();
  await fill(q);
  const form = host.querySelector('form')!;
  const data = new FormData(form);
  expect(data.get('traveller')).toBe('Ada Example');
  expect(data.get('destination')).toBe('oslo');
  await userEvent.click(host.querySelector<El>('wk-button-reset')!);
  await tick();
  expect(q<El>('rr-name').value).toBe('');
  expect(q<El>('rr-destination').value).toBe('');
  expect(new FormData(form).get('traveller')).toBe('');
  expect(q<El>('rr-reopen').disabled).toBe(true);
});

test('invalid -> correction -> review -> cancel / reopen / confirm, repeated submit', async () => {
  const completed: unknown[] = [];
  const { q, dialog, render } = await mount({ onComplete: (d) => completed.push(d) });
  await render({ onComplete: (d) => completed.push(d) });
  await submit(q);
  expect(dialog.opened).toBe(false);
  expect(q('rr-status').textContent).toContain('correct');
  expect(q<El>('rr-reopen').disabled).toBe(true);

  await fill(q);
  await submit(q);
  expect(dialog.opened).toBe(true);
  expect(q('rr-summary').textContent).toBe('Ada Example → oslo');
  q('rr-submit').click(); // modal blocks pointer input; repeated submit must not re-run review
  await tick();
  expect(q('rr-status').textContent).toMatch(/Ready|already/);

  q('rr-cancel').click();
  await tick();
  expect(dialog.opened).toBe(false);
  expect(completed).toHaveLength(0);
  expect(q<El>('rr-reopen').disabled).toBeFalsy();

  q('rr-reopen').click();
  await tick();
  expect(dialog.opened).toBe(true);

  const confirm = q<El>('rr-confirm');
  confirm.click();
  await tick();
  expect(confirm.loading).toBe(true);
  expect(q<El>('rr-submit').disabled).toBe(true);
  expect(q<El>('rr-cancel').disabled).toBe(true);
  confirm.click();
  confirm.click();
  await tick(300);
  expect(completed).toEqual([{ traveller: 'Ada Example', destination: 'oslo' }]);
  expect(dialog.opened).toBe(false);
  expect(confirm.loading).toBeFalsy();
  expect(q<El>('rr-submit').disabled).toBeFalsy();
  expect(q('rr-status').textContent).toContain('No real action');
});
