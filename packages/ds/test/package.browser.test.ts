import { expect, test } from 'vitest';

// "@wakata/ds" resolves through package.json exports to the built dist output.
test('class entry points do not register the element', async () => {
  expect(customElements.get('wk-button')).toBeUndefined();
  const pkg = await import('@wakata/ds');
  const button = await import('@wakata/ds/button');
  const textField = await import('@wakata/ds/text-field');
  const select = await import('@wakata/ds/select');
  const modeSwitch = await import('@wakata/ds/mode-switch');
  const radioGroup = await import('@wakata/ds/radio-group');
  const radio = await import('@wakata/ds/radio');
  expect(pkg.WkRadioGroup).toBe(radioGroup.WkRadioGroup);
  expect(pkg.WkRadio).toBe(radio.WkRadio);
  expect(customElements.get('wk-radio-group')).toBeUndefined();
  expect(customElements.get('wk-radio')).toBeUndefined();
  expect(pkg.WkModeSwitch).toBe(modeSwitch.WkModeSwitch);
  expect(customElements.get('wk-mode-switch')).toBeUndefined();
  expect(pkg.WkSelect).toBe(select.WkSelect);
  expect(customElements.get('wk-select')).toBeUndefined();
  expect(pkg.WkButton).toBe(button.WkButton);
  expect(pkg.WkTextField).toBe(textField.WkTextField);
  expect(Object.keys(pkg)).toContain('wkTokens');
  expect(customElements.get('wk-button')).toBeUndefined();
  expect(customElements.get('wk-text-field')).toBeUndefined();
});

test('define entry points register once and tolerate repeats', async () => {
  const { WkButton } = await import('@wakata/ds');
  await import('@wakata/ds/button/define');
  await import('@wakata/ds/define');
  const { defineWkButton } = await import('@wakata/ds/button/define');
  const { WkTextField } = await import('@wakata/ds/text-field');
  const { defineWkTextField } = await import('@wakata/ds/text-field/define');
  expect(() => defineWkButton()).not.toThrow();
  expect(() => defineWkTextField()).not.toThrow();
  const { defineWkSelect } = await import('@wakata/ds/select/define');
  expect(() => defineWkSelect()).not.toThrow();
  const { defineWkModeSwitch } = await import('@wakata/ds/mode-switch/define');
  expect(() => defineWkModeSwitch()).not.toThrow();
  const { defineWkRadioGroup } = await import('@wakata/ds/radio-group/define');
  const { defineWkRadio } = await import('@wakata/ds/radio/define');
  expect(() => defineWkRadioGroup()).not.toThrow();
  expect(() => defineWkRadio()).not.toThrow();
  expect(customElements.get('wk-radio-group')).toBe((await import('@wakata/ds')).WkRadioGroup);
  expect(customElements.get('wk-radio')).toBe((await import('@wakata/ds')).WkRadio);
  expect(customElements.get('wk-mode-switch')).toBe((await import('@wakata/ds')).WkModeSwitch);
  expect(customElements.get('wk-select')).toBe((await import('@wakata/ds/select')).WkSelect);
  expect(customElements.get('wk-button')).toBe(WkButton);
  expect(customElements.get('wk-text-field')).toBe(WkTextField);
});

test('unsupported positive intent never renders green or a distinct action colour', async () => {
  await import('@wakata/ds/define');
  const make = (intent?: string) => {
    const el = document.createElement('wk-button');
    el.setAttribute('variant', 'primary');
    if (intent) el.setAttribute('intent', intent);
    el.textContent = 'Save';
    document.body.append(el);
    return el;
  };
  const plain = make();
  const invalid = make('positive');
  const danger = make('danger');
  await Promise.all([plain, invalid, danger].map((e) => e.updateComplete));
  expect(getComputedStyle(invalid).backgroundColor).toBe(getComputedStyle(plain).backgroundColor);
  expect(getComputedStyle(invalid).backgroundColor).not.toBe('rgb(23, 98, 60)');
  expect(getComputedStyle(danger).backgroundColor).toBe('rgb(160, 34, 34)');
  for (const e of [plain, invalid, danger]) e.remove();
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
