import '@angular/compiler';
import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createApplication } from '@angular/platform-browser';
import { createComponent, type ApplicationRef, type ComponentRef } from '@angular/core';
import { RequestReviewComponent } from '../src/request-review.component';

type El = HTMLElement & { checked: boolean; opened: boolean };
const mounted: {
  app: ApplicationRef;
  ref: ComponentRef<RequestReviewComponent>;
  host: HTMLElement;
}[] = [];
const tick = async (ms = 60) => {
  await new Promise<void>((r) => setTimeout(r, ms));
  for (const m of mounted) m.ref.changeDetectorRef.detectChanges();
};

afterEach(() => {
  for (const { app, ref, host } of mounted.splice(0)) {
    ref.destroy();
    app.destroy();
    host.remove();
  }
});

async function mount() {
  const host = document.createElement('div');
  const app = await createApplication();
  const ref = createComponent(RequestReviewComponent, {
    environmentInjector: app.injector,
    hostElement: host,
  });
  app.attachView(ref.hostView);
  mounted.push({ app, ref, host });
  ref.changeDetectorRef.detectChanges();
  document.body.append(host);
  await app.whenStable();
  await tick();
  const q = (id: string) => host.querySelector<El>(`#${id}`)!;
  return { host, q, c: ref.instance, form: () => host.querySelector('form')! };
}

test('required checkbox group blocks review, serializes, resets and does not echo', async () => {
  const { host, q, c, form } = await mount();
  const email = q('rr-channel-email');
  const sms = q('rr-channel-sms');
  await userEvent.type(q('rr-name').querySelector('input')!, 'Ada Example');
  await userEvent.selectOptions(q('rr-destination').querySelector('select')!, 'oslo');
  await userEvent.click(q('rr-submit'));
  await tick();
  expect(host.querySelector<El>('wk-dialog')!.opened).toBe(false);

  let events = 0;
  email.addEventListener('wk-input', () => events++);
  await userEvent.click(email.querySelector('input')!);
  await tick();
  expect(events).toBe(1);
  expect(c.form.getRawValue().email).toBe(true);
  c.form.patchValue({ sms: true });
  await tick();
  expect(sms.checked).toBe(true);
  expect(events).toBe(1);
  expect(new FormData(form()).getAll('channels[]')).toEqual(['email', 'sms']);

  await userEvent.click(host.querySelector('wk-button-reset')!);
  await tick();
  expect(email.checked).toBe(false);
  expect(sms.checked).toBe(false);
  expect(new FormData(form()).getAll('channels[]')).toEqual([]);
});

test('switch is outside the form, stable label, never serializes', async () => {
  const { q, c, form } = await mount();
  const sw = q('rr-compact');
  expect(sw.closest('form')).toBeNull();
  const label = sw.textContent;
  await userEvent.click(sw.querySelector('[role="switch"]') ?? sw);
  await tick();
  expect(sw.checked).toBe(true);
  expect(c.compact()).toBe(true);
  expect(sw.textContent).toBe(label);
  expect([...new FormData(form()).keys()]).not.toContain('compact');
});
