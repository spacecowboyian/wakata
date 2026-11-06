import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

const tick = () => new Promise((r) => setTimeout(r, 20));

async function make(value?: string, disabledB = false) {
  await import('@wakata/ds/tabs/define');
  const host = document.createElement('div');
  host.innerHTML = `<wk-tabs label="Sections" ${value === undefined ? '' : `value="${value}"`}>
    <wk-tab slot="tab" value="a">Alpha</wk-tab>
    <wk-tab slot="tab" value="b" ${disabledB ? 'disabled' : ''}>Beta</wk-tab>
    <wk-tab slot="tab" value="c">Gamma</wk-tab>
    <wk-tab-panel slot="panel" value="a">A <button>in a</button></wk-tab-panel>
    <wk-tab-panel slot="panel" value="b">B</wk-tab-panel>
    <wk-tab-panel slot="panel" value="c">C</wk-tab-panel>
  </wk-tabs>`;
  document.body.append(host);
  const tabs = host.querySelector('wk-tabs')!;
  await tick();
  const events: string[] = [];
  tabs.addEventListener('wk-change', (e) => events.push((e as CustomEvent).detail.value));
  const tab = (v: string) => tabs.querySelector<HTMLElement>(`wk-tab[value=${v}]`)!;
  const panel = (v: string) => tabs.querySelector<HTMLElement>(`wk-tab-panel[value=${v}]`)!;
  return { host, tabs, events, tab, panel };
}

const selected = (tabs: Element) =>
  Array.from(tabs.querySelectorAll('wk-tab'))
    .filter((t) => t.getAttribute('aria-selected') === 'true')
    .map((t) => t.getAttribute('value'));

afterEach(() => (document.body.innerHTML = ''));

test('class exports do not register; define is idempotent', async () => {
  expect(customElements.get('wk-tabs')).toBeUndefined();
  const pkg = await import('@wakata/ds');
  const mod = await import('@wakata/ds/tabs');
  expect(pkg.WkTabs).toBe(mod.WkTabs);
  expect(customElements.get('wk-tabs')).toBeUndefined();
  const { defineWkTabs } = await import('@wakata/ds/tabs/define');
  expect(() => defineWkTabs()).not.toThrow();
});

test('roles, names and tab/panel relationships by value', async () => {
  const { tabs, tab, panel } = await make('b');
  const list = tabs.shadowRoot!.querySelector('[role=tablist]')!;
  expect(list.getAttribute('aria-label')).toBe('Sections');
  for (const v of ['a', 'b', 'c']) {
    expect(tab(v).getAttribute('role')).toBe('tab');
    expect(panel(v).getAttribute('role')).toBe('tabpanel');
    expect(tab(v).getAttribute('aria-controls')).toBe(panel(v).id);
    expect(panel(v).getAttribute('aria-labelledby')).toBe(tab(v).id);
  }
  expect(selected(tabs)).toEqual(['b']);
  expect(panel('b').hidden).toBe(false);
  expect(panel('a').hidden).toBe(true);
  expect(panel('c').hidden).toBe(true);
  expect(panel('b').tabIndex).toBe(0);
  expect(panel('a').hasAttribute('tabindex')).toBe(false);
});

test('default and invalid values normalize to the first enabled tab silently', async () => {
  const none = await make();
  expect(selected(none.tabs)).toEqual(['a']);
  expect(none.tabs.value).toBe('a');
  expect(none.events).toEqual([]);
  const bad = await make('zzz', false);
  expect(selected(bad.tabs)).toEqual(['a']);
  expect(bad.tabs.value).toBe('a');
  const skip = await make(undefined, false);
  skip.tab('a').setAttribute('disabled', '');
  await tick();
  expect(selected(skip.tabs)).toEqual(['b']);
});

test('arrows, Home and End move focus only; roving tab stop; disabled skipped', async () => {
  const { tabs, tab, panel, events } = await make('a', true);
  expect(tab('a').tabIndex).toBe(0);
  expect(tab('b').tabIndex).toBe(-1);
  tab('a').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(tab('c'));
  expect(tab('c').tabIndex).toBe(0);
  expect(tab('a').tabIndex).toBe(-1);
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(tab('a'));
  await userEvent.keyboard('{ArrowLeft}');
  expect(document.activeElement).toBe(tab('c'));
  await userEvent.keyboard('{Home}');
  expect(document.activeElement).toBe(tab('a'));
  await userEvent.keyboard('{End}');
  expect(document.activeElement).toBe(tab('c'));
  expect(selected(tabs)).toEqual(['a']);
  expect(panel('a').hidden).toBe(false);
  expect(panel('c').hidden).toBe(true);
  expect(events).toEqual([]);
});

test('Enter and Space activate with one event each; reactivating is silent', async () => {
  const { tabs, tab, panel, events } = await make('a');
  tab('a').focus();
  await userEvent.keyboard('{ArrowRight}{ArrowRight}{Enter}');
  expect(selected(tabs)).toEqual(['c']);
  expect(tabs.value).toBe('c');
  expect(panel('c').hidden).toBe(false);
  expect(events).toEqual(['c']);
  await userEvent.keyboard('{Enter}');
  expect(events).toEqual(['c']);
  await userEvent.keyboard('{Home}{ }');
  expect(selected(tabs)).toEqual(['a']);
  expect(events).toEqual(['c', 'a']);
  expect(document.activeElement).toBe(tab('a'));
});

test('click activates once; disabled tabs ignore click and Enter', async () => {
  const { tabs, tab, events } = await make('a', true);
  await userEvent.click(tab('c'));
  expect(selected(tabs)).toEqual(['c']);
  expect(events).toEqual(['c']);
  tab('b').click();
  tab('b').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  await tick();
  expect(selected(tabs)).toEqual(['c']);
  expect(tab('b').getAttribute('aria-disabled')).toBe('true');
  expect(events).toEqual(['c']);
});

test('tab stop returns to the selected tab after focus leaves', async () => {
  const { tab } = await make('a');
  tab('a').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(tab('b').tabIndex).toBe(0);
  (document.activeElement as HTMLElement).blur();
  await tick();
  expect(tab('a').tabIndex).toBe(0);
  expect(tab('b').tabIndex).toBe(-1);
});

test('Tab leaves the tablist for the selected panel and mode changes stay silent', async () => {
  const { host, tabs, tab, panel, events } = await make('a');
  tab('a').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(tab('b'));
  host.setAttribute('data-wk-mode', 'dark');
  panel('a').textContent = 'Updated body content';
  await tick();
  expect(selected(tabs)).toEqual(['a']);
  expect(document.activeElement).toBe(tab('b'));
  expect(events).toEqual([]);
  await userEvent.tab();
  expect(document.activeElement).toBe(panel('a'));
  expect(tab('a').tabIndex).toBe(0);
});

test('programmatic value updates are silent and update the panel', async () => {
  const { tabs, panel, events } = await make('a');
  tabs.value = 'c';
  await tabs.updateComplete;
  expect(selected(tabs)).toEqual(['c']);
  expect(panel('c').hidden).toBe(false);
  expect(tabs.getAttribute('value')).toBe('c');
  tabs.setAttribute('value', 'b');
  await tabs.updateComplete;
  expect(selected(tabs)).toEqual(['b']);
  tabs.value = 'nope';
  await tabs.updateComplete;
  await tick();
  expect(selected(tabs)).toEqual(['a']);
  expect(tabs.value).toBe('a');
  expect(events).toEqual([]);
});

test('dynamic children: add, change value, remove selected', async () => {
  const { tabs, tab, panel, events } = await make('c');
  const t = document.createElement('wk-tab');
  t.slot = 'tab';
  t.setAttribute('value', 'd');
  t.textContent = 'Delta';
  const p = document.createElement('wk-tab-panel');
  p.slot = 'panel';
  p.setAttribute('value', 'd');
  p.textContent = 'D';
  tabs.append(t, p);
  await tick();
  expect(selected(tabs)).toEqual(['c']);
  expect(t.getAttribute('aria-controls')).toBe(p.id);
  tabs.value = 'd';
  await tick();
  expect(p.hidden).toBe(false);
  t.remove();
  p.remove();
  await tick();
  expect(selected(tabs)).toEqual(['a']);
  expect(panel('a').hidden).toBe(false);
  expect(tabs.value).toBe('a');
  tab('c').setAttribute('disabled', '');
  tabs.value = 'c';
  await tick();
  expect(selected(tabs)).toEqual(['a']);
  expect(events).toEqual([]);
});

test('duplicate tabs and tabs without panels cannot be selected', async () => {
  const { tabs, tab, events } = await make('a');
  const duplicate = document.createElement('wk-tab');
  duplicate.slot = 'tab';
  duplicate.setAttribute('value', 'a');
  duplicate.textContent = 'Duplicate Alpha';
  const orphan = document.createElement('wk-tab');
  orphan.slot = 'tab';
  orphan.setAttribute('value', 'orphan');
  orphan.textContent = 'Orphan';
  tabs.append(duplicate, orphan);
  await tick();
  expect(duplicate.getAttribute('aria-disabled')).toBe('true');
  expect(orphan.getAttribute('aria-disabled')).toBe('true');
  expect(duplicate.tabIndex).toBe(-1);
  expect(orphan.tabIndex).toBe(-1);
  duplicate.click();
  orphan.click();
  expect(selected(tabs)).toEqual(['a']);
  expect(tabs.value).toBe('a');
  expect(tab('a').getAttribute('aria-selected')).toBe('true');
  expect(events).toEqual([]);
});

test('removing the panel of a focused tab moves focus to the fallback selection', async () => {
  const { tabs, tab, panel } = await make('a');
  tab('a').focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(tab('b'));
  panel('b').remove();
  await tick();
  expect(tab('b').getAttribute('aria-disabled')).toBe('true');
  expect(document.activeElement).toBe(tab('a'));
  expect(selected(tabs)).toEqual(['a']);
});

test('no enabled complete pair leaves value empty and every panel hidden', async () => {
  const { tabs, tab } = await make('a');
  for (const value of ['a', 'b', 'c']) tab(value).setAttribute('disabled', '');
  await tick();
  expect(tabs.value).toBe('');
  expect(selected(tabs)).toEqual([]);
  for (const panel of tabs.querySelectorAll('wk-tab-panel')) expect(panel.hidden).toBe(true);
});

test('narrow width keeps every tab visible by wrapping', async () => {
  const { host, tab } = await make('a');
  host.style.width = '120px';
  await tick();
  const tops = new Set(['a', 'b', 'c'].map((v) => tab(v).getBoundingClientRect().top));
  expect(tops.size).toBeGreaterThan(1);
  for (const v of ['a', 'b', 'c']) {
    const r = tab(v).getBoundingClientRect();
    expect(r.width).toBeGreaterThan(0);
    expect(r.right).toBeLessThanOrEqual(121);
  }
});
