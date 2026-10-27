import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import '../src/themes/themes.css';
import '@wakata/ds/define';
import '@wakata/ds/mode-switch/define';
import { WkButton } from '@wakata/ds/button';
import { WkTextField } from '@wakata/ds/text-field';
import { WkSelect } from '@wakata/ds/select';
import { WkCard } from '@wakata/ds/card';
import { WkDialog } from '@wakata/ds/dialog';
import html from '../examples/request-review.html?raw';
// @ts-expect-error plain-JS example module has no declarations
import { initRequestReview } from '../examples/request-review.js';

type El = HTMLElement & { updateComplete: Promise<unknown>; [k: string]: unknown };
const tick = () => new Promise<void>((r) => setTimeout(r, 50));
const mounts: HTMLElement[] = [];
const styles: HTMLStyleElement[] = [];
afterEach(async () => {
  document
    .querySelectorAll('wk-dialog')
    .forEach((d) => (d as unknown as { close(): Promise<void> }).close());
  mounts.splice(0).forEach((m) => m.remove());
  styles.splice(0).forEach((style) => style.remove());
});

async function mount() {
  const main = new DOMParser().parseFromString(html, 'text/html').querySelector('main')!;
  const host = document.createElement('div');
  host.append(document.importNode(main, true));
  document.body.append(host);
  mounts.push(host);
  const root = host.querySelector('main')!;
  const q = <T extends El>(id: string) => root.querySelector<T>(`#${id}`)!;
  const api = initRequestReview(root, { completionMs: 150 }) as {
    stats: { attempts: number; blocked: number; completions: number };
  };
  await Promise.all(
    [...root.querySelectorAll<El>('*')]
      .filter((e) => e.updateComplete)
      .map((e) => e.updateComplete),
  );
  return { host, root, q, api, dialog: root.querySelector<El & { opened: boolean }>('wk-dialog')! };
}
const submitForm = async (root: HTMLElement) => {
  await userEvent.click(root.querySelector<El>('#rr-submit')!);
};

test('fixture uses the real built package elements', async () => {
  const { root } = await mount();
  const is = (sel: string, ctor: unknown) =>
    expect(root.querySelector(sel)).toBeInstanceOf(ctor as never);
  is('wk-card', WkCard);
  is('wk-text-field', WkTextField);
  is('wk-select', WkSelect);
  is('wk-dialog', WkDialog);
  is('#rr-cancel', WkButton);
  expect(root.querySelector('wk-mode-switch')).not.toBeNull();
});

test('invalid -> correction -> review -> cancel / reopen / confirm', async () => {
  const { root, q, api, dialog } = await mount();
  const name = q<El>('rr-name');
  const dest = q<El>('rr-destination');
  const status = q('rr-status');

  await submitForm(root);
  await tick();
  expect(dialog.opened).toBe(false);
  expect(api.stats.blocked).toBe(1);
  expect(status.textContent).toContain('correct');
  expect(status.textContent).not.toContain('Ready');
  expect(q<El>('rr-reopen').disabled).toBe(true);

  await userEvent.type(name.querySelector('input')!, 'Ada Example');
  await userEvent.selectOptions(dest.querySelector('select')!, 'oslo');
  await tick();
  expect(status.textContent).toBe('');
  await submitForm(root);
  await tick();
  expect(dialog.opened).toBe(true);
  expect(q('rr-summary').textContent).toBe('Ada Example → oslo');

  q('rr-cancel').click();
  await tick();
  expect(dialog.opened).toBe(false);
  expect(api.stats.completions).toBe(0);
  expect(q<El>('rr-reopen').disabled).toBe(false);

  q('rr-reopen').click();
  await tick();
  expect(dialog.opened).toBe(true);

  const confirm = q<El>('rr-confirm');
  confirm.click();
  await tick();
  expect(confirm.loading).toBe(true);
  expect(q<El>('rr-submit').disabled).toBe(true);
  expect(q<El>('rr-cancel').disabled).toBe(true);
  // Repeated activation while loading must not run a second completion.
  confirm.click();
  confirm.click();
  await new Promise((r) => setTimeout(r, 300));
  expect(api.stats.completions).toBe(1);
  expect(dialog.opened).toBe(false);
  expect(confirm.loading).toBe(false);
  expect(q<El>('rr-submit').disabled).toBe(false);
  expect(status.textContent).toContain('No real action');
});

test('overlay retains the nested theme root', async () => {
  const { root, q, dialog } = await mount();
  q<El>('rr-name').value = 'Ada Example';
  q<El>('rr-destination').value = 'bergen';
  await tick();
  await submitForm(root);
  await tick();
  expect(dialog.opened).toBe(true);
  const origin = dialog.closest('[data-wk-theme]');
  expect(origin?.getAttribute('data-wk-theme')).toBe('studio');
  expect(origin?.id).toBe('rr-scope');
  const title = q('rr-title');
  // Content has no theme of its own; it inherits the dialog origin's scope.
  expect(title.closest('[data-wk-theme]')?.getAttribute('data-wk-theme')).toBe('studio');
  expect(origin?.contains(title)).toBe(true);
});

for (const [theme, lightAccent, darkAccent] of [
  ['neutral', 'rgb(23, 23, 23)', 'rgb(238, 238, 238)'],
  ['studio', 'rgb(73, 53, 163)', 'rgb(196, 182, 255)'],
  ['fieldwork', 'rgb(40, 88, 66)', 'rgb(161, 212, 180)'],
] as const) {
  test(`${theme} request/review keeps its palette and nested dialog theme in both modes`, async () => {
    const { host, root, q, dialog } = await mount();
    host.dataset.wkTheme = theme;
    q('rr-submit').style.transition = 'none';
    for (const [mode, accent] of [
      ['light', lightAccent],
      ['dark', darkAccent],
    ] as const) {
      host.dataset.wkMode = mode;
      expect(getComputedStyle(q('rr-submit')).backgroundColor).toBe(accent);
      expect(getComputedStyle(dialog).getPropertyValue('--wk-accent').trim()).toBe(
        mode === 'light' ? '#4935a3' : '#c4b6ff',
      );
    }
    q<El>('rr-name').value = 'Ada Example';
    q<El>('rr-destination').value = 'oslo';
    await tick();
    await submitForm(root);
    await tick();
    expect(dialog.opened).toBe(true);
    expect(q('rr-summary').textContent).toBe('Ada Example → oslo');
  });
}

test('a representative host reset preserves form controls; important light-DOM rules cross the boundary', async () => {
  const reset = document.createElement('style');
  reset.textContent = `
    *, *::before, *::after { box-sizing: border-box; }
    button, input, select { margin: 0; border: 0; background: transparent; font: inherit; }
    body { font-family: Georgia, serif; line-height: 1.6; }
  `;
  document.head.append(reset);
  styles.push(reset);
  const { root, q, dialog } = await mount();
  const input = q('rr-name').querySelector('input')!;
  const select = q('rr-destination').querySelector('select')!;
  expect(input.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  expect(select.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  expect(q('rr-submit').getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  await userEvent.type(input, 'Ada Example');
  await userEvent.selectOptions(select, 'oslo');
  await submitForm(root);
  await tick();
  expect(dialog.opened).toBe(true);
  expect(q('rr-summary').textContent).toBe('Ada Example → oslo');

  // Slotted native controls remain in light DOM. Host !important rules can override them.
  reset.textContent +=
    'wk-text-field > input[slot="input"] { color: rgb(255, 0, 255) !important; }';
  expect(getComputedStyle(input).color).toBe('rgb(255, 0, 255)');
});
