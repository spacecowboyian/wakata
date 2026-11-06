import '@angular/compiler';
import { createApplication } from '@angular/platform-browser';
import { createComponent } from '@angular/core';
import { TabsDemoComponent } from './tabs-demo.component';

const app = await createApplication();
const host = document.createElement('div');
const ref = createComponent(TabsDemoComponent, {
  environmentInjector: app.injector,
  hostElement: host,
});
app.attachView(ref.hostView);
ref.changeDetectorRef.detectChanges();
document.getElementById('root')!.append(host);
