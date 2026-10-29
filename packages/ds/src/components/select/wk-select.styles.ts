import { css } from 'lit';

export const wkSelectStyles = css`
  :host {
    display: block;
    min-width: 0;
    max-width: 100%;
    color: var(--wk-text, #222);
    font-family: var(--wk-font, Arial, Helvetica, sans-serif);
  }
  .form-field__label {
    margin-block-end: 4px;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    overflow-wrap: anywhere;
  }
  .form-field__help-text,
  .form-field__feedback,
  .input-group__after {
    display: block;
    margin-block-start: 4px;
    font-size: 13px;
    line-height: 18px;
    overflow-wrap: anywhere;
  }
  :host([help-text]:not([help-text=''])) .form-field__help-text {
    margin-block-end: 8px;
  }
  :host([shows-feedback-for~='error']) .form-field__feedback,
  ::slotted([data-wk-external-error]) {
    margin-block-start: 8px;
  }
  .input-group__container {
    min-width: 0;
    min-height: 44px;
    border: 1px solid var(--wk-border, #999);
    border-radius: var(--wk-radius, 0px);
    background: var(--wk-surface, #fff);
  }
  .input-group__input {
    min-width: 0;
  }
  ::slotted(select[slot='input']) {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    min-height: 44px;
    padding-block: 8px;
    padding-inline: 12px 52px;
    border: 0;
    border-radius: max(0px, calc(var(--wk-radius, 0px) - 1px));
    appearance: none;
    background-color: var(--wk-surface, #fff);
    background-image:
      linear-gradient(45deg, transparent 42%, currentColor 42% 58%, transparent 58%),
      linear-gradient(-45deg, transparent 42%, currentColor 42% 58%, transparent 58%);
    background-size: 8px 8px;
    background-position:
      right 20px center,
      right 12px center;
    background-repeat: no-repeat;
    color: var(--wk-text, #222);
    font: inherit;
    line-height: 24px;
  }
  ::slotted(select[slot='input']:open) {
    background-image:
      linear-gradient(-45deg, transparent 42%, currentColor 42% 58%, transparent 58%),
      linear-gradient(45deg, transparent 42%, currentColor 42% 58%, transparent 58%);
  }
  ::slotted(select[slot='input']:focus-visible) {
    outline: 2px solid var(--wk-focus, #111);
    outline-offset: 2px;
  }
  :host(:has(> select[slot='input'][aria-invalid='true'])) .input-group__container {
    border-color: var(--wk-danger, #a02222);
  }
  ::slotted([data-wk-external-error]),
  :host([shows-feedback-for~='error']) .form-field__feedback {
    color: var(--wk-danger, #a02222);
  }
  :host([disabled]) .input-group__container {
    border-color: var(--wk-disabled-border, #ddd);
    background: var(--wk-disabled-bg, #eee);
    color: var(--wk-disabled-text, #777);
  }
  :host([disabled]) ::slotted(select[slot='input']) {
    background-color: var(--wk-disabled-bg, #eee);
    color: var(--wk-disabled-text, #777);
    cursor: not-allowed;
  }
  @media (forced-colors: active) {
    .input-group__container {
      border-color: CanvasText;
    }
    ::slotted(select[slot='input']),
    ::slotted(select[slot='input']:open) {
      appearance: auto;
      background-image: none;
      color: CanvasText;
    }
    ::slotted(select[slot='input']:focus-visible) {
      outline-color: Highlight;
    }
  }
`;
