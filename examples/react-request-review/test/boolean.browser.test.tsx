import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { RequestReview } from '../src/RequestReview';

const actEnv = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
actEnv.IS_REACT_ACT_ENVIRONMENT = false;
type El = HTMLElement & { checked: boolean; opened: boolean };
const tick = (ms = 60) => new Promise<void>((r) => setTimeout(r, ms));
const roots: { root: Root; host: HTMLElement }[] = [];

afterEach(async () => {
  for (const { root, host } of roots.splice(0)) {
    actEnv.IS_REACT_ACT_ENVIRONMENT = true;
    await act(async () => root.unmount());
    actEnv.IS_REACT_ACT_ENVIRONMENT = false;
    host.remove();
  }
});

async function mount() {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  roots.push({ root, host });
  actEnv.IS_REACT_ACT_ENVIRONMENT = true;
  await act(async () => root.render(<RequestReview completionMs={150} />));
  actEnv.IS_REACT_ACT_ENVIRONMENT = false;
  await tick();
  const q = (id: string) => host.querySelector<El>(`#${id}`)!;
  const form = () => host.querySelector('form')!;
  return { host, q, form };
}

test('required checkbox group blocks review, serializes, resets and does not echo wk-input', async () => {
  const { host, q, form } = await mount();
  const email = q('rr-channel-email');
  const sms = q('rr-channel-sms');
  await userEvent.type(q('rr-name').querySelector('input')!, 'Ada Example');
  await userEvent.selectOptions(q('rr-destination').querySelector('select')!, 'oslo');
  await userEvent.click(q('rr-submit'));
  await tick();
  expect(host.querySelector<El>('wk-dialog')!.opened).toBe(false);
  expect(q('rr-status').textContent).toContain('Please correct');

  let events = 0;
  email.addEventListener('wk-input', () => events++);
  await userEvent.click(email.querySelector('input')!);
  await tick();
  expect(events).toBe(1);
  sms.checked = true;
  await tick();
  expect(events).toBe(1);
  expect(new FormData(form()).getAll('channels[]')).toEqual(['email', 'sms']);

  await userEvent.click(host.querySelector('wk-button-reset')!);
  await tick();
  expect(email.checked).toBe(false);
  expect(sms.checked).toBe(false);
  expect(new FormData(form()).getAll('channels[]')).toEqual([]);
});

test('switch is outside the form, keeps its label and never serializes', async () => {
  const { q, form } = await mount();
  const sw = q('rr-compact');
  expect(sw.closest('form')).toBeNull();
  const label = sw.textContent;
  let events = 0;
  sw.addEventListener('wk-input', () => events++);
  await userEvent.click(sw.querySelector('[role="switch"]') ?? sw);
  await tick();
  expect(sw.checked).toBe(true);
  expect(events).toBe(1);
  sw.checked = false;
  await tick();
  expect(events).toBe(1);
  expect(sw.textContent).toBe(label);
  expect([...new FormData(form()).keys()]).not.toContain('compact');
});
