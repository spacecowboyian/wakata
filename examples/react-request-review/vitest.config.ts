import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  optimizeDeps: {
    include: [
      'react',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-dom/test-utils',
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
    include: ['test/**/*.browser.test.tsx'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium', name: 'react-chromium' }],
    },
  },
});
