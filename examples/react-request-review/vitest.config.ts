import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

const requested = (globalThis as { process?: { env: Record<string, string | undefined> } }).process
  ?.env.WK_BROWSER;
const browser = (['firefox', 'webkit'] as const).find((name) => name === requested) ?? 'chromium';

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
      instances: [{ browser, name: `react-${browser}` }],
    },
  },
});
