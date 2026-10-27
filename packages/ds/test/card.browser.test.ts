import { expect, test } from 'vitest';

test('class-only exports do not register wk-card', async () => {
  expect(customElements.get('wk-card')).toBeUndefined();
  const pkg = await import('@wakata/ds');
  const card = await import('@wakata/ds/card');
  expect(pkg.WkCard).toBe(card.WkCard);
  expect(customElements.get('wk-card')).toBeUndefined();
});

test('explicit registration is idempotent and keeps Card presentational', async () => {
  const { WkCard } = await import('@wakata/ds/card');
  const { defineWkCard } = await import('@wakata/ds/card/define');
  await import('@wakata/ds/define');
  expect(() => defineWkCard()).not.toThrow();
  expect(customElements.get('wk-card')).toBe(WkCard);

  const card = document.createElement('wk-card');
  card.innerHTML = '<h2 slot="heading">Heading</h2><p>Body</p>';
  document.body.append(card);
  await card.updateComplete;

  expect(card.getAttribute('role')).toBeNull();
  expect(card.getAttribute('tabindex')).toBeNull();
  expect(card.shadowRoot?.querySelectorAll('slot').length).toBe(3);
  expect(getComputedStyle(card).padding).toBe('16px');
  expect(getComputedStyle(card.shadowRoot!.querySelector('.sections')!).rowGap).toBe('12px');

  let activated = false;
  card.addEventListener('wk-activate', () => (activated = true));
  card.click();
  expect(activated).toBe(false);
  card.remove();
});
