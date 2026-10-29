import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type El = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & Record<string, unknown>;
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'wk-mode-switch': El;
      'wk-card': El;
      'wk-form': El;
      'wk-text-field': El;
      'wk-text-area': El;
      'wk-select': El;
      'wk-button': El;
      'wk-button-submit': El;
      'wk-button-reset': El;
      'wk-dialog': El;
    }
  }
}
