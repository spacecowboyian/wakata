import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react';
import { TabsDemo } from '../src/TabsDemo';

const actEnv = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
actEnv.IS_REACT_ACT_ENVIRONMENT = false;
const roots: { root: Root; host: HTMLElement }[] = [];
const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 30));

afterEach(async () => {
  for (const { root, host } of roots.splice(0)) {
    actEnv.IS_REACT_ACT_ENVIRONMENT = true;
    await act(async () => root.unmount());
    actEnv.IS_REACT_ACT_ENVIRONMENT = false;
    host.remove();
  }
});

test('React controls selected value while arrow focus alone leaves the panel unchanged', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const root = createRoot(host);
  roots.push({ root, host });
  actEnv.IS_REACT_ACT_ENVIRONMENT = true;
  await act(async () => root.render(<TabsDemo />));
  actEnv.IS_REACT_ACT_ENVIRONMENT = false;
  await tick();
  const tabs = host.querySelector<HTMLElement & { value: string }>('wk-tabs')!;
  const body = tabs.querySelector<HTMLElement>('wk-tab[value=body]')!;
  const mechanical = tabs.querySelector<HTMLElement>('wk-tab[value=mechanical]')!;
  const records = tabs.querySelector<HTMLElement>('wk-tab[value=records]')!;
  const output = host.querySelector('output')!;
  expect(tabs.value).toBe('body');
  body.focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(mechanical);
  expect(tabs.value).toBe('body');
  await userEvent.keyboard('{Enter}');
  await tick();
  expect(tabs.value).toBe('mechanical');
  expect(output.textContent).toContain('mechanical');
  await userEvent.click(host.querySelector('button')!);
  await tick();
  expect(tabs.value).toBe('records');
  expect(records.getAttribute('aria-selected')).toBe('true');
  expect(output.textContent).toContain('records');
});
