import '@angular/compiler';
import { afterEach, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { createApplication } from '@angular/platform-browser';
import { createComponent, type ApplicationRef, type ComponentRef } from '@angular/core';
import { WkButton } from '@wakata/ds/button';
import { WkTextField } from '@wakata/ds/text-field';
import { WkSelect } from '@wakata/ds/select';
import { WkCard } from '@wakata/ds/card';
import { WkDialog } from '@wakata/ds/dialog';
import { RequestReviewComponent } from '../src/request-review.component';

type El = HTMLElement & { updateComplete: Promise<unknown>; [k: string]: unknown };
const mounted: {
  app: ApplicationRef;
  ref: ComponentRef<RequestReviewComponent>;
  host: HTMLElement;
}[] = [];
// Flush Angular change detection explicitly so DOM assertions do not depend on scheduler timing.
const tick = async (ms = 60) => {
  await new Promise<void>((r) => setTimeout(r, ms));
  for (const m of mounted) m.ref.changeDetectorRef.detectChanges();
};

afterEach(() => {
  document.querySelectorAll('wk-dialog').forEach((d) => (d as unknown as WkDialog).close());
  for (const { app, ref, host } of mounted.splice(0)) {
    ref.destroy();
    app.destroy();
    host.remove();
  }
});

async function mount(completed: unknown[] = []) {
  const host = document.createElement('div');
  const app = await createApplication();
  const ref = createComponent(RequestReviewComponent, {
    environmentInjector: app.injector,
    hostElement: host,
  });
  ref.instance.completionMs = 150;
  ref.instance.onComplete = (d) => completed.push(d);
  app.attachView(ref.hostView);
  mounted.push({ app, ref, host });
  ref.changeDetectorRef.detectChanges();
  // Lion reads light-DOM children in connectedCallback. Connect Angular's
  // completed subtree as one unit rather than attaching each child in turn.
  document.body.append(host);
  await app.whenStable();
  await tick();
  const q = <T extends El>(id: string) => host.querySelector<T>(`#${id}`)!;
  return { host, q, c: ref.instance, dialog: host.querySelector<El>('wk-dialog')! };
}
type Q = Awaited<ReturnType<typeof mount>>['q'];
const submit = async (q: Q) => {
  await userEvent.click(q('rr-submit'));
  await tick();
};
const fill = async (q: Q) => {
  await userEvent.type(q('rr-name').querySelector('input')!, 'Ada Example');
  await userEvent.selectOptions(q('rr-destination').querySelector('select')!, 'oslo');
  await tick();
};

test('uses the real registered @wakata/ds elements', async () => {
  const { host, q } = await mount();
  const is = (sel: string, ctor: unknown) =>
    expect(host.querySelector(sel)).toBeInstanceOf(ctor as never);
  is('wk-card', WkCard);
  is('wk-text-field', WkTextField);
  is('wk-select', WkSelect);
  is('wk-dialog', WkDialog);
  is('#rr-cancel', WkButton);
  expect(customElements.get('wk-mode-switch')).toBeDefined();
  expect(q('rr-submit').tagName).toBe('WK-BUTTON-SUBMIT');
});

test('user edits update the reactive control once per wk-input; programmatic writes emit nothing', async () => {
  const { q, c } = await mount();
  const name = q('rr-name');
  let events = 0;
  let changes = 0;
  name.addEventListener('wk-input', () => events++);
  c.form.controls.traveller.valueChanges.subscribe(() => changes++);
  await userEvent.type(name.querySelector('input')!, 'Ada');
  expect(events).toBe(3);
  expect(changes).toBe(3);
  expect(c.form.controls.traveller.value).toBe('Ada');
  expect(c.form.controls.traveller.dirty).toBe(true);
  events = 0;
  changes = 0;
  c.form.controls.traveller.setValue('Programmatic');
  c.form.controls.destination.setValue('bergen');
  await tick();
  expect(events).toBe(0);
  expect(changes).toBe(1);
  expect(name.value).toBe('Programmatic');
  expect(name.querySelector('input')!.value).toBe('Programmatic');
  expect(q('rr-destination').querySelector('select')!.value).toBe('bergen');
});

test('touched, disabled, required, readonly and external error', async () => {
  const { q, c } = await mount();
  const ctl = c.form.controls.traveller;
  expect(ctl.touched).toBe(false);
  await userEvent.click(q('rr-name').querySelector('input')!);
  await userEvent.click(q('rr-destination').querySelector('select')!);
  await tick();
  expect(ctl.touched).toBe(true);
  expect(q('rr-name').hasAttribute('required')).toBe(true);
  expect(ctl.valid).toBe(false);
  ctl.disable();
  await tick();
  expect(q('rr-name').disabled).toBe(true);
  ctl.enable();
  await tick();
  expect(q('rr-name').disabled).toBe(false);
  c.setReadonly(true);
  await tick();
  expect(q('rr-name').querySelector('input')!.readOnly).toBe(true);
  c.setExternalError('Synthetic server error');
  await tick();
  expect(q('rr-name').querySelector('[data-wk-external-error]')?.textContent).toBe(
    'Synthetic server error',
  );
  await submit(q);
  expect(q('rr-status').textContent).toContain('correct');
  c.setExternalError('');
  await tick();
  expect(q('rr-name').querySelector('[data-wk-external-error]')).toBeNull();
});

test('FormData serialisation and native reset', async () => {
  const { host, q, c } = await mount();
  await fill(q);
  const form = host.querySelector('form')!;
  const data = new FormData(form);
  expect(data.get('traveller')).toBe('Ada Example');
  expect(data.get('destination')).toBe('oslo');
  c.form.controls.traveller.setValue('Grace');
  await tick();
  expect(new FormData(form).get('traveller')).toBe('Grace');
  await userEvent.click(host.querySelector<El>('wk-button-reset')!);
  await tick();
  expect(c.form.getRawValue()).toEqual({ traveller: '', destination: '' });
  expect(q('rr-name').value).toBe('');
  expect(new FormData(form).get('traveller')).toBe('');
  expect(q('rr-reopen').hasAttribute('disabled')).toBe(true);
});

test('invalid -> correction -> review -> cancel / reopen / confirm, repeated submit', async () => {
  const completed: unknown[] = [];
  const { q, dialog, c } = await mount(completed);
  await submit(q);
  expect(dialog.opened).toBe(false);
  expect(q('rr-status').textContent).toContain('correct');
  expect(q('rr-reopen').hasAttribute('disabled')).toBe(true);

  await fill(q);
  expect(q('rr-status').textContent).toBe('');
  await submit(q);
  expect(dialog.opened).toBe(true);
  expect(q('rr-summary').textContent).toBe('Ada Example → oslo');
  q('rr-submit').click();
  await tick();
  expect(q('rr-status').textContent).toMatch(/Ready|already/);

  q('rr-cancel').click();
  await tick();
  expect(dialog.opened).toBe(false);
  expect(completed).toHaveLength(0);
  expect(q('rr-reopen').hasAttribute('disabled')).toBe(false);

  q('rr-reopen').click();
  await tick();
  expect(dialog.opened).toBe(true);

  const confirm = q('rr-confirm');
  confirm.click();
  await tick();
  expect(confirm.loading).toBe(true);
  expect(q('rr-submit').disabled).toBe(true);
  expect(q('rr-cancel').disabled).toBe(true);
  confirm.click();
  confirm.click();
  await tick(300);
  expect(completed).toEqual([{ traveller: 'Ada Example', destination: 'oslo' }]);
  expect(c.processing()).toBe(false);
  expect(dialog.opened).toBe(false);
  expect(confirm.loading).toBeFalsy();
  expect(q('rr-submit').disabled).toBeFalsy();
  expect(q('rr-status').textContent).toContain('No real action');
});

test('simultaneous submits open one review', async () => {
  const { host, q, dialog, c } = await mount();
  c.form.setValue({ traveller: 'Ada', destination: 'oslo' });
  await tick();
  const wrapper = host.querySelector('wk-form')!;
  wrapper.dispatchEvent(new Event('submit'));
  wrapper.dispatchEvent(new Event('submit'));
  wrapper.dispatchEvent(new Event('submit'));
  await tick(200);
  expect(dialog.opened).toBe(true);
  expect(q('rr-status').textContent).toMatch(/Ready|already/);
});
