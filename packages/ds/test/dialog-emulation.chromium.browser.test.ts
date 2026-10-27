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
