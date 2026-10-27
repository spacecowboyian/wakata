import '@angular/compiler';
import { createApplication } from '@angular/platform-browser';
import { createComponent } from '@angular/core';
import { RequestReviewComponent } from './request-review.component';

const app = await createApplication();
const host = document.createElement('div');
const ref = createComponent(RequestReviewComponent, {
  environmentInjector: app.injector,
  hostElement: host,
});
app.attachView(ref.hostView);
ref.changeDetectorRef.detectChanges();
// Lion's form and select expect their light-DOM children at connection time.
document.getElementById('root')!.append(host);
