import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../storybook-static/', import.meta.url));
const prefixes = ['/wakata/', '/wakata/pr/38/'];
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const prefix = [...prefixes].reverse().find((prefix) => pathname.startsWith(prefix));
  if (!prefix) return void response.writeHead(404).end();
  const path = resolve(root, pathname.slice(prefix.length) || 'index.html');
  if (!path.startsWith(root.endsWith(sep) ? root : `${root}${sep}`)) {
    return void response.writeHead(403).end();
  }
  try {
    const body = await readFile(path);
    response
      .writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' })
      .end(body);
  } catch (error) {
    if (error.code !== 'ENOENT') console.error(error);
    response.writeHead(error.code === 'ENOENT' ? 404 : 500).end();
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch();
  const origin = `http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(`${origin}/index.html`)).status, 404, 'No root fallback');
  for (const prefix of prefixes) {
    const page = await browser.newPage();
    const failures = [];
    const assets = new Set();
    page.on('pageerror', (error) => failures.push(error.message));
    page.on('requestfailed', (request) => failures.push(`Failed request: ${request.url()}`));
    page.on('response', (response) => {
      const url = new URL(response.url());
      if (url.origin !== origin) return;
      if (response.status() >= 400) failures.push(`${response.status()} ${url.pathname}`);
      if (/\.(js|css|woff2)$/.test(url.pathname)) {
        assets.add(url.pathname);
        assert.ok(url.pathname.startsWith(prefix), `Asset escaped mount: ${url.pathname}`);
      }
    });
    const base = `${origin}${prefix}`;
    await page.goto(base);
    await page.locator('#storybook-preview-iframe').waitFor();
    await page.waitForLoadState('networkidle');
    await page.goto(`${base}?path=/story/components-button--playground`);
    const frame = page.frameLocator('#storybook-preview-iframe');
    await frame.locator('#storybook-root wk-button').first().waitFor();
    await page.locator('a[href*="/story/components-button--variants"]').first().click();
    await page.waitForURL(`${base}?path=/story/components-button--variants`);
    await frame.locator('#storybook-root wk-button').first().waitFor();
    assert.equal(
      new URL(await page.locator('#storybook-preview-iframe').getAttribute('src'), page.url())
        .pathname,
      `${prefix}iframe.html`,
      'Storybook iframe stays within its mount path',
    );
    await page.reload();
    await frame.locator('#storybook-root wk-button').first().waitFor();
    await page.goto(`${base}iframe.html?id=components-button--playground&viewMode=story`);
    await page.locator('#storybook-root wk-button').first().waitFor();
    assert.ok(assets.size > 5, 'Loaded real manager/preview assets');
    assert.deepEqual(failures, [], `${prefix}: browser/network failures`);
    console.log(`PASS ${prefix}: ${assets.size} assets, sidebar navigation, reload, direct iframe`);
    await page.close();
  }
} finally {
  await browser?.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
