// Chromium-only: verifies the rendered focus treatment under forced-colors emulation.
import { afterEach, expect, test } from 'vitest';
import { cdp } from 'vitest/browser';
import { userEvent } from 'vitest/browser';
import '../src/themes/themes.css';
import '@wakata/ds/define';

let host: HTMLElement | undefined;

afterEach(async () => {
  host?.remove();
  host = undefined;
  await cdp().send('Emulation.setEmulatedMedia', { features: [] });
});

test('rounded fields retain one keyboard focus outline in forced colors', async () => {
  await cdp().send('Emulation.setEmulatedMedia', {
    features: [{ name: 'forced-colors', value: 'active' }],
  });
  expect(matchMedia('(forced-colors: active)').matches).toBe(true);

  host = document.createElement('div');
  host.dataset.wkTheme = 'studio';
  host.dataset.wkMode = 'light';
  host.innerHTML = `
    <wk-text-field name="name" label="Name"></wk-text-field>
    <wk-select name="destination" label="Destination">
      <select slot="input"><option value="one">One</option></select>
    </wk-select>
    <wk-text-area name="notes" label="Notes"></wk-text-area>`;
  document.body.append(host);

  const fields = [...host.querySelectorAll<HTMLElement>('wk-text-field, wk-select, wk-text-area')];
  await Promise.all(
    fields.map(
      (field) => (field as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete,
    ),
  );

  const reference = document.createElement('span');
  reference.style.outlineColor = 'Highlight';
  host.append(reference);
  const highlight = getComputedStyle(reference).outlineColor;

  for (const field of fields) {
    const control = field.querySelector<HTMLElement>('[slot="input"]')!;
    await userEvent.tab();
    expect(control).toBe(document.activeElement);
    expect(control.matches(':focus-visible')).toBe(true);
    const style = getComputedStyle(control);
    expect(style.outlineStyle).toBe('solid');
    expect(style.outlineWidth).toBe('2px');
    expect(style.outlineColor).toBe(highlight);
    expect(style.borderTopLeftRadius).toBe('16px');
  }
});
