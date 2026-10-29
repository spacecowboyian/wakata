import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';

async function make(attrs: Record<string, string>, text = 'Go') {
  await import('@wakata/ds/link/define');
  const el = document.createElement('wk-link');
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.textContent = text;
  document.body.append(el);
  await el.updateComplete;
  return el;
}

test('class-only exports do not register wk-link', async () => {
  expect(customElements.get('wk-link')).toBeUndefined();
  const pkg = await import('@wakata/ds');
  const link = await import('@wakata/ds/link');
  expect(pkg.WkLink).toBe(link.WkLink);
  expect(customElements.get('wk-link')).toBeUndefined();
});

test('registration is idempotent and renders a native anchor', async () => {
  const { WkLink } = await import('@wakata/ds/link');
  const { defineWkLink } = await import('@wakata/ds/link/define');
  expect(() => defineWkLink()).not.toThrow();
  expect(customElements.get('wk-link')).toBe(WkLink);
  const el = await make({ href: '/a' });
  const a = el.shadowRoot!.querySelector('a')!;
  expect(a.getAttribute('href')).toBe('/a');
  expect(a.getAttribute('rel')).toBeNull();
  el.remove();
});

test('missing, empty and javascript: hrefs render plain text', async () => {
  const cases: Record<string, string>[] = [
    {},
    { href: '' },
    { href: '  JaVa\tScript:alert(1)' },
    { href: 'data:text/html,<script>alert(1)</script>' },
    { href: 'vbscript:msgbox(1)' },
  ];
  for (const attrs of cases) {
    const el = await make(attrs);
    expect(el.shadowRoot!.querySelector('a')).toBeNull();
    expect(el.shadowRoot!.querySelector('span')).not.toBeNull();
    expect(el.getAttribute('role')).toBeNull();
    el.remove();
  }
});

test('target=_blank forces noopener noreferrer and keeps caller tokens', async () => {
  const el = await make({ href: 'https://example.com', target: '_blank', rel: 'author noopener' });
  const rel = el.shadowRoot!.querySelector('a')!.getAttribute('rel')!.split(' ');
  expect(rel.sort()).toEqual(['author', 'noopener', 'noreferrer']);
  el.rel = null;
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('a')!.getAttribute('rel')).toBe('noopener noreferrer');
  el.remove();
});

test('variant defaults to inline and standalone changes display', async () => {
  const el = await make({ href: '/a' });
  expect(getComputedStyle(el).display).toBe('inline');
  el.variant = 'standalone';
  await el.updateComplete;
  expect(getComputedStyle(el).display).toBe('inline-block');
  expect(getComputedStyle(el.shadowRoot!.querySelector('a')!).textDecorationLine).toContain(
    'underline',
  );
  el.remove();
});

test('native anchor receives focus and Enter activates it once', async () => {
  const el = await make({ href: '#wk-link-activation' }, 'Read details');
  const anchor = el.shadowRoot!.querySelector('a')!;
  expect(el.textContent).toBe('Read details');
  let activations = 0;
  anchor.addEventListener('click', (event) => {
    event.preventDefault();
    activations++;
  });
  anchor.focus();
  expect(el.shadowRoot!.activeElement).toBe(anchor);
  await userEvent.keyboard('{Enter}');
  expect(activations).toBe(1);
  el.remove();
});
