import { afterEach, expect, test } from 'vitest';
import { page } from 'vitest/browser';
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
const openSettled = async (dialog: HTMLElement & { open(): Promise<void> }): Promise<void> => {
  await dialog.open();
  const content = dialog.querySelector<HTMLElement>('[slot="content"]');
  if (content) await Promise.all(content.getAnimations().map((animation) => animation.finished));
};

afterEach(async () => {
  await page.viewport(414, 896);
});

test.each(['disabled', 'loading'] as const)(
  '%s wk-button action cannot activate; the dialog stays open and focus contained',
  async (state) => {
    const { dialog, parent, content, confirm, cancel } = await create();
    let activations = 0;
    confirm.addEventListener('click', () => (activations += 1));
    confirm[state] = true;
    await confirm.updateComplete;
    await openSettled(dialog);
    nativeClick(confirm);
    confirm.click();
    // Real pointer click on the visible Confirm; must not throw and must not activate.
    await page.getByRole('button', { name: 'Confirm' }).click({ force: true });
    expect(activations).toBe(0);
    expect(confirm.getAttribute('aria-disabled')).toBe('true');
    expect(confirm.hasAttribute('aria-busy')).toBe(state === 'loading');
    expect(dialog.opened).toBe(true);
    expect(content.contains(document.activeElement) || document.activeElement === content).toBe(
      true,
    );

    confirm[state] = false;
    await confirm.updateComplete;
    cancel.addEventListener('click', () => void dialog.close());
    nativeClick(cancel);
    await settle(dialog);
    expect(dialog.opened).toBe(false);
    parent.remove();
  },
);

test('repeated action and close clicks run each effect once and release focus and scroll lock', async () => {
  const { dialog, parent, invoker, cancel, confirm } = await create();
  let confirmed = 0;
  let closedEvents = 0;
  confirm.addEventListener('click', () => {
    confirmed += 1;
    confirm.loading = true;
    void dialog.close();
  });
  dialog.addEventListener('opened-changed', (e) => {
    if (!(e as CustomEvent<{ opened: boolean }>).detail.opened) closedEvents += 1;
  });
  invoker.focus();
  await openSettled(dialog);
  for (let i = 0; i < 4; i += 1) nativeClick(confirm);
  await settle(dialog);
  expect(confirmed).toBe(1);
  expect(closedEvents).toBe(1);
  expect(dialog.opened).toBe(false);
  expect(scrollLocked()).toBe(false);
  expect(document.activeElement).toBe(invoker);

  confirm.loading = false;
  await openSettled(dialog);
  expect(scrollLocked()).toBe(true);
  await Promise.all([dialog.close(), dialog.close()]);
  await cancel.updateComplete;
  expect(scrollLocked()).toBe(false);
  expect(document.activeElement).toBe(invoker);
  parent.remove();
});

test('content replacement and a removed invoker do not strand focus or scroll lock', async () => {
  const { dialog, parent, invoker, content } = await create();
  parent.tabIndex = 0;
  await openSettled(dialog);
  const replacement = content.cloneNode(true) as HTMLElement;
  content.replaceWith(replacement);
  await new Promise<void>((resolve) => setTimeout(resolve, 50));
  await settle(dialog);
  // Focus must be inside the replacement content or on a connected fallback, never lost to a detached node.
  expect(
    replacement.contains(document.activeElement) ||
      document.activeElement === replacement ||
      document.activeElement === document.body ||
      parent.contains(document.activeElement),
  ).toBe(true);
  invoker.remove();
  if (dialog.opened) await dialog.close();
  expect(dialog.opened).toBe(false);
  expect(scrollLocked()).toBe(false);
  expect(document.body.contains(document.activeElement)).toBe(true);
  expect(replacement.closest('[inert]')).toBeNull();
  parent.remove();
});

test('current application focus survives an action-driven close', async () => {
  const { dialog, parent, confirm, invoker } = await create();
  const outside = document.createElement('button');
  document.body.append(outside);
  await openSettled(dialog);
  // The app moves focus as the dialog starts closing; Dialog must not steal it back.
  dialog.addEventListener('opened-changed', (e) => {
    if (!(e as CustomEvent<{ opened: boolean }>).detail.opened) outside.focus();
  });
  confirm.addEventListener('click', () => void dialog.close());
  nativeClick(confirm);
  await new Promise<void>((resolve) => setTimeout(resolve, 50));
  expect(dialog.opened).toBe(false);
  expect(document.activeElement).toBe(outside);
  expect(document.activeElement).not.toBe(invoker);
  expect(scrollLocked()).toBe(false);
  outside.remove();
  parent.remove();
});

const luminance = (rgb: string): number => {
  const [r = 0, g = 0, b = 0] = (rgb.match(/[\d.]+/g) ?? []).slice(0, 3).map((v) => {
    const c = Number(v) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string): number => {
  const [hi = 0, lo = 0] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test.each([
  ['light', 320, 568],
  ['dark', 320, 568],
  ['light', 1280, 800],
  ['dark', 1280, 800],
])(
  '%s mode at %ix%i keeps text contrast >= 4.5 and content within the viewport',
  async (mode, w, h) => {
    await page.viewport(w, h);
    const { dialog, parent, content } = await create(mode);
    await openSettled(dialog);
    const style = getComputedStyle(content);
    expect(style.backgroundColor).not.toMatch(/rgba\(.*,\s*0\)$|^transparent$/);
    expect(contrast(style.color, style.backgroundColor)).toBeGreaterThanOrEqual(4.5);
    const rect = content.getBoundingClientRect();
    expect(rect.left).toBeGreaterThanOrEqual(0);
    expect(rect.right).toBeLessThanOrEqual(window.innerWidth);
    expect(rect.bottom).toBeLessThanOrEqual(window.innerHeight);
    if (w <= 600) {
      expect(rect.top).toBeCloseTo(40, 0);
      expect(rect.bottom).toBeCloseTo(window.innerHeight, 0);
    }
    await dialog.close();
    parent.remove();
  },
);

test.each([
  [320, 568],
  [390, 844],
])(
  'mobile sheet at %ix%i keeps its title and actions fixed while the body scrolls',
  async (w, h) => {
    await page.viewport(w, h);
    await import('@wakata/ds/dialog/define');
    const parent = document.createElement('div');
    parent.dataset.wkTheme = 'fieldwork';
    parent.innerHTML = `
    <wk-dialog>
      <wk-button slot="invoker">Open</wk-button>
      <section slot="content" aria-labelledby="sheet-title" aria-describedby="sheet-body">
        <h2 id="sheet-title">Review extended request</h2>
        <div id="sheet-body">${'<p>Synthetic review note with long content.</p>'.repeat(20)}</div>
        <div><wk-button>Cancel</wk-button><wk-button variant="primary">Confirm</wk-button></div>
      </section>
    </wk-dialog>`;
    document.body.append(parent);
    const dialog = parent.querySelector('wk-dialog')!;
    const content = parent.querySelector<HTMLElement>('[slot="content"]')!;
    const body = parent.querySelector<HTMLElement>('#sheet-body')!;
    await settle(dialog);
    await openSettled(dialog);
    const panel = content.getBoundingClientRect();
    const title = content.children.item(0)!;
    const actions = content.children.item(2)!;
    const titleTop = title.getBoundingClientRect().top;
    const actionsBottom = actions.getBoundingClientRect().bottom;
    expect(panel.top).toBeCloseTo(40, 0);
    expect(panel.bottom).toBeCloseTo(h, 0);
    expect(panel.width).toBeCloseTo(w, 0);
    expect(getComputedStyle(title).borderBottomWidth).toBe('1px');
    expect(getComputedStyle(actions).borderTopWidth).toBe('1px');
    expect(title.getBoundingClientRect().width).toBeCloseTo(panel.width - 2, 0);
    expect(actions.getBoundingClientRect().width).toBeCloseTo(panel.width - 2, 0);
    expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
    body.scrollTop = body.scrollHeight;
    expect(title.getBoundingClientRect().top).toBeCloseTo(titleTop, 0);
    expect(actions.getBoundingClientRect().bottom).toBeCloseTo(actionsBottom, 0);
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(w);
    expect(scrollLocked()).toBe(true);
    await dialog.close();
    parent.remove();
  },
);
