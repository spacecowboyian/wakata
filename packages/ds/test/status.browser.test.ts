import { expect, test } from 'vitest';

async function make(attrs: Record<string, string> = {}, html = 'Saved') {
  await import('@wakata/ds/status/define');
  const el = document.createElement('wk-status');
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.innerHTML = html;
  document.body.append(el);
  await el.updateComplete;
  return el;
}

test('class-only exports do not register wk-status', async () => {
  expect(customElements.get('wk-status')).toBeUndefined();
  const pkg = await import('@wakata/ds');
  const mod = await import('@wakata/ds/status');
  expect(pkg.WkStatus).toBe(mod.WkStatus);
  expect(customElements.get('wk-status')).toBeUndefined();
});

test('registration is idempotent; default has no role or live attributes', async () => {
  const { defineWkStatus } = await import('@wakata/ds/status/define');
  expect(() => defineWkStatus()).not.toThrow();
  const el = await make();
  const root = el.shadowRoot!;
  expect(root.querySelector('[role]')).toBeNull();
  expect(root.querySelector('[aria-live]')).toBeNull();
  expect(el.getAttribute('role')).toBeNull();
  expect(el.getAttribute('tabindex')).toBeNull();
  expect(el.variant).toBe('informational');
  el.remove();
});

test('live opt-in yields exactly one role, never aria-live; invalid ignored', async () => {
  const cases: [string, string | null][] = [
    ['polite', 'status'],
    ['assertive', 'alert'],
    ['bogus', null],
  ];
  for (const [live, role] of cases) {
    const el = await make({ live });
    const roled = el.shadowRoot!.querySelectorAll('[role]');
    expect(roled.length).toBe(role ? 1 : 0);
    if (role) expect(roled[0]?.getAttribute('role')).toBe(role);
    expect(el.shadowRoot!.querySelector('[aria-live]')).toBeNull();
    el.remove();
  }
});

test('re-render with unchanged content keeps the same live node', async () => {
  const el = await make({ live: 'polite' });
  const node = el.shadowRoot!.querySelector('[role]');
  el.setAttribute('variant', 'success');
  await el.updateComplete;
  el.requestUpdate();
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('[role]')).toBe(node);
  el.remove();
});

test('icon is aria-hidden and only shown when slotted; unknown variant falls back', async () => {
  const el = await make({ variant: 'nope' }, '<span slot="icon">✓</span>Saved');
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('.icon')!.getAttribute('aria-hidden')).toBe('true');
  expect(el.effectiveVariant).toBe('informational');
  expect(el.textContent).toContain('Saved');
  const bare = await make();
  expect(bare.shadowRoot!.querySelector('.icon')!.hasAttribute('hidden')).toBe(true);
  el.remove();
  bare.remove();
});

test('danger uses existing token and long text wraps', async () => {
  const wrap = document.createElement('div');
  wrap.style.width = '120px';
  wrap.style.setProperty('--wk-danger', 'rgb(200, 0, 0)');
  document.body.append(wrap);
  const el = await make({ variant: 'danger' }, 'x'.repeat(200));
  wrap.append(el);
  await el.updateComplete;
  const box = el.shadowRoot!.querySelector('.status')!;
  expect(getComputedStyle(box).borderTopColor).toBe('rgb(200, 0, 0)');
  expect(el.scrollWidth).toBeLessThanOrEqual(el.clientWidth + 1);
  wrap.remove();
});
