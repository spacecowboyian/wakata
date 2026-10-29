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

  const openReview = async (mode, width, height, theme = 'fieldwork', wireframe = 'false') => {
    await page.setViewportSize({ width, height });
    await page.goto(
      `${base}/iframe.html?id=components-dialog--review-dialog&viewMode=story&globals=theme:${theme};mode:${mode}`,
    );
    await page.waitForFunction(() =>
      Boolean(
        customElements.get('wk-dialog') && document.querySelector('#storybook-root wk-dialog'),
      ),
    );
    await page.waitForFunction(
      () =>
        document.querySelector('#storybook-root wk-dialog')?.dataset.reviewPlayComplete === 'true',
    );
    await page.evaluate(
      async ([resolvedMode, resolvedTheme, resolvedWireframe]) => {
        const origin = document.querySelector('[data-review-origin]');
        const dialog = document.querySelector('wk-dialog');
        delete dialog.dataset.reviewPlayComplete;
        origin.dataset.wkMode = resolvedMode;
        origin.dataset.wkWireframe = resolvedWireframe;
        origin.dataset.wkTheme = resolvedTheme;
        origin.style.removeProperty('--wk-font');
        if (!dialog.opened) await dialog.open();
        await document.fonts.ready;
      },
      [mode, theme, wireframe],
    );
    await page.waitForFunction(() => {
      const content = document.querySelector('[data-wk-dialog-content]');
      return content?.getAttribute('aria-modal') === 'true';
    });
    await page.locator('[data-wk-dialog-content]').evaluate(async (content) => {
      await Promise.all(content.getAnimations().map((animation) => animation.finished));
    });
    const measures = await page.evaluate(() => {
      const content = document.querySelector('[data-wk-dialog-content]');
      return {
        role: content.getAttribute('role'),
        labelledby: content.getAttribute('aria-labelledby'),
        describedby: content.getAttribute('aria-describedby'),
        width: content.getBoundingClientRect().width,
        fontFamily: getComputedStyle(content).fontFamily,
        radius: getComputedStyle(content).borderTopLeftRadius,
        padding: getComputedStyle(content).padding,
        height: content.getBoundingClientRect().height,
        top: content.getBoundingClientRect().top,
        bottom: content.getBoundingClientRect().bottom,
        actions: [...content.querySelectorAll('wk-button')].map((button) => ({
          width: button.getBoundingClientRect().width,
          height: button.getBoundingClientRect().height,
        })),
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
    const font = {
      neutral: 'Arial, Helvetica, sans-serif',
      studio: 'Georgia, serif',
      fieldwork: 'Verdana, sans-serif',
    }[theme];
    assert.equal(measures.role, 'dialog');
    assert.equal(measures.originFont, font);
    assert.equal(measures.fontFamily, font);
    assert.equal(
      measures.radius,
      wireframe === 'true' ? '0px' : { neutral: '0px', studio: '16px', fieldwork: '8px' }[theme],
    );
    assert.equal(measures.labelledby, 'review-dialog-title');
    assert.equal(measures.describedby, 'review-dialog-description');
    assert.equal(measures.nativeModal, true);
    assert.equal(measures.scrollLocked, true);
    assert.equal(measures.scrollWidth <= measures.clientWidth, true);
    assert.equal(measures.width <= width, true);
    if (width <= 600) {
      assert.equal(Math.abs(measures.width - width) <= 1, true, 'mobile sheet spans the viewport');
      assert.equal(
        Math.abs(measures.height - (height - 40)) <= 1,
        true,
        'mobile sheet has fixed height',
      );
      assert.equal(Math.abs(measures.top - 40) <= 1, true, `mobile sheet top ${measures.top}`);
      assert.equal(Math.abs(measures.bottom - height) <= 1, true, 'mobile sheet meets bottom edge');
      assert.equal(measures.actions.length, 2);
      for (const action of measures.actions) {
        assert.equal(action.height >= 44, true, 'phone action target is at least 44px tall');
        assert.equal(action.width >= 44, true, 'phone action target is at least 44px wide');
      }
    }
    return measures;
  };
  const capture = async (mode, width, height, filename, theme = 'fieldwork') => {
    await openReview(mode, width, height, theme);
    await page.screenshot({ path: resolve(review, filename), animations: 'disabled' });
  };

  await capture('light', 1440, 1000, 'review-desktop-light.png');
  await capture('dark', 1440, 1000, 'review-desktop-dark.png');
  await capture('light', 390, 844, 'review-phone-light.png');
  await capture('dark', 390, 844, 'review-phone-dark.png');
  for (const theme of ['neutral', 'studio']) {
    for (const mode of ['light', 'dark']) {
      await capture(mode, 390, 844, `review-phone-${theme}-${mode}.png`, theme);
    }
  }

  const regular = await openReview('light', 390, 844);
  const wireframe = await openReview('light', 390, 844, 'fieldwork', 'true');
  assert.deepEqual(
    [wireframe.width, wireframe.height, wireframe.padding],
    [regular.width, regular.height, regular.padding],
    'wireframe keeps panel geometry',
  );

  const sheetGeometry = new Map();
  for (const [story, label] of [
    ['mobile-sheet-short', 'short'],
    ['long-content-and-narrow-reflow', 'long'],
  ]) {
    for (const mode of ['light', 'dark']) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(
        `${base}/iframe.html?id=components-dialog--${story}&viewMode=story&globals=mode:${mode}`,
      );
      await page.waitForFunction(
        (key) => document.querySelector('wk-dialog')?.dataset[key] === 'true',
        story === 'mobile-sheet-short' ? 'sheetPlayComplete' : 'longPlayComplete',
      );
      await page.locator('[data-wk-dialog-content]').evaluate(async (content) => {
        await Promise.all(content.getAnimations().map((animation) => animation.finished));
      });
      const geometry = await page.locator('[data-wk-dialog-content]').evaluate((content) => {
        const rect = content.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, width: rect.width };
      });
      assert.deepEqual(geometry, { top: 40, bottom: 844, width: 390 });
      assert.equal(await page.locator('wk-dialog').evaluate((dialog) => dialog.opened), true);
      sheetGeometry.set(`${label}-${mode}`, geometry);
      await page.screenshot({
        path: resolve(review, `sheet-${label}-phone-${mode}.png`),
        animations: 'disabled',
      });
      for (const y of [80, 400, 830]) {
        await page.mouse.click(2, y);
        assert.equal(await page.locator('wk-dialog').evaluate((dialog) => dialog.opened), true);
      }
      await page.evaluate(() => {
        window.__backgroundClicks = 0;
        document.querySelector('main').addEventListener('click', () => {
          window.__backgroundClicks += 1;
        });
      });
      await page.mouse.click(20, 20);
      await page.waitForFunction(() => document.querySelector('wk-dialog')?.opened === false);
      assert.equal(await page.evaluate(() => window.__backgroundClicks), 0);
      assert.equal(
        await page.evaluate(() => document.body.classList.contains('overlays-scroll-lock')),
        false,
      );
    }
  }
  assert.deepEqual(sheetGeometry.get('short-light'), sheetGeometry.get('long-light'));
  assert.deepEqual(sheetGeometry.get('short-dark'), sheetGeometry.get('long-dark'));

  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(
    `${base}/iframe.html?id=components-dialog--long-content-and-narrow-reflow&viewMode=story`,
  );
  await page.waitForFunction(
    () => document.querySelector('wk-dialog')?.dataset.longPlayComplete === 'true',
  );
  await page.locator('[data-wk-dialog-content]').evaluate(async (content) => {
    await Promise.all(content.getAnimations().map((animation) => animation.finished));
  });
  const narrow = await page.evaluate(() => {
    const content = document.querySelector('[data-wk-dialog-content]');
    const body = content.children[1];
    const header = content.children[0];
    const footer = content.children[2];
    const rect = content.getBoundingClientRect();
    return {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      pageWidth: document.documentElement.scrollWidth,
      bodyScrollHeight: body.scrollHeight,
      bodyClientHeight: body.clientHeight,
      headerTop: header.getBoundingClientRect().top,
      footerBottom: footer.getBoundingClientRect().bottom,
    };
  });
  assert.equal(narrow.left >= 0 && narrow.right <= 320, true);
  assert.equal(Math.abs(narrow.top - 40) <= 1 && Math.abs(narrow.bottom - 568) <= 1, true);
  assert.equal(narrow.bodyScrollHeight > narrow.bodyClientHeight, true);
  assert.equal(narrow.pageWidth <= 320, true);
  await page.screenshot({
    path: resolve(review, 'review-long-narrow.png'),
    animations: 'disabled',
  });
  await page.locator('#long-body').evaluate((body) => {
    body.scrollTop = body.scrollHeight;
  });
  const stationary = await page.evaluate(() => {
    const content = document.querySelector('[data-wk-dialog-content]');
    return {
      headerTop: content.children[0].getBoundingClientRect().top,
      footerBottom: content.children[2].getBoundingClientRect().bottom,
    };
  });
  assert.deepEqual(stationary, {
    headerTop: narrow.headerTop,
    footerBottom: narrow.footerBottom,
  });
  await page.screenshot({
    path: resolve(review, 'review-long-narrow-scrolled.png'),
    animations: 'disabled',
  });

  await page.setViewportSize({ width: 287, height: 225 });
  await page.goto(
    `${base}/iframe.html?id=components-dialog--long-content-and-narrow-reflow&viewMode=story`,
  );
  await page.waitForFunction(
    () => document.querySelector('wk-dialog')?.dataset.longPlayComplete === 'true',
  );
  assert.equal(
    await page
      .locator('[data-wk-dialog-content]')
      .evaluate((content) => content.getBoundingClientRect().top >= 40),
    true,
  );
  await page.mouse.click(20, 20);
  await page.waitForFunction(() => document.querySelector('wk-dialog')?.opened === false);

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
