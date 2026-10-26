import { afterEach, expect, test } from 'vitest';
import '@wakata/ds/themes.css';

await import('@wakata/ds/define');

const fixtures: HTMLElement[] = [];
afterEach(() => fixtures.splice(0).forEach((fixture) => fixture.remove()));

async function mount(markup: string) {
  const fixture = document.createElement('div');
  fixture.innerHTML = markup;
  document.body.append(fixture);
  fixtures.push(fixture);
  const buttons = [...fixture.querySelectorAll('wk-button')];
  for (const button of buttons) button.style.transition = 'none';
  await Promise.all(buttons.map((button) => button.updateComplete));
  return fixture;
}

const action = (id: string) => `<wk-button id="${id}" variant="primary">Save</wk-button>`;
const appearance = (root: HTMLElement, id: string) => {
  const style = getComputedStyle(root.querySelector(`#${id}`)!);
  return [style.backgroundColor, style.color, style.borderTopLeftRadius];
};

const palettes = [
  {
    theme: 'neutral',
    light: ['rgb(23, 23, 23)', 'rgb(255, 255, 255)', '0px'],
    dark: ['rgb(238, 238, 238)', 'rgb(23, 23, 23)', '0px'],
  },
  {
    theme: 'studio',
    light: ['rgb(73, 53, 163)', 'rgb(255, 255, 255)', '16px'],
    dark: ['rgb(196, 182, 255)', 'rgb(32, 20, 67)', '16px'],
  },
  {
    theme: 'fieldwork',
    light: ['rgb(40, 88, 66)', 'rgb(255, 255, 255)', '8px'],
    dark: ['rgb(161, 212, 180)', 'rgb(21, 44, 32)', '8px'],
  },
];

for (const { theme, light, dark } of palettes) {
  test(`${theme}: nearest mode wins at three levels, including a mode-only child`, async () => {
    const fixture = await mount(`
      <div data-wk-theme="${theme}" data-wk-mode="dark">
        ${action('outer')}
        <div data-wk-theme="${theme}" data-wk-mode="light">
          ${action('inner')}
          <div data-wk-mode="dark">${action('deep')}</div>
        </div>
        ${action('sibling')}
      </div>`);
    expect(appearance(fixture, 'outer')).toEqual(dark);
    expect(appearance(fixture, 'inner')).toEqual(light);
    expect(appearance(fixture, 'deep')).toEqual(dark);
    expect(appearance(fixture, 'sibling')).toEqual(dark);

    // Reverse every explicit mode and verify inherited palettes are recomputed.
    for (const root of fixture.querySelectorAll<HTMLElement>('[data-wk-mode]')) {
      root.dataset.wkMode = root.dataset.wkMode === 'dark' ? 'light' : 'dark';
    }
    expect(appearance(fixture, 'outer')).toEqual(light);
    expect(appearance(fixture, 'inner')).toEqual(dark);
    expect(appearance(fixture, 'deep')).toEqual(light);
    expect(appearance(fixture, 'sibling')).toEqual(light);
  });
}

test('brand roots inherit nearest mode while adjacent brands retain their palettes and typography', async () => {
  const fixture = await mount(`
    <div data-wk-mode="dark">
      <div data-wk-theme="studio">${action('studio')}</div>
      <div data-wk-mode="light"><div data-wk-theme="fieldwork">${action('fieldwork')}</div></div>
      <div data-wk-theme="neutral">${action('neutral')}</div>
    </div>`);
  expect(appearance(fixture, 'studio')).toEqual(palettes[1]!.dark);
  expect(appearance(fixture, 'fieldwork')).toEqual(palettes[2]!.light);
  expect(appearance(fixture, 'neutral')).toEqual(palettes[0]!.dark);
  expect(getComputedStyle(fixture.querySelector('#studio')!).fontFamily).toContain('Georgia');
  expect(getComputedStyle(fixture.querySelector('#fieldwork')!).fontFamily).toContain('Verdana');
});

test('wireframe false restores the brand, nested true reenters, and mode changes remain independent', async () => {
  const fixture = await mount(`
    <div data-wk-theme="studio" data-wk-mode="dark" data-wk-wireframe="true">
      ${action('outer')}
      <div data-wk-theme="fieldwork" data-wk-mode="light">
        ${action('inherited')}
        <div id="opt-out" data-wk-wireframe="false">
          ${action('restored')}
          <div data-wk-mode="dark">${action('restored-dark')}</div>
          <div data-wk-wireframe="true">${action('reentered')}</div>
        </div>
      </div>
      ${action('sibling')}
    </div>`);
  expect(appearance(fixture, 'outer')).toEqual(palettes[0]!.dark);
  expect(appearance(fixture, 'inherited')).toEqual(palettes[0]!.light);
  expect(appearance(fixture, 'restored')).toEqual(palettes[2]!.light);
  expect(appearance(fixture, 'restored-dark')).toEqual(palettes[2]!.dark);
  expect(appearance(fixture, 'reentered')).toEqual(palettes[0]!.light);
  expect(appearance(fixture, 'sibling')).toEqual(palettes[0]!.dark);

  fixture.querySelector('#opt-out')!.removeAttribute('data-wk-wireframe');
  expect(appearance(fixture, 'restored')).toEqual(palettes[0]!.light);
  expect(appearance(fixture, 'restored-dark')).toEqual(palettes[0]!.dark);
});

test('wireframe preserves semantic feedback and destructive actions in both modes', async () => {
  const fixture = await mount(`
    <div data-wk-theme="studio" data-wk-mode="dark" data-wk-wireframe="true">
      <wk-button id="dark-danger" variant="primary" intent="danger">Delete</wk-button>
      <span id="dark-success" style="color:var(--wk-positive)">Saved</span>
      <div data-wk-mode="light">
        <wk-button id="light-danger" variant="primary" intent="danger">Delete</wk-button>
        <span id="light-success" style="color:var(--wk-positive)">Saved</span>
      </div>
    </div>`);
  expect(appearance(fixture, 'dark-danger').slice(0, 2)).toEqual([
    'rgb(255, 158, 158)',
    'rgb(42, 10, 10)',
  ]);
  expect(appearance(fixture, 'light-danger').slice(0, 2)).toEqual([
    'rgb(160, 34, 34)',
    'rgb(255, 255, 255)',
  ]);
  expect(getComputedStyle(fixture.querySelector('#dark-success')!).color).toBe(
    'rgb(130, 213, 165)',
  );
  expect(getComputedStyle(fixture.querySelector('#light-success')!).color).toBe('rgb(23, 98, 60)');
});

test('mode-only scopes preserve inherited custom radius and explicit public overrides win', async () => {
  const fixture = await mount(`
    <div data-wk-theme="studio" data-wk-mode="light" style="--wk-radius:24px">
      ${action('custom-radius')}
      <div data-wk-mode="dark">
        ${action('inherited-radius')}
        <div data-wk-mode="light" style="--wk-accent:#123456;--wk-on-accent:#fedcba">
          ${action('explicit-colors')}
        </div>
      </div>
    </div>`);
  expect(appearance(fixture, 'custom-radius')).toEqual([
    'rgb(73, 53, 163)',
    'rgb(255, 255, 255)',
    '24px',
  ]);
  expect(appearance(fixture, 'inherited-radius')).toEqual([
    'rgb(196, 182, 255)',
    'rgb(32, 20, 67)',
    '24px',
  ]);
  expect(appearance(fixture, 'explicit-colors')).toEqual([
    'rgb(18, 52, 86)',
    'rgb(254, 220, 186)',
    '24px',
  ]);
});
