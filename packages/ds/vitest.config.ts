import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

// WK_BROWSER=firefox|webkit reruns the suites in that engine; default stays chromium.
const requested = (globalThis as { process?: { env: Record<string, string | undefined> } }).process
  ?.env.WK_BROWSER;
type Engine = 'chromium' | 'firefox' | 'webkit';
const engine: Engine = (['firefox', 'webkit'] as const).find((b) => b === requested) ?? 'chromium';

const browser = (name: string) => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [{ browser: engine, name: `${name}-${engine}` }],
});

// Pre-bundle Lion entries up front so Vite does not reload a running browser test.
const optimizeDeps = {
  include: [
    '@lion/ui/button.js',
    '@lion/ui/dialog.js',
    '@lion/ui/fieldset.js',
    '@lion/ui/form-core.js',
    '@lion/ui/form.js',
    '@lion/ui/input.js',
    '@lion/ui/select.js',
  ],
};

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        optimizeDeps,
        plugins: [storybookTest({ configDir: new URL('./.storybook', import.meta.url).pathname })],
        test: { name: 'stories', browser: browser('stories') },
      },
      {
        optimizeDeps,
        test: {
          name: 'package',
          include: ['test/**/*.browser.test.ts'],
          browser: browser('package'),
          // CDP emulation is Chromium-only.
          exclude: engine === 'chromium' ? [] : ['test/**/*.chromium.browser.test.ts'],
        },
      },
    ],
  },
});
