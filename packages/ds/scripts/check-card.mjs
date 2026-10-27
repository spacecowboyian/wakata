import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../storybook-static/', import.meta.url));
const review = fileURLToPath(new URL('../review/card/', import.meta.url));
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
    if (error.code !== 'ENOENT') console.error(error);
    response.writeHead(error.code === 'ENOENT' ? 404 : 500).end();
  }
});

await mkdir(review, { recursive: true });
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const base = `http://127.0.0.1:${server.address().port}`;

  const openStory = async (id, mode, width, height) => {
    await page.setViewportSize({ width, height });
    await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`);
    await page.locator('#storybook-root wk-card').first().waitFor();
    await page.waitForFunction(() => {
      const card = document.querySelector('#storybook-root wk-card');
      return Boolean(
        card && customElements.get('wk-card') && card.shadowRoot?.querySelector('.sections'),
      );
    });
    await page
      .locator('#storybook-root [data-wk-theme]')
      .first()
      .evaluate((root, resolvedMode) => {
        root.dataset.wkTheme = 'neutral';
        root.dataset.wkMode = resolvedMode;
        root.dataset.wkWireframe = 'false';
        root.style.background = resolvedMode === 'dark' ? '#171717' : '#fff';
        root.style.color = resolvedMode === 'dark' ? '#efefec' : '#222';
      }, mode);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
      true,
      `${id} at ${width}px has no horizontal page overflow`,
    );
    const card = page.locator('#storybook-root wk-card').first();
    assert.equal(
      await card.evaluate((element) => element.scrollWidth <= element.clientWidth),
      true,
      `${id} Card overflow`,
    );
    return card;
  };
  const capture = async (story, mode, width, height, filename) => {
    await openStory(`components-card--${story}`, mode, width, height);
    await page
      .locator('#storybook-root')
      .screenshot({ path: resolve(review, filename), animations: 'disabled' });
  };

  for (const mode of ['light', 'dark']) {
    await capture('composition-current-slice', mode, 1440, 1000, `composition-desktop-${mode}.png`);
    await capture('composition-current-slice', mode, 390, 844, `composition-phone-${mode}.png`);
  }
  await capture('body-only', 'light', 960, 720, 'body-only.png');
  await capture('heading-and-body', 'light', 960, 720, 'heading-body.png');
  await capture('actions', 'light', 960, 720, 'actions.png');
  await capture('long-content-and-narrow-reflow', 'dark', 390, 844, 'long-content-phone-dark.png');

  const card = await openStory('components-card--composition-current-slice', 'light', 390, 844);
  const measurements = await card.evaluate((element) => ({
    padding: getComputedStyle(element).padding,
    gap: getComputedStyle(element.shadowRoot.querySelector('.sections')).rowGap,
    sections: [...element.shadowRoot.querySelectorAll('.section')].filter(
      (section) => !section.hidden,
    ).length,
    width: element.clientWidth,
  }));
  assert.deepEqual(measurements, {
    padding: '16px',
    gap: '12px',
    sections: 3,
    width: measurements.width,
  });
  assert.equal(measurements.width <= 390, true);
  assert.deepEqual(errors, [], 'no browser errors');
  console.log(
    'PASS Card Storybook: desktop/phone light/dark composition, essential states, exact geometry and no overflow (Chromium).',
  );
} finally {
  await browser?.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
