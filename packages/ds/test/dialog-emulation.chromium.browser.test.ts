// Chromium-only: uses CDP media emulation.
import { afterEach, expect, test } from 'vitest';
import { cdp, page } from 'vitest/browser';
import '../src/themes/themes.css';
import '@wakata/ds/button/define';

const settle = async (dialog: HTMLElement): Promise<void> => {
  await (dialog as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
};

type ActionButton = HTMLElement & {
  disabled: boolean;
  loading: boolean;
  updateComplete: Promise<unknown>;
};

const create = async (mode = 'light') => {
  await import('@wakata/ds/dialog/define');
  const parent = document.createElement('div');
  parent.dataset.wkTheme = 'studio';
  parent.dataset.wkMode = mode;
  parent.innerHTML = `
    <wk-dialog>
      <wk-button slot="invoker">Open</wk-button>
      <section slot="content" aria-labelledby="t" aria-describedby="d">
        <h2 id="t">Synthetic action review</h2>
        <p id="d">Synthetic description.</p>
        <wk-button id="cancel">Cancel</wk-button>
        <wk-button id="confirm" variant="primary">Confirm</wk-button>
      </section>
    </wk-dialog>`;
  document.body.append(parent);
  const dialog = parent.querySelector('wk-dialog')!;
  await settle(dialog);
  return {
    dialog,
    parent,
    invoker: parent.querySelector<ActionButton>('[slot="invoker"]')!,
    content: parent.querySelector<HTMLElement>('[slot="content"]')!,
    cancel: parent.querySelector<ActionButton>('#cancel')!,
    confirm: parent.querySelector<ActionButton>('#confirm')!,
  };
};

const scrollLocked = () => document.body.classList.contains('overlays-scroll-lock');
const nativeClick = (el: HTMLElement) =>
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

afterEach(async () => {
  await cdp().send('Emulation.setEmulatedMedia', { features: [] });
  await page.viewport(414, 896);
});

test('200% zoom equivalent (halved CSS viewport), reduced motion and forced colors keep the dialog operable', async () => {
  await page.viewport(640, 400);
  await cdp().send('Emulation.setEmulatedMedia', {
    features: [
      { name: 'prefers-reduced-motion', value: 'reduce' },
      { name: 'forced-colors', value: 'active' },
    ],
  });
  expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true);
  const { dialog, parent, content, cancel } = await create();
  await dialog.open();
  expect(matchMedia('(forced-colors: active)').matches).toBe(true);
  const rect = content.getBoundingClientRect();
  expect(rect.width).toBeLessThanOrEqual(window.innerWidth);
  expect(rect.height).toBeLessThanOrEqual(window.innerHeight);
  cancel.addEventListener('click', () => void dialog.close());
  nativeClick(cancel);
  await settle(dialog);
  expect(dialog.opened).toBe(false);
  expect(scrollLocked()).toBe(false);
  parent.remove();
});

const backdropOf = (dialog: HTMLElement) =>
  dialog.shadowRoot!.querySelector<HTMLElement>('.overlays__backdrop')!;

test('mobile: clicking the exposed strip closes without activating background content', async () => {
  await page.viewport(414, 896);
  const { dialog, parent, invoker, content } = await create();
  let backgroundClicks = 0;
  const count = (event: Event) => {
    if (event.composedPath().includes(invoker)) backgroundClicks += 1;
  };
  document.addEventListener('click', count);
  invoker.focus();
  await dialog.open();
  const sheetTop = content.getBoundingClientRect().top;
  expect(sheetTop).toBeGreaterThan(0);

  content.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
  await settle(dialog);
  expect(dialog.opened).toBe(true);

  backdropOf(dialog).dispatchEvent(new MouseEvent('click', { bubbles: true }));
  await settle(dialog);
  document.removeEventListener('click', count);
  expect(dialog.opened).toBe(false);
  expect(backgroundClicks).toBe(0);
  expect(scrollLocked()).toBe(false);
  expect(document.activeElement).toBe(invoker);
  parent.remove();
});

test('mobile: Escape still closes at short height', async () => {
  await page.viewport(414, 400);
  const { dialog, parent, content } = await create('dark');
  await dialog.open();
  backdropOf(dialog).dispatchEvent(new MouseEvent('click', { bubbles: true }));
  await settle(dialog);
  expect(dialog.opened).toBe(false);
  await dialog.open();
  content.dispatchEvent(
    new KeyboardEvent('keyup', { key: 'Escape', bubbles: true, composed: true }),
  );
  await settle(dialog);
  expect(dialog.opened).toBe(false);
  parent.remove();
});

test('desktop: backdrop click does not dismiss', async () => {
  await page.viewport(900, 700);
  const { dialog, parent } = await create();
  await dialog.open();
  backdropOf(dialog).dispatchEvent(new MouseEvent('click', { bubbles: true }));
  await settle(dialog);
  expect(dialog.opened).toBe(true);
  await dialog.close();
  parent.remove();
});
