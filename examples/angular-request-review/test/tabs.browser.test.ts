import '@angular/compiler';
import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createApplication } from '@angular/platform-browser';
import { createComponent, type ApplicationRef, type ComponentRef } from '@angular/core';
import { TabsDemoComponent } from '../src/tabs-demo.component';

const mounted: {
  app: ApplicationRef;
  ref: ComponentRef<TabsDemoComponent>;
  host: HTMLElement;
}[] = [];
const tick = async () => {
  await new Promise<void>((resolve) => setTimeout(resolve, 40));
  for (const item of mounted) item.ref.changeDetectorRef.detectChanges();
};
afterEach(() => {
  for (const { app, ref, host } of mounted.splice(0)) {
    ref.destroy();
    app.destroy();
    host.remove();
  }
});

test('Angular controls selected value while arrow focus alone leaves the panel unchanged', async () => {
  const host = document.createElement('div');
  const app = await createApplication();
  const ref = createComponent(TabsDemoComponent, {
    environmentInjector: app.injector,
    hostElement: host,
  });
  app.attachView(ref.hostView);
  mounted.push({ app, ref, host });
  ref.changeDetectorRef.detectChanges();
  document.body.append(host);
  await app.whenStable();
  await tick();
  const tabs = host.querySelector<HTMLElement & { value: string }>('wk-tabs')!;
  const body = tabs.querySelector<HTMLElement>('wk-tab[value=body]')!;
  const mechanical = tabs.querySelector<HTMLElement>('wk-tab[value=mechanical]')!;
  const records = tabs.querySelector<HTMLElement>('wk-tab[value=records]')!;
  expect(tabs.value).toBe('body');
  body.focus();
  await userEvent.keyboard('{ArrowRight}');
  expect(document.activeElement).toBe(mechanical);
  expect(tabs.value).toBe('body');
  await userEvent.keyboard('{Enter}');
  await tick();
  expect(tabs.value).toBe('mechanical');
  expect(ref.instance.selected()).toBe('mechanical');
  ref.instance.selected.set('records');
  await tick();
  expect(tabs.value).toBe('records');
  expect(records.getAttribute('aria-selected')).toBe('true');
});
