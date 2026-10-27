import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, sep } from 'node:path';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('../storybook-static/', import.meta.url));
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
};
const server = createServer(async (request, response) => {
  const path = resolve(root, `.${new URL(request.url, 'http://localhost').pathname}`);
  if (!path.startsWith(root.endsWith(sep) ? root : `${root}${sep}`)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(path);
    const extension = path.slice(path.lastIndexOf('.'));
    response
      .writeHead(200, { 'Content-Type': types[extension] ?? 'application/octet-stream' })
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
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const base = `http://127.0.0.1:${server.address().port}`;
  for (const state of ['selected', 'required-invalid', 'disabled', 'real-form']) {
    const story = `components-select--${state}`;
    await page.goto(`${base}/iframe.html?id=${story}&viewMode=story`);
    await page.locator('#storybook-root wk-select').waitFor();
    // Fail explicitly instead of hanging on a never-resolving whenDefined().
    const missing = await page.evaluate(() =>
      ['wk-select', 'wk-text-field', 'wk-button', 'wk-form'].filter(
        (tag) => !customElements.get(tag),
      ),
    );
    assert.deepEqual(missing, [], `${story}: undefined custom elements`);
    await page.waitForFunction(async () => {
      const field = document.querySelector('#storybook-root wk-select');
      await field.updateComplete;
      return Boolean(field.shadowRoot?.querySelector('.input-group__container'));
    });
    const select = page.locator('#storybook-root wk-select select');
    if (state === 'selected') {
      assert.equal(await select.inputValue(), 'bergen', `${story}: selected value`);
    } else if (state === 'required-invalid') {
      await page.waitForFunction(
        () =>
          document.querySelector('#storybook-root select')?.getAttribute('aria-invalid') === 'true',
      );
      assert.equal(
        await select.evaluate((node) => node.required && node.validity.valueMissing),
        true,
      );
      assert.equal(
        await page.locator('wk-select').evaluate((field) => field.hasFeedbackFor.includes('error')),
        true,
      );
    } else if (state === 'disabled') {
      assert.equal(await select.isDisabled(), true, `${story}: disabled control`);
      assert.equal(await select.inputValue(), 'oslo', `${story}: disabled value`);
    } else {
      assert.equal(
        await page.locator('wk-form').evaluate((field) => Boolean(field.shadowRoot)),
        true,
      );
      assert.equal(
        await page.locator('wk-button-submit').evaluate((button) => Boolean(button.shadowRoot)),
        true,
      );
    }
    assert.deepEqual(errors, [], `${story}: browser errors`);
    console.log(`PASS ${story}: upgraded components at 375px`);
  }
  for (const state of ['system', 'light', 'dark', 'shared-choice', 'narrow']) {
    const story = `supporting-mode-switch--${state}`;
    await page.goto(`${base}/iframe.html?id=${story}&viewMode=story`);
    const element = page.locator('#storybook-root wk-mode-switch').first();
    await element.waitFor();
    await page.waitForFunction(() => {
      const element = document.querySelector('#storybook-root wk-mode-switch');
      return Boolean(
        customElements.get('wk-mode-switch') && element?.shadowRoot?.querySelector('fieldset'),
      );
    });
    const expected = state === 'shared-choice' ? 'dark' : state === 'narrow' ? 'system' : state;
    await page.waitForFunction(
      (mode) =>
        [...document.querySelectorAll('#storybook-root wk-mode-switch')].every(
          (element) =>
            element.mode === mode &&
            element.shadowRoot.querySelector(`input[value="${mode}"]`).checked,
        ),
      expected,
    );
    assert.equal(await element.getAttribute('mode'), expected, `${story}: reflected mode`);
    assert.equal(
      await element.evaluate((element) => element.scrollWidth <= element.clientWidth),
      true,
      `${story}: no horizontal overflow`,
    );
    assert.deepEqual(errors, [], `${story}: browser errors`);
    console.log(`PASS ${story}: upgraded native group at 375px`);
  }
} finally {
  await browser?.close();
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
