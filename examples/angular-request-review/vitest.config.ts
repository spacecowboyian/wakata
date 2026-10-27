import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

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
      instances: [{ browser: 'chromium', name: 'angular-chromium' }],
    },
  },
});
