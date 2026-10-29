import '@angular/compiler';
import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createApplication } from '@angular/platform-browser';
import { createComponent, type ApplicationRef, type ComponentRef } from '@angular/core';
import { RequestReviewComponent } from '../src/request-review.component';

const mounted: {
  app: ApplicationRef;
  ref: ComponentRef<RequestReviewComponent>;
  host: HTMLElement;
}[] = [];
const tick = async () => {
  await new Promise<void>((r) => setTimeout(r, 70));
  for (const m of mounted) m.ref.changeDetectorRef.detectChanges();
};
afterEach(() => {
  for (const { app, ref, host } of mounted.splice(0)) {
    ref.destroy();
    app.destroy();
    host.remove();
  }
});

test('Angular reactive form controls RadioGroup and native submission/reset', async () => {
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
  const group = host.querySelector<
    HTMLElement & { value: string; updateComplete: Promise<unknown> }
  >('#rr-priority')!;
  const inputs = group.querySelectorAll<HTMLInputElement>('input');
  const form = host.querySelector('form')!;
  expect(group.value).toBe('');
  await userEvent.click(inputs[1]!);
  await tick();
  expect(ref.instance.form.controls.priority.value).toBe('engine');
  expect(new FormData(form).get('priority')).toBe('engine');
  ref.instance.form.controls.priority.setValue('body');
  await tick();
  expect(group.value).toBe('body');
  await userEvent.click(host.querySelector('wk-button-reset')!);
  await tick();
  expect(ref.instance.form.controls.priority.value).toBe('');
  expect(new FormData(form).has('priority')).toBe(false);
});
