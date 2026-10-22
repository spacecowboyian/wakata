import { expect, test } from 'vitest';

// "@wakata/ds" resolves through package.json exports to the built dist output.
test('class entry points do not register the element', async () => {
  expect(customElements.get('wk-button')).toBeUndefined();
  const pkg = await import('@wakata/ds');
  const button = await import('@wakata/ds/button');
  expect(pkg.WkButton).toBe(button.WkButton);
  expect(Object.keys(pkg)).toContain('wkTokens');
  expect(customElements.get('wk-button')).toBeUndefined();
});

test('define entry points register once and tolerate repeats', async () => {
  const { WkButton } = await import('@wakata/ds');
  await import('@wakata/ds/button/define');
  await import('@wakata/ds/define');
  const { defineWkButton } = await import('@wakata/ds/button/define');
  expect(() => defineWkButton()).not.toThrow();
  expect(customElements.get('wk-button')).toBe(WkButton);
});

test('built element is a real LionButton with documented defaults', async () => {
  const { LionButton } = await import('@lion/ui/button.js');
  const { WkButton } = await import('@wakata/ds');
  await import('@wakata/ds/define');
  const el = document.createElement('wk-button');
  el.textContent = 'Built';
  document.body.append(el);
  await el.updateComplete;
  expect(el).toBeInstanceOf(LionButton);
  expect(el).toBeInstanceOf(WkButton);
  expect([el.variant, el.intent, el.size, el.loading]).toEqual([
    'secondary',
    'normal',
    'medium',
    false,
  ]);
  el.remove();
});
