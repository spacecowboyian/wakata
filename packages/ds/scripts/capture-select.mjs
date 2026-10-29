import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const origin = process.env.WK_STORYBOOK_URL ?? 'http://127.0.0.1:6010';
const output = resolve('review/select');
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [story, filename, width] of [
    ['empty', 'empty.png', 390],
    ['selected', 'selected.png', 390],
    ['required-invalid', 'required-invalid.png', 390],
    ['help-and-external-error', 'help-and-external-error.png', 390],
    ['disabled', 'disabled.png', 390],
    ['long-content', 'long-content-280.png', 320],
    ['themes-modes-and-wireframe', 'themes-modes-wireframe.png', 1000],
  ]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
    await page.goto(`${origin}/iframe.html?id=components-select--${story}&viewMode=story`);
    await page.locator('wk-select select').first().waitFor();
    await page.waitForFunction(
      () => getComputedStyle(document.querySelector('wk-select select')).appearance === 'none',
    );
    await page.evaluate(() => document.fonts.ready);
    if (story === 'required-invalid') {
      await page.locator('wk-select select').first().waitFor({ state: 'visible' });
      await page.waitForFunction(
        () => document.querySelector('wk-select select')?.getAttribute('aria-invalid') === 'true',
      );
    }
    await page.locator('#storybook-root').screenshot({ path: resolve(output, filename) });
    if (story === 'themes-modes-and-wireframe') {
      const dark = page.locator(
        '[data-wk-theme=studio][data-wk-mode=dark][data-wk-wireframe=false]',
      );
      await dark.screenshot({ path: resolve(output, 'studio-dark-after.png') });
      await dark.locator('select').focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      await dark.screenshot({ path: resolve(output, 'studio-dark-focused.png') });
      await dark.locator('select').click();
      if (await dark.locator('select').evaluate((select) => select.matches(':open'))) {
        await dark.screenshot({ path: resolve(output, 'studio-dark-open.png') });
      }
      await page.keyboard.press('Escape');
      await dark.locator('select').evaluate((select) => select.blur());
      await page.setViewportSize({ width: 320, height: 900 });
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) {
        throw new Error('Themes story overflows 320px viewport');
      }
      await page
        .locator('#storybook-root')
        .screenshot({ path: resolve(output, 'themes-modes-phone.png') });
    }
    if (story === 'empty') {
      const closedArrow = await page
        .locator('wk-select select')
        .evaluate((select) => getComputedStyle(select).backgroundImage);
      await page.keyboard.press('Tab');
      await page.locator('#storybook-root').screenshot({ path: resolve(output, 'focused.png') });
      await page.locator('wk-select select').click();
      if (await page.locator('wk-select select').evaluate((select) => select.matches(':open'))) {
        const openArrow = await page
          .locator('wk-select select')
          .evaluate((select) => getComputedStyle(select).backgroundImage);
        if (openArrow === closedArrow)
          throw new Error('Open native picker did not turn the chevron upward');
        await page.locator('#storybook-root').screenshot({ path: resolve(output, 'open.png') });
      }
    }
    if (story === 'long-content') {
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      if (overflow) throw new Error('Long-content story overflows 320px viewport');
      await page.locator('wk-select select').selectOption('long');
      await page
        .locator('#storybook-root')
        .screenshot({ path: resolve(output, 'long-selected-280.png') });
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) {
        throw new Error('Selected long option overflows 320px viewport');
      }
    }
    await page.close();
  }
  for (const [story, filename] of [
    ['selected', 'selected-studio-dark.png'],
    ['help-and-external-error', 'help-and-external-error-studio-dark.png'],
  ]) {
    const page = await browser.newPage({
      viewport: { width: 390, height: 900 },
      deviceScaleFactor: 2,
    });
    await page.goto(
      `${origin}/iframe.html?id=components-select--${story}&viewMode=story&globals=theme:studio;mode:dark`,
    );
    await page.locator('wk-select select').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#storybook-root').screenshot({ path: resolve(output, filename) });
    await page.close();
  }
  const forced = await browser.newPage({
    viewport: { width: 390, height: 600 },
    deviceScaleFactor: 2,
    forcedColors: 'active',
  });
  await forced.goto(`${origin}/iframe.html?id=components-select--empty&viewMode=story`);
  await forced.locator('wk-select select').waitFor();
  await forced.waitForFunction(
    () => getComputedStyle(document.querySelector('wk-select select')).appearance === 'auto',
  );
  await forced
    .locator('#storybook-root')
    .screenshot({ path: resolve(output, 'forced-colors.png') });
  await forced.close();
} finally {
  await browser.close();
}
