import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const browser = (name: string) => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [{ browser: 'chromium' as const, name }],
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
        test: { name: 'stories', browser: browser('stories-chromium') },
      },
      {
        optimizeDeps,
        test: {
          name: 'package',
          include: ['test/**/*.browser.test.ts'],
          browser: browser('package-chromium'),
        },
      },
    ],
  },
});
