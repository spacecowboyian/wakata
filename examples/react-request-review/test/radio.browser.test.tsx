import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { RequestReview } from '../src/RequestReview';

const actEnv = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
actEnv.IS_REACT_ACT_ENVIRONMENT = false;
const roots: { root: Root; host: HTMLElement }[] = [];
const tick = () => new Promise<void>((r) => setTimeout(r, 70));

afterEach(async () => {
  for (const { root, host } of roots.splice(0)) {
    actEnv.IS_REACT_ACT_ENVIRONMENT = true;
    await act(async () => root.unmount());
    actEnv.IS_REACT_ACT_ENVIRONMENT = false;
    host.remove();
  }
});

test('React controls RadioGroup selection, native submission and reset', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  roots.push({ root, host });
  actEnv.IS_REACT_ACT_ENVIRONMENT = true;
  await act(async () => root.render(<RequestReview />));
  actEnv.IS_REACT_ACT_ENVIRONMENT = false;
  await tick();
  const group = host.querySelector<
    HTMLElement & { value: string; updateComplete: Promise<unknown> }
  >('#rr-priority')!;
  const inputs = group.querySelectorAll<HTMLInputElement>('input');
  const form = host.querySelector('form')!;
  expect(group.value).toBe('');
  await userEvent.click(inputs[1]!);
  await tick();
  expect(group.value).toBe('engine');
  expect(new FormData(form).get('priority')).toBe('engine');
  group.value = 'body';
  await group.updateComplete;
  expect(new FormData(form).get('priority')).toBe('body');
  await userEvent.click(host.querySelector('wk-button-reset')!);
  await tick();
  expect(group.value).toBe('');
  expect(new FormData(form).has('priority')).toBe(false);
});
