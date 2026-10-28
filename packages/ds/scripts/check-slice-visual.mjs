import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const repo = fileURLToPath(new URL('../../../', import.meta.url));
const review = resolve(repo, 'packages/ds/review/slice');
const hosts = [
  { name: 'html', root: resolve(repo, 'packages/ds'), path: '/examples/request-review.html' },
  { name: 'react', root: resolve(repo, 'examples/react-request-review'), path: '/' },
  { name: 'angular', root: resolve(repo, 'examples/angular-request-review'), path: '/' },
];

await mkdir(review, { recursive: true });
const browser = await chromium.launch();
const geometries = [];
try {
  for (const host of hosts) {
    const server = await createServer({
      root: host.root,
      logLevel: 'silent',
      server: { host: '127.0.0.1', port: 0 },
    });
    try {
      await server.listen();
      const port = server.httpServer.address().port;
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      try {
        const errors = [];
        page.on('pageerror', (error) => errors.push(error.message));
        await page.goto(`http://127.0.0.1:${port}${host.path}`);
        await page.locator('main wk-card').waitFor();
        await page.waitForFunction(() =>
          ['wk-card', 'wk-text-field', 'wk-select', 'wk-dialog'].every(
            (tag) => document.querySelector(tag)?.shadowRoot,
          ),
        );
        await page.evaluate(() => document.fonts.ready);

        for (const [size, width, height] of [
          ['phone', 390, 844],
          ['desktop', 1280, 900],
        ]) {
          await page.setViewportSize({ width, height });
          for (const mode of ['light', 'dark']) {
            await page.evaluate(() => {
              document.documentElement.dataset.wkTheme = 'neutral';
            });
            await page.locator('wk-mode-switch').evaluate(async (switcher, nextMode) => {
              switcher.mode = nextMode;
              await switcher.updateComplete;
            }, mode);
            assert.equal(
              await page
                .locator('wk-mode-switch')
                .evaluate(
                  (switcher) =>
                    switcher.shadowRoot.querySelector(`input[value="${switcher.mode}"]`).checked,
                ),
              true,
              `${host.name} ${mode}: mode control reflects the displayed mode`,
            );
            assert.equal(
              await page.evaluate(
                () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
              ),
              true,
              `${host.name} ${size} ${mode}: no horizontal overflow`,
            );
            await page.locator('main').screenshot({
              path: resolve(review, `${host.name}-${size}-${mode}.png`),
              animations: 'disabled',
            });
            if (size === 'phone' && mode === 'light') {
              geometries.push({
                host: host.name,
                ...(await page.evaluate(() => {
                  const rect = (selector) => {
                    const box = document.querySelector(selector).getBoundingClientRect();
                    return { x: box.x, y: box.y, width: box.width, height: box.height };
                  };
                  return {
                    card: rect('wk-card'),
                    input: rect('#rr-name input'),
                    select: rect('#rr-destination select'),
                    submit: rect('#rr-submit'),
                  };
                })),
              });
              for (const part of ['input', 'select', 'submit']) {
                assert.ok(
                  geometries.at(-1)[part].height >= 44,
                  `${host.name} ${part}: at least 44 px tall`,
                );
              }
            }
          }
        }

        await page.setViewportSize({ width: 320, height: 700 });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
          ),
          true,
          `${host.name}: no horizontal overflow at 320 px`,
        );
        await page.setViewportSize({ width: 640, height: 900 });
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.locator('wk-mode-switch').evaluate(async (switcher) => {
          switcher.mode = 'light';
          await switcher.updateComplete;
        });
        await page.evaluate(() => {
          document.body.style.zoom = '2';
        });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
          ),
          true,
          `${host.name}: no horizontal overflow at 640 px with CSS zoom 2 (320 px effective width)`,
        );
        assert.equal(
          await page
            .locator('#rr-submit')
            .evaluate((button) => getComputedStyle(button).transitionDuration),
          '0s',
          `${host.name}: reduced-motion transition`,
        );
        await page.locator('main').screenshot({
          path: resolve(review, `${host.name}-narrow-zoom2.png`),
          animations: 'disabled',
        });
        await page.evaluate(() => {
          document.body.style.zoom = '';
        });
        await page.setViewportSize({ width: 320, height: 568 });
        const longName =
          'Avery Alexandria Example '.repeat(16) + 'Supercalifragilisticexpialidocious';
        await page.locator('#rr-name input').fill(longName);
        await page.locator('#rr-destination select').selectOption('oslo');
        await page.locator('#rr-submit').click();
        await page.waitForFunction(() => document.querySelector('wk-dialog')?.opened === true);
        await page.waitForFunction(() =>
          document
            .querySelector('#rr-summary')
            ?.textContent?.includes('Supercalifragilisticexpialidocious'),
        );
        const longContent = await page.evaluate(() => {
          const panel = document.querySelector('[data-wk-dialog-content]');
          const box = panel.getBoundingClientRect();
          return {
            left: box.left,
            right: box.right,
            top: box.top,
            bottom: box.bottom,
            pageWidth: document.documentElement.scrollWidth,
            panelScrollHeight: panel.scrollHeight,
            panelClientHeight: panel.clientHeight,
            summary: panel.querySelector('#rr-summary')?.textContent,
          };
        });
        assert.ok(
          longContent.summary?.includes('Supercalifragilisticexpialidocious'),
          `${host.name}: expected long name in dialog, got ${JSON.stringify(longContent.summary)}`,
        );
        assert.ok(longContent.left >= 0 && longContent.right <= 320);
        assert.ok(longContent.top >= 0 && longContent.bottom <= 568);
        assert.ok(
          longContent.pageWidth <= 320,
          `${host.name}: long content has no horizontal overflow`,
        );
        assert.ok(
          longContent.panelScrollHeight > longContent.panelClientHeight,
          `${host.name}: long dialog content scrolls within the panel`,
        );
        await page.locator('[data-wk-dialog-content]').screenshot({
          path: resolve(review, `${host.name}-long-content-phone.png`),
          animations: 'disabled',
        });
        await page.locator('#rr-confirm').scrollIntoViewIfNeeded();
        const actionVisible = await page.locator('#rr-confirm').evaluate((button) => {
          const buttonBox = button.getBoundingClientRect();
          const panelBox = document
            .querySelector('[data-wk-dialog-content]')
            .getBoundingClientRect();
          return buttonBox.top >= panelBox.top && buttonBox.bottom <= panelBox.bottom;
        });
        assert.ok(actionVisible, `${host.name}: final action is reachable by panel scrolling`);
        await page.locator('[data-wk-dialog-content]').screenshot({
          path: resolve(review, `${host.name}-long-content-actions-phone.png`),
          animations: 'disabled',
        });
        assert.deepEqual(errors, [], `${host.name}: no browser errors`);
        console.log(
          `PASS ${host.name}: phone/desktop light/dark, narrow CSS zoom, reduced motion and long content`,
        );
      } finally {
        await page.close();
      }
    } finally {
      await server.close();
    }
  }
} finally {
  await browser.close();
}

const baseline = geometries[0];
for (const geometry of geometries.slice(1)) {
  for (const part of ['card', 'input', 'select', 'submit']) {
    for (const dimension of ['x', 'y', 'width', 'height']) {
      assert.ok(
        Math.abs(geometry[part][dimension] - baseline[part][dimension]) <= 1,
        `${geometry.host} ${part}.${dimension} matches HTML within 1 px`,
      );
    }
  }
}
console.log('PASS HTML/React/Angular phone geometry matches within 1 px');
