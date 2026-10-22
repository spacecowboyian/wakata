import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

const browser = (name: string) => ({
  enabled: true,
  headless: true,
  provider: playwright(),
  instances: [{ browser: 'chromium' as const, name }],
});

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: new URL('./.storybook', import.meta.url).pathname })],
        test: { name: 'stories', browser: browser('stories-chromium') },
      },
      {
        test: {
          name: 'package',
          include: ['test/**/*.browser.test.ts'],
          browser: browser('package-chromium'),
        },
      },
    ],
  },
});
