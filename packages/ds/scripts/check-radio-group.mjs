import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../storybook-static/', import.meta.url));
const review = fileURLToPath(new URL('../review/radio-group/', import.meta.url));
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
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const [story, mode] of [
    ['selected', 'light'],
    ['selected', 'dark'],
    ['required-and-error', 'light'],
    ['long-content', 'light'],
    ['themes-modes-wireframe', 'light'],
    ['nested-scope', 'light'],
  ]) {
    const id = `components-radio-group--${story}`;
    await page.goto(
      `${base}/iframe.html?id=${id}&viewMode=story&globals=theme:neutral;mode:${mode};wireframe:off`,
    );
    const group = page.locator('#storybook-root wk-radio-group').first();
    await group.waitFor();
    await page.waitForFunction(() => {
      const group = document.querySelector('#storybook-root wk-radio-group');
      return Boolean(
        customElements.get('wk-radio-group') && group?.shadowRoot?.querySelector('.input-group'),
      );
    });
    await page.evaluate(() => document.fonts.ready);
    const metrics = await group.evaluate((el) => ({
      width: el.getBoundingClientRect().width,
      radios: el.querySelectorAll('input[type=radio]').length,
    }));
    assert.ok(metrics.radios >= 2, `${id}: options rendered`);
    if (story === 'selected') {
      assert.equal(
        await group
          .locator('wk-radio label[slot="label"]')
          .first()
          .evaluate((el) => getComputedStyle(el).cursor),
        'pointer',
        `${id}: option label text has pointer cursor`,
      );
    }
    assert.ok(metrics.width <= 390, `${id}: group fits phone viewport`);
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
  console.log(
    'PASS RadioGroup Storybook: selected/error/long/theme phone captures, upgraded radios, no overflow or page errors (Chromium).',
  );
} finally {
  await browser?.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
