import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

const requested = (globalThis as { process?: { env: Record<string, string | undefined> } }).process
  ?.env.WK_BROWSER;
const browser = (['firefox', 'webkit'] as const).find((name) => name === requested) ?? 'chromium';

export default defineConfig({
  optimizeDeps: {
    include: [
      '@lion/ui/button.js',
      '@lion/ui/dialog.js',
      '@lion/ui/fieldset.js',
      '@lion/ui/form-core.js',
      '@lion/ui/form.js',
      '@lion/ui/input.js',
      '@lion/ui/select.js',
    ],
  },
  test: {
    include: ['test/**/*.browser.test.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser, name: `angular-${browser}` }],
    },
  },
});
