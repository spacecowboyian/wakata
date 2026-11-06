import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../storybook-static/', import.meta.url));
const review = fileURLToPath(new URL('../review/tabs/', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = createServer(async (request, response) => {
  const path = resolve(root, `.${new URL(request.url, 'http://localhost').pathname}`);
  if (!path.startsWith(root.endsWith(sep) ? root : `${root}${sep}`)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(path);
    response
      .writeHead(200, {
        'Content-Type': types[path.slice(path.lastIndexOf('.'))] ?? 'application/octet-stream',
      })
      .end(body);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' ? 404 : 500).end();
  }
});

await mkdir(review, { recursive: true });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const [story, mode] of [
    ['default', 'light'],
    ['default', 'dark'],
    ['alternate-selection', 'light'],
    ['long-content-narrow', 'light'],
    ['themes-modes-wireframe', 'light'],
    ['nested-scope', 'light'],
  ]) {
    const id = `components-tabs--${story}`;
    await page.goto(
      `${base}/iframe.html?id=${id}&viewMode=story&globals=theme:neutral;mode:${mode};wireframe:off`,
    );
    const tabs = page.locator('#storybook-root wk-tabs').first();
    await tabs.waitFor();
    await page.waitForFunction(() => {
      const tabs = document.querySelector('#storybook-root wk-tabs');
      return Boolean(tabs?.shadowRoot?.querySelector('[role=tablist]'));
    });
    await page.evaluate(() => document.fonts.ready);
    const state = await tabs.evaluate((el) => ({
      selected: el.querySelectorAll('wk-tab[aria-selected=true]').length,
      visiblePanels: [...el.querySelectorAll('wk-tab-panel')].filter((panel) => !panel.hidden)
        .length,
    }));
    assert.equal(state.selected, 1, `${id}: one selected tab`);
    assert.equal(state.visiblePanels, 1, `${id}: one visible panel`);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
      true,
      `${id}: no horizontal overflow`,
    );
    assert.deepEqual(errors, [], `${id}: no page errors`);
    await page
      .locator('#storybook-root')
      .screenshot({ path: resolve(review, `${story}-phone-${mode}.png`), animations: 'disabled' });
  }
  await page.goto(`${base}/iframe.html?id=components-tabs--default&viewMode=story`);
  const tabs = page.locator('#storybook-root wk-tabs').first();
  await tabs.locator('wk-tab').first().waitFor();
  await tabs.locator('wk-tab').first().focus();
  await page.keyboard.press('ArrowRight');
  assert.equal(await tabs.evaluate((el) => el.value), 'overview', 'arrow focus does not select');
  assert.equal(
    await tabs.locator('wk-tab[value=inspection]').evaluate((el) => el === document.activeElement),
    true,
    'arrow moves tab focus',
  );
  await page.keyboard.press('Enter');
  assert.equal(await tabs.evaluate((el) => el.value), 'inspection', 'Enter activates');
  await page.setViewportSize({ width: 320, height: 640 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => {
    document.documentElement.style.zoom = '2';
  });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
    true,
    '320px viewport with CSS zoom 2 has no horizontal overflow',
  );
  const targets = await tabs.locator('wk-tab').evaluateAll((items) =>
    items.map((item) => ({
      width: item.getBoundingClientRect().width,
      height: item.getBoundingClientRect().height,
    })),
  );
  for (const target of targets) {
    assert.ok(target.width >= 44 && target.height >= 44, 'tab target at least 44 CSS px');
  }
  console.log(
    'PASS Tabs Storybook: six phone states, manual activation, narrow CSS zoom 2/reduced motion, no overflow/errors.',
  );
} finally {
  await browser?.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
