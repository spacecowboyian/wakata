import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const server = await createServer({
  root,
  server: { host: '127.0.0.1', port: 0 },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const url = `${server.resolvedUrls.local[0]}examples/mode-switch.html`;
  const key = 'wakata:color-mode:v1';
  const load = async (target = page) => {
    await target.goto(url);
    await target.locator('wk-mode-switch input').first().waitFor();
    await target
      .locator('wk-mode-switch')
      .first()
      .evaluate((element) => element.updateComplete);
  };
  const rootMode = () => page.locator('html').getAttribute('data-wk-mode');
  await page.emulateMedia({ colorScheme: 'light' });
  await load();
  assert.equal(await rootMode(), 'light');
  await page.getByRole('radio', { name: 'Dark', exact: true }).first().check();
  assert.equal(await rootMode(), 'dark');
  assert.equal(await page.evaluate((key) => localStorage.getItem(key), key), 'dark');
  await load();
  assert.equal(await rootMode(), 'dark', 'reload restores persisted choice');
  assert.deepEqual(
    await page.locator('wk-mode-switch').evaluateAll((elements) => elements.map((el) => el.mode)),
    ['dark', 'dark', 'dark'],
  );
  await page.evaluate(() => {
    window.modeEvents = [];
    document.addEventListener('wk-mode-change', (event) => window.modeEvents.push(event.detail));
  });
  await page.getByRole('radio', { name: 'System', exact: true }).first().check();
  assert.equal(await page.evaluate((key) => localStorage.getItem(key), key), null);
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForFunction(() => document.documentElement.dataset.wkMode === 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.waitForFunction(() => document.documentElement.dataset.wkMode === 'light');
  assert.deepEqual(await page.evaluate(() => window.modeEvents), [
    { mode: 'system', resolvedMode: 'light' },
  ]);
  await page.evaluate(() => {
    document.querySelector('wk-mode-switch').mode = 'dark';
  });
  assert.equal(await page.evaluate(() => window.modeEvents.length), 1);
  assert.equal(
    await page
      .locator('[data-wk-theme="fieldwork"]')
      .evaluate((element) => ({
        mode: element.dataset.wkMode,
        background: getComputedStyle(element).backgroundColor,
      }))
      .then(({ mode, background }) => mode === 'light' && background === 'rgb(255, 255, 255)'),
    true,
  );

  if (process.argv.includes('--screenshots')) {
    const directory = new URL('../review/mode-switch/', import.meta.url);
    await mkdir(directory, { recursive: true });
    for (const mode of ['light', 'dark']) {
      await page
        .getByRole('radio', { name: mode === 'light' ? 'Light' : 'Dark', exact: true })
        .first()
        .check();
      await page.screenshot({
        path: fileURLToPath(new URL(`${mode}-375.png`, directory)),
        fullPage: true,
      });
    }
    await page.setViewportSize({ width: 280, height: 667 });
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      true,
      'example fits 280px',
    );
    await page.screenshot({
      path: fileURLToPath(new URL('narrow-280.png', directory)),
      fullPage: true,
    });
  }

  const blocked = await browser.newPage();
  const warnings = [];
  blocked.on('pageerror', (error) => errors.push(error.message));
  blocked.on('console', (message) => {
    if (message.type() === 'warning') warnings.push(message.text());
  });
  await blocked.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Storage blocked for fixture', 'SecurityError');
      },
    });
  });
  await blocked.emulateMedia({ colorScheme: 'light' });
  await load(blocked);
  assert.equal(await blocked.locator('html').getAttribute('data-wk-mode'), 'light');
  await blocked.getByRole('radio', { name: 'Dark', exact: true }).first().check();
  assert.deepEqual(
    await blocked
      .locator('wk-mode-switch')
      .evaluateAll((elements) => elements.map((el) => el.mode)),
    ['dark', 'dark', 'dark'],
  );
  await blocked.getByRole('radio', { name: 'System', exact: true }).first().check();
  assert.equal(await blocked.locator('html').getAttribute('data-wk-mode'), 'light');
  assert.equal(warnings.filter((message) => message.includes('storage unavailable')).length, 3);
  assert.deepEqual(errors, []);
  console.log(
    'PASS mode-switch HTML: reload, live System, shared state, local override, event silence and blocked storage (Chromium).',
  );
} finally {
  await browser?.close();
  await server.close();
}
