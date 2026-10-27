import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../storybook-static/', import.meta.url));
const review = fileURLToPath(new URL('../review/dialog/', import.meta.url));
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

  const openReview = async (mode, width, height) => {
    await page.setViewportSize({ width, height });
    await page.goto(`${base}/iframe.html?id=components-dialog--review-dialog&viewMode=story`);
    await page.waitForFunction(() =>
      Boolean(
        customElements.get('wk-dialog') && document.querySelector('#storybook-root wk-dialog'),
      ),
    );
    await page.waitForFunction(
      () =>
        document.querySelector('#storybook-root wk-dialog')?.dataset.reviewPlayComplete === 'true',
    );
    await page.evaluate(async (resolvedMode) => {
      const origin = document.querySelector('[data-review-origin]');
      const dialog = document.querySelector('wk-dialog');
      delete dialog.dataset.reviewPlayComplete;
      origin.dataset.wkMode = resolvedMode;
      origin.dataset.wkWireframe = 'false';
      origin.dataset.wkTheme = 'studio';
      origin.style.removeProperty('--wk-font');
      if (!dialog.opened) await dialog.open();
      await document.fonts.ready;
    }, mode);
    await page.waitForFunction(() => {
      const content = document.querySelector('[data-wk-dialog-content]');
      return content?.getAttribute('aria-modal') === 'true';
    });
    const measures = await page.evaluate(() => {
      const content = document.querySelector('[data-wk-dialog-content]');
      return {
        role: content.getAttribute('role'),
        labelledby: content.getAttribute('aria-labelledby'),
        describedby: content.getAttribute('aria-describedby'),
        width: content.getBoundingClientRect().width,
        fontFamily: getComputedStyle(content).fontFamily,
        originFont: getComputedStyle(document.querySelector('[data-review-origin]'))
          .getPropertyValue('--wk-font')
          .trim(),
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        nativeModal: document
          .querySelector('wk-dialog')
          .shadowRoot.querySelector('dialog[data-overlay-outer-wrapper]')
          .matches(':modal'),
        scrollLocked: document.body.classList.contains('overlays-scroll-lock'),
      };
    });
    assert.equal(measures.role, 'dialog');
    assert.equal(measures.originFont, 'Georgia, serif');
    assert.equal(measures.fontFamily, 'Georgia, serif');
    assert.equal(measures.labelledby, 'review-dialog-title');
    assert.equal(measures.describedby, 'review-dialog-description');
    assert.equal(measures.nativeModal, true);
    assert.equal(measures.scrollLocked, true);
    assert.equal(measures.scrollWidth <= measures.clientWidth, true);
    assert.equal(measures.width <= width, true);
  };
  const capture = async (mode, width, height, filename) => {
    await openReview(mode, width, height);
    await page.screenshot({ path: resolve(review, filename), animations: 'disabled' });
  };

  await capture('light', 1440, 1000, 'review-desktop-light.png');
  await capture('dark', 1440, 1000, 'review-desktop-dark.png');
  await capture('light', 390, 844, 'review-phone-light.png');
  await capture('dark', 390, 844, 'review-phone-dark.png');

  await openReview('light', 960, 720);
  await page.addStyleTag({
    content: `
      @media (prefers-color-scheme: light) {
        [data-review-origin] { --wk-accent: rgb(17, 34, 51) !important; }
      }
      @media (prefers-color-scheme: dark) {
        [data-review-origin] { --wk-accent: rgb(51, 34, 17) !important; }
      }
    `,
  });
  await page.evaluate(() => {
    let node = document.querySelector('[data-review-origin]');
    while (node && node !== document.body) {
      node.removeAttribute('data-wk-mode');
      node = node.parentElement;
    }
  });
  await page.emulateMedia({ colorScheme: 'light' });
  const lightAccent = await page
    .locator('[data-wk-dialog-content]')
    .evaluate((node) => getComputedStyle(node).getPropertyValue('--wk-accent').trim());
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForFunction(
    () =>
      getComputedStyle(document.querySelector('[data-wk-dialog-content]'))
        .getPropertyValue('--wk-accent')
        .trim() === 'rgb(51, 34, 17)',
  );
  const darkAccent = await page
    .locator('[data-wk-dialog-content]')
    .evaluate((node) => getComputedStyle(node).getPropertyValue('--wk-accent').trim());
  assert.equal(lightAccent, 'rgb(17, 34, 51)');
  assert.equal(darkAccent, 'rgb(51, 34, 17)');
  assert.deepEqual(errors, [], 'no browser errors');
  console.log(
    'PASS Dialog Storybook: modal state, System token refresh, overflow and desktop/phone light/dark screenshots (Chromium).',
  );
} finally {
  await browser?.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
