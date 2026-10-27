import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import type { WkModeChangeDetail } from '@wakata/ds/mode-switch';
import '@wakata/ds/themes.css';
import '@wakata/ds/mode-switch/define';

const key = 'wakata:color-mode:v1';
const fixtures: Element[] = [];
const match = window.matchMedia.bind(window);
let systemMedia: MediaQueryList;
vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
  systemMedia = match(query);
  return systemMedia;
});
afterEach(() => {
  vi.restoreAllMocks();
  for (const element of fixtures.splice(0)) element.remove();
  const reset = document.createElement('wk-mode-switch');
  reset.mode = 'system';
  document.body.append(reset);
  reset.remove();
  document.documentElement.removeAttribute('data-wk-mode');
});

async function mount(mode?: 'system' | 'light' | 'dark') {
  const element = document.createElement('wk-mode-switch');
  if (mode) element.mode = mode;
  document.body.append(element);
  fixtures.push(element);
  await element.updateComplete;
  return element;
}

const radio = (element: HTMLElement, value: string) =>
  element.shadowRoot!.querySelector<HTMLInputElement>(`input[value="${value}"]`)!;

test('a stored override initializes a fresh document controller', async () => {
  localStorage.setItem(key, 'dark');
  const element = await mount();
  expect(element.mode).toBe('dark');
  expect(element.getAttribute('mode')).toBe('dark');
  expect(document.documentElement.dataset.wkMode).toBe('dark');
});

test('native group has a legend, three labels, reflected default and one checked radio', async () => {
  const element = await mount();
  expect(element.mode).toBe('system');
  expect(element.getAttribute('mode')).toBe('system');
  expect(element.shadowRoot!.querySelector('fieldset > legend')!.textContent).toBe('Colour mode');
  const inputs = [...element.shadowRoot!.querySelectorAll('input')];
  expect(inputs.map((input) => [input.type, input.labels?.[0]?.textContent?.trim()])).toEqual([
    ['radio', 'System'],
    ['radio', 'Light'],
    ['radio', 'Dark'],
  ]);
  expect(inputs.filter((input) => input.checked).map((input) => input.value)).toEqual(['system']);
});

test('native keyboard, focus, exact event payload and composed propagation; peers stay silent', async () => {
  const shell = document.createElement('div');
  document.body.append(shell);
  fixtures.push(shell);
  const shadow = shell.attachShadow({ mode: 'open' });
  const before = document.createElement('button');
  before.textContent = 'Before mode control';
  shadow.append(before);
  const element = document.createElement('wk-mode-switch');
  shadow.append(element);
  const peer = await mount();
  await element.updateComplete;
  const events: CustomEvent<WkModeChangeDetail>[] = [];
  const onChange = (event: CustomEvent<WkModeChangeDetail>) => events.push(event);
  document.addEventListener('wk-mode-change', onChange);
  try {
    before.focus();
    // macOS WebKit's default Tab behavior skips native radio controls.
    // Option+Tab traverses all controls, as verified against a plain native radio.
    const tab =
      navigator.userAgent.includes('Macintosh') && navigator.userAgent.includes('AppleWebKit')
        ? '{Alt>}{Tab}{/Alt}'
        : '{Tab}';
    await userEvent.keyboard(tab);
    expect(element.shadowRoot!.activeElement).toBe(radio(element, 'system'));
    expect(getComputedStyle(radio(element, 'system')).outlineStyle).not.toBe('none');
    await userEvent.keyboard('{ArrowRight}');
    await peer.updateComplete;
    expect(events).toHaveLength(1);
    expect(events[0]!.detail).toEqual({ mode: 'light', resolvedMode: 'light' });
    expect([events[0]!.bubbles, events[0]!.composed]).toEqual([true, true]);
    expect(peer.mode).toBe('light');
    expect(radio(peer, 'light').checked).toBe(true);
    await userEvent.keyboard('{ArrowRight}');
    expect(events).toHaveLength(2);
    expect(events[1]!.detail).toEqual({ mode: 'dark', resolvedMode: 'dark' });
    expect(document.documentElement.dataset.wkMode).toBe('dark');
    expect(localStorage.getItem(key)).toBe('dark');
    await userEvent.keyboard(tab);
    expect(element.shadowRoot!.activeElement).toBeNull();
  } finally {
    document.removeEventListener('wk-mode-change', onChange);
  }
});

test('programmatic property/attribute changes sync and persist without user events; reconnect keeps memory', async () => {
  const first = await mount('light');
  const second = await mount();
  const listener = vi.fn();
  first.addEventListener('wk-mode-change', listener);
  second.addEventListener('wk-mode-change', listener);
  first.setAttribute('mode', 'dark');
  await Promise.all([first.updateComplete, second.updateComplete]);
  expect([first.mode, second.mode, second.getAttribute('mode')]).toEqual(['dark', 'dark', 'dark']);
  expect(localStorage.getItem(key)).toBe('dark');
  first.remove();
  second.remove();
  document.body.append(first, second);
  await Promise.all([first.updateComplete, second.updateComplete]);
  expect([first.mode, second.mode]).toEqual(['dark', 'dark']);
  second.mode = 'system';
  expect(localStorage.getItem(key)).toBeNull();
  expect(first.mode).toBe('system');
  expect(listener).not.toHaveBeenCalled();
});

test('live system changes resolve the root but never override an explicit choice or emit user events', async () => {
  const element = await mount();
  const listener = vi.fn();
  element.addEventListener('wk-mode-change', listener);
  const matches = vi.spyOn(MediaQueryList.prototype, 'matches', 'get').mockReturnValue(true);
  systemMedia.dispatchEvent(new Event('change'));
  expect(document.documentElement.dataset.wkMode).toBe('dark');
  matches.mockReturnValue(false);
  systemMedia.dispatchEvent(new Event('change'));
  expect(document.documentElement.dataset.wkMode).toBe('light');
  element.mode = 'dark';
  systemMedia.dispatchEvent(new Event('change'));
  expect(document.documentElement.dataset.wkMode).toBe('dark');
  expect(listener).not.toHaveBeenCalled();
});

test('storage write/remove failures keep a usable in-memory shared choice and warn', async () => {
  const first = await mount();
  const second = await mount();
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('Blocked', 'SecurityError');
  });
  vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
    throw new DOMException('Blocked', 'SecurityError');
  });
  await userEvent.click(radio(first, 'dark'));
  expect([first.mode, second.mode, document.documentElement.dataset.wkMode]).toEqual([
    'dark',
    'dark',
    'dark',
  ]);
  first.mode = 'system';
  expect(second.mode).toBe('system');
  expect(warn).toHaveBeenCalledTimes(2);
});

test('storage events sync silently, including override removal and clear', async () => {
  const element = await mount();
  const listener = vi.fn();
  element.addEventListener('wk-mode-change', listener);
  const send = (key: string | null, newValue: string | null) =>
    window.dispatchEvent(new StorageEvent('storage', { key, newValue, storageArea: localStorage }));
  send(key, 'dark');
  expect(element.mode).toBe('dark');
  send('unrelated', 'light');
  expect(element.mode).toBe('dark');
  send(key, null);
  expect(element.mode).toBe('system');
  send(key, 'light');
  send(null, null);
  expect(element.mode).toBe('system');
  expect(listener).not.toHaveBeenCalled();
});

test('three themes, both modes and wireframe retain local overrides and fit 280px', async () => {
  const element = await mount('dark');
  const host = document.createElement('div');
  host.style.width = '280px';
  host.innerHTML = ['neutral', 'studio', 'fieldwork']
    .flatMap((theme) =>
      ['light', 'dark'].flatMap((mode) =>
        ['false', 'true'].map(
          (wireframe) => `<section data-wk-theme="${theme}" data-wk-mode="${mode}"
            data-wk-wireframe="${wireframe}"><wk-mode-switch></wk-mode-switch></section>`,
        ),
      ),
    )
    .join('');
  document.body.append(host);
  fixtures.push(host);
  const switches = [...host.querySelectorAll('wk-mode-switch')];
  await Promise.all(switches.map((item) => item.updateComplete));
  expect(new Set(switches.map((item) => getComputedStyle(item).fontFamily)).size).toBe(3);
  for (const item of switches) {
    const fieldset = item.shadowRoot!.querySelector('fieldset')!;
    expect(fieldset.getBoundingClientRect().width).toBeLessThanOrEqual(280);
    expect(item.scrollWidth).toBeLessThanOrEqual(280);
    for (const label of item.shadowRoot!.querySelectorAll('label')) {
      expect(label.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    }
    const localMode = item.parentElement!.dataset.wkMode;
    expect(getComputedStyle(fieldset).backgroundColor).toBe(
      localMode === 'dark' ? 'rgb(35, 35, 35)' : 'rgb(255, 255, 255)',
    );
    expect(item.mode).toBe('dark');
  }
  element.mode = 'light';
  expect(host.querySelector('[data-wk-mode="dark"]')!.getAttribute('data-wk-mode')).toBe('dark');
});
