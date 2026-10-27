import { expect, test } from 'vitest';
import '../src/themes/themes.css';

const waitForOverlay = async (dialog: HTMLElement): Promise<void> => {
  await (dialog as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );
};

const createDialog = async (
  options: { ancestorFocusable?: boolean; autofocus?: boolean; noInvoker?: boolean } = {},
) => {
  const parent = document.createElement('div');
  if (options.ancestorFocusable) parent.tabIndex = 0;
  parent.innerHTML = `
    <wk-dialog>
      ${options.noInvoker ? '' : '<button slot="invoker">Open</button>'}
      <section slot="content" aria-labelledby="title" aria-describedby="description">
        <h2 id="title">Synthetic review</h2>
        <p id="description">Description for the synthetic review.</p>
        <button id="inside" ${options.autofocus ? 'autofocus' : ''}>Continue</button>
      </section>
    </wk-dialog>
  `;
  document.body.append(parent);
  const dialog = parent.querySelector('wk-dialog')!;
  await waitForOverlay(dialog);
  return {
    dialog,
    parent,
    invoker: parent.querySelector<HTMLButtonElement>('[slot="invoker"]')!,
    content: parent.querySelector<HTMLElement>('[slot="content"]')!,
  };
};

test('dialog exports are class-only and explicit registration is idempotent', async () => {
  expect(customElements.get('wk-dialog')).toBeUndefined();
  const { WkDialog } = await import('@wakata/ds/dialog');
  expect((await import('@wakata/ds')).WkDialog).toBe(WkDialog);
  const { defineWkDialog } = await import('@wakata/ds/dialog/define');
  expect(() => defineWkDialog()).not.toThrow();
  expect(customElements.get('wk-dialog')).toBe(WkDialog);
  expect(() => defineWkDialog()).not.toThrow();
});

test('modal lifecycle, focus containment, Escape, backdrop and repeated close are stable', async () => {
  await import('@wakata/ds/dialog/define');
  const { dialog, parent, invoker, content } = await createDialog();
  invoker.focus();
  await dialog.open();
  expect(dialog.opened).toBe(true);
  expect(dialog.hasAttribute('opened')).toBe(true);
  expect(content.getAttribute('role')).toBe('dialog');
  expect(content.getAttribute('aria-modal')).toBe('true');
  expect(document.body.classList.contains('overlays-scroll-lock')).toBe(true);
  const nativeModal = dialog.shadowRoot!.querySelector<HTMLDialogElement>(
    'dialog[data-overlay-outer-wrapper]',
  );
  expect(nativeModal?.matches(':modal')).toBe(true);
  expect(document.activeElement).toBe(content);

  const backdrop = dialog.shadowRoot!.querySelector<HTMLElement>('.overlays__backdrop');
  backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  expect(dialog.opened).toBe(true);

  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
  expect(content.contains(document.activeElement)).toBe(true);
  content.dispatchEvent(
    new KeyboardEvent('keyup', { key: 'Escape', bubbles: true, composed: true }),
  );
  await waitForOverlay(dialog);
  expect(dialog.opened).toBe(false);
  expect(document.activeElement).toBe(invoker);
  expect(document.body.classList.contains('overlays-scroll-lock')).toBe(false);

  for (let index = 0; index < 3; index += 1) {
    await dialog.open();
    expect(dialog.opened).toBe(true);
    await dialog.close();
    expect(dialog.opened).toBe(false);
    expect(document.body.classList.contains('overlays-scroll-lock')).toBe(false);
  }
  parent.remove();
});

test('focus returns to the nearest surviving focusable ancestor after invoker removal', async () => {
  await import('@wakata/ds/dialog/define');
  const { dialog, parent, invoker, content } = await createDialog({ ancestorFocusable: true });
  await dialog.open();
  content.querySelector<HTMLElement>('#inside')!.focus();
  invoker.remove();
  await dialog.close();
  expect(document.activeElement).toBe(parent);
  parent.remove();
});

test('removed content closes the overlay and returns focus to its surviving invoker', async () => {
  await import('@wakata/ds/dialog/define');
  const { dialog, parent, invoker, content } = await createDialog({ ancestorFocusable: true });
  await dialog.open();
  content.focus();
  content.remove();
  await new Promise<void>((resolve) => setTimeout(resolve, 50));
  await waitForOverlay(dialog);
  expect(dialog.opened).toBe(false);
  expect(document.body.classList.contains('overlays-scroll-lock')).toBe(false);
  expect(document.activeElement).toBe(invoker);
  parent.remove();
});

test.each(['hidden', 'disabled', 'disconnected'])(
  'ancestor fallback skips %s targets',
  async (state) => {
    await import('@wakata/ds/dialog/define');
    const outer = document.createElement('div');
    outer.tabIndex = 0;
    document.body.append(outer);
    const { dialog, parent, invoker } = await createDialog({ ancestorFocusable: true });
    outer.append(parent);
    await waitForOverlay(dialog);
    await dialog.open();
    invoker.remove();
    if (state === 'hidden') parent.style.visibility = 'hidden';
    if (state === 'disabled') parent.setAttribute('aria-disabled', 'true');
    if (state === 'disconnected') {
      outer.append(dialog);
      parent.remove();
    }
    await dialog.close();
    expect(document.activeElement).toBe(outer);
    outer.remove();
  },
);

test.each(['programmatic', 'Escape', 'removed content'])(
  'closing via %s preserves the latest application focus',
  async (method) => {
    await import('@wakata/ds/dialog/define');
    const { dialog, parent, content, invoker } = await createDialog();
    const outside = document.createElement('button');
    document.body.append(outside);
    await dialog.open();
    dialog.addEventListener('opened-changed', (event) => {
      if (!(event as CustomEvent<{ opened: boolean }>).detail.opened) {
        outside.focus();
        invoker.focus();
      }
    });
    if (method === 'programmatic') await dialog.close();
    else if (method === 'Escape')
      content.dispatchEvent(
        new KeyboardEvent('keyup', { key: 'Escape', bubbles: true, composed: true }),
      );
    else content.remove();
    await new Promise<void>((resolve) => setTimeout(resolve, 50));
    await waitForOverlay(dialog);
    expect(dialog.opened).toBe(false);
    expect(document.activeElement).toBe(invoker);
    outside.remove();
    parent.remove();
  },
);

test('focus falls back to main, then body when no invoker ancestor is focusable', async () => {
  await import('@wakata/ds/dialog/define');
  const main = document.createElement('main');
  document.body.append(main);
  const first = await createDialog({ noInvoker: true });
  main.append(first.parent);
  await first.dialog.open();
  first.content.focus();
  await first.dialog.close();
  expect(document.activeElement).toBe(main);
  main.remove();

  const second = await createDialog({ noInvoker: true });
  second.content.focus();
  await second.dialog.open();
  await second.dialog.close();
  expect(document.activeElement).toBe(document.body);
  second.parent.remove();
});

test('autofocus wins over the content root and application focus is never stolen', async () => {
  await import('@wakata/ds/dialog/define');
  const autofocusDialog = await createDialog({ autofocus: true });
  await autofocusDialog.dialog.open();
  expect(document.activeElement).toBe(autofocusDialog.content.querySelector('#inside'));
  await autofocusDialog.dialog.close();
  autofocusDialog.parent.remove();

  const focusDialog = await createDialog();
  const outside = document.createElement('button');
  outside.textContent = 'Application focus';
  document.body.append(outside);
  await focusDialog.dialog.open();
  focusDialog.dialog.addEventListener('opened-changed', (event) => {
    if (!(event as CustomEvent<{ opened: boolean }>).detail.opened) outside.focus();
  });
  await focusDialog.dialog.close();
  expect(document.activeElement).toBe(outside);
  outside.remove();
  focusDialog.parent.remove();
});

test('global content inherits live nested theme values and restores consumer styles', async () => {
  await import('@wakata/ds/dialog/define');
  const scope = document.createElement('div');
  scope.dataset.wkTheme = 'studio';
  scope.dataset.wkMode = 'light';
  scope.dataset.wkWireframe = 'false';
  scope.style.setProperty('--wk-font', 'Georgia, serif');
  const classTokens = document.createElement('style');
  classTokens.textContent = `
    .theme-token-a { --wk-accent: rgb(12, 34, 56); }
    .theme-token-b { --wk-accent: rgb(56, 34, 12); }
  `;
  document.head.append(classTokens);
  scope.classList.add('theme-token-a');
  const parent = document.createElement('div');
  parent.innerHTML = `
    <wk-dialog>
      <button slot="invoker">Open</button>
      <section slot="content" aria-label="Theme preview" style="--wk-font: Courier, monospace">
        <p>Theme preview</p>
      </section>
    </wk-dialog>
  `;
  scope.append(parent);
  document.body.append(scope);
  const dialog = parent.querySelector('wk-dialog')!;
  const content = parent.querySelector<HTMLElement>('[slot="content"]')!;
  await waitForOverlay(dialog);
  await dialog.open();
  expect(content.dataset.wkTheme).toBe('studio');
  expect(content.dataset.wkMode).toBe('light');
  expect(content.dataset.wkWireframe).toBe('false');
  expect(getComputedStyle(content).getPropertyValue('--wk-accent').trim()).toBe('rgb(12, 34, 56)');
  expect(getComputedStyle(content).fontFamily).toContain('Georgia');

  scope.dataset.wkTheme = 'fieldwork';
  scope.dataset.wkMode = 'dark';
  scope.dataset.wkWireframe = 'true';
  scope.classList.replace('theme-token-a', 'theme-token-b');
  scope.style.setProperty('--wk-font', 'monospace');
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  expect(content.dataset.wkTheme).toBe('fieldwork');
  expect(content.dataset.wkMode).toBe('dark');
  expect(content.dataset.wkWireframe).toBe('true');
  expect(getComputedStyle(content).fontFamily).toContain('monospace');
  expect(getComputedStyle(content).getPropertyValue('--wk-accent').trim()).toBe('rgb(56, 34, 12)');
  const geometry = {
    padding: getComputedStyle(content).padding,
    width: getComputedStyle(content).width,
    radius: getComputedStyle(content).borderRadius,
    shadow: getComputedStyle(content).boxShadow,
  };
  expect(geometry.padding).toBe('24px');
  expect(geometry.radius).toBe('0px');
  await dialog.close();
  expect(content.hasAttribute('data-wk-dialog-content')).toBe(false);
  expect(content.getAttribute('data-wk-theme')).toBeNull();
  expect(content.style.getPropertyValue('--wk-font')).toBe('Courier, monospace');
  scope.remove();
  classTokens.remove();
});

test('opening requires an accessible title and description IDs resolve in the content root', async () => {
  await import('@wakata/ds/dialog/define');
  const parent = document.createElement('div');
  parent.innerHTML = `
    <wk-dialog>
      <button slot="invoker">Open</button>
      <section slot="content" aria-describedby="missing-description"><p>No title</p></section>
    </wk-dialog>
  `;
  document.body.append(parent);
  const dialog = parent.querySelector('wk-dialog')!;
  await waitForOverlay(dialog);
  await expect(dialog.open()).rejects.toThrow('accessible title');
  parent.remove();
});

test('opening rejects a broken public description association', async () => {
  await import('@wakata/ds/dialog/define');
  const parent = document.createElement('div');
  parent.innerHTML = `
    <wk-dialog>
      <button slot="invoker">Open</button>
      <section slot="content" aria-label="Named review" aria-describedby="missing-description">
        Review description is missing.
      </section>
    </wk-dialog>
  `;
  document.body.append(parent);
  const dialog = parent.querySelector('wk-dialog')!;
  await waitForOverlay(dialog);
  await expect(dialog.open()).rejects.toThrow('aria-describedby');
  parent.remove();
});
